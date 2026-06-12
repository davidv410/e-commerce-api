import express from 'express'
import { db } from '../db/db.js'
import { product } from '../db/schema.js'
import { productSchema } from '../validation/validation.js'
import { protect } from '../middleware/protect.js'
import { eq } from 'drizzle-orm'
import { updateProductSchema } from '../validation/validation.js'
import { ilike, gt, lt, and, desc, sql } from 'drizzle-orm'

const router = express.Router()

router.get('/', async (req, res) => {
// http://localhost:5000/product?search=monster&minPrice=1&maxPrice=5&page=1&limit=20
    try{
        const { search, minPrice, maxPrice } = req.query
    
        const page = Number(req.query.page) || 1

        const limit = Number(req.query.limit) || 20

        const offset = (page - 1) * limit
    
        const filters = []
    
        if(search && typeof(search) === 'string'){

            filters.push(ilike(product.name, `%${search}%`))

        }
    
        if(minPrice){ filters.push(gt(product.price, minPrice)) }

        if(maxPrice){ filters.push(lt(product.price, maxPrice)) }
    
        const [products, [{ count }]] = await Promise.all([
            db.select().from(product)
            .where(filters.length > 0 ? and(...filters) : undefined)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(product.createdAt)),
    
            db.select({ count: sql`count(*)::int` })
            .from(product)
            .where(filters.length > 0 ? and(...filters) : undefined)
        ])
    
        res.status(200).json({ products, total: count, page, limit })

    }catch(error){

        console.log(error)

        res.status(500).json({ message: 'Server error' })
        
    }
})

router.get('/:id', async (req, res) => {
    try{
        const productId = req.params.id
        
        const [data] = await db.select().from(product).where(eq(product.id, productId))

        if(!data){ return res.status(404).json({ msg: "Product not found" })}

        res.status(200).json(data)

    }catch(error){
        return res.status(500).json({ message: 'Server error' })
    }
})

router.post('/', protect, async (req, res) => {

    try{

        const result = await productSchema.safeParse(req.body)

        if(!result.success){ return res.status(400).json({ message: result.error.issues }) }

        const { name, price, description, stock } = result.data

        const [insertedProduct] = await db.insert(product).values({ 
            name,
            price,
            description, 
            stock,
            userId: req.user.id
        }).returning()

        return res.status(201).json({ message: "Product added", insertedProduct})

    }catch(error){

        return res.status(500).json({ message: 'Server error' })

    }

})

router.patch('/:id', protect, async (req, res) => {
    try{
        const productId = req.params.id

        const result = updateProductSchema.safeParse(req.body)

        if(!result.success){ return res.status(400).json({ message: result.error.issues }) }

        const [updateProduct] = await db.update(product).set(result.data).where(eq(product.id, productId)).returning()

        if(!updateProduct){ return res.status(404).json({ message: "Something went wrong, no product found." }) }

        return res.status(200).json({ message: `Product ${productId} updated`, updateProduct })

    }catch(error){

        console.log(error)

        return res.status(500).json({ message: 'Server error' })

    }
})

router.delete('/:id', protect, async (req, res) => {

    try{

        const productId = req.params.id

        const [removeProduct] = await db.delete(product).where(eq(product.id, productId)).returning()

        if(!removeProduct){ return res.status(404).json({ message: "Something went wrong, no product found." }) }

        return res.status(200).json({ message: `Product ${productId} removed`, removeProduct })

    }catch(error){

        return res.status(500).json({ message: 'Server error' })

    }

})

export default router