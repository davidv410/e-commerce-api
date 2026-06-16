import { db } from '../db/db.js'
import { product } from '../db/schema.js'
import { productSchema, updateProductSchema } from '../validation/validation.js'
import { uploadProductImage } from './image.service.js'
import { eq, and, ilike, gt, lt, desc, sql } from 'drizzle-orm'

export const getProducts = async (query) => {
    const { search, minPrice, maxPrice } = query
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
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

    return { products, total: count, page, limit }
}

export const getProduct = async (id) => {
    const productId = id

    const [data] = await db.select().from(product).where(eq(product.id, productId))
    if(!data){ return { status: 404, message: "Product not found" }}

    return { status: 200, message: data }
}

export const createProduct = async (body, id, files) => {
    const result = await productSchema.safeParse(body)
    if(!result.success){ return { status: 400, message: result.error.issues } }

    const { name, price, description, stock } = result.data
    const [insertedProduct] = await db.insert(product).values({ 
        name,
        price,
        description, 
        stock,
        userId: id
    }).returning()

    if(files || files.length > 0){await uploadProductImage(files, insertedProduct.id)}

    return { status: 201, message: "Product added", insertedProduct}
}

export const updateProduct = async (id, body, userId) => {
    const productId = id

    const result = updateProductSchema.safeParse(body)
    if(!result.success){ return { status: 400, message: result.error.issues } }

    const [updateProduct] = await db.update(product).set(result.data).where(and(eq(product.id, productId), eq(product.userId, userId))).returning()
    if(!updateProduct){ return { satus: 404, message: "Something went wrong, no product found." } }

    return { status: 200 ,message: `Product ${productId} updated`, updateProduct }
}

export const deleteProduct = async (id, userId) => {
    const productId = id

    const [removeProduct] = await db.delete(product).where(and(eq(product.id, productId), eq(product.userId, userId))).returning()
    if(!removeProduct){ return { status: 404, message: "Something went wrong, no product found." } }
    
    return { status: 200, message: `Product ${productId} removed`, removeProduct }
}