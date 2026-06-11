import express from 'express'
import { db } from '../db/db.js'
import { product } from '../db/schema.js'
import { productSchema } from '../validation/validation.js'
import { protect } from '../middleware/protect.js'
import { eq } from 'drizzle-orm'

const router = express.Router()

router.get('/', async (req, res) => {
    try{

        const data = await db.select().from(product)

        if(data.length === 0){ return res.json({ messag: 'No products in database' }) } 

        res.status(200).json(data)

    }catch(error){

        console.log(error)

        return res.status(500).json({ message: 'Server error' })

    }
})

router.get('/:id', async (req, res) => {
    try{
        const productId = req.params.id
        
        const [data] = await db.select().from(product).where(eq(product.id, productId))

        res.status(200).json(data)

    }catch(error){
        return res.status(500).json({ message: 'Server error' })
    }
})

router.post('/', protect, async (req, res) => {

    try{

        const result = await productSchema.safeParse(req.body)

        if(!result.success){ return res.status(400).json({ messag: result.error.issues }) }

        const { name, price, description, stock } = result.data

        const [insertedProduct] = await db.insert(product).values({ 
            name,
            price,
            description, 
            stock,
            userId: req.user.id
        }).returning()

        return res.status(200).json({ message: "Product added", insertedProduct})

    }catch(error){

        return res.status(500).json({ message: 'Server error' })

    }

})

router.put('/:id', protect, async (req, res) => {
    try{
        const productId = req.params.id

        console.log(req.body)

        const [updateProduct] = await db.update(product).set(req.body).where(eq(product.id, productId)).returning()

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