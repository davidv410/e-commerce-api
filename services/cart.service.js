import { db } from '../db/db.js'
import { cart, cartItems, product } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

export const getCart = async (id) => {
    const [userCart] = await db.select().from(cart).where(eq(cart.userId, id))
    if(!userCart){ return { status: 404, message: 'Cart is empty', cart: [] } }
    
    const cartContent = await db.select({ 
        cartItemId: cartItems.id, 
        productId: cartItems.productId, 
        name: product.name, 
        price: product.price, 
        quantity: cartItems.quantity 
    })
    .from(cartItems)
    .leftJoin(product, eq(cartItems.productId, product.id))
    .where(eq(cartItems.cartId, userCart.id))
    
    return { status: 200, cart: cartContent }
} 


export const addToCart = async (id, productId, quantity) => {
    const transaction = await db.transaction(async (tx) => {
        let [userCart] = await tx.select().from(cart).where(eq(cart.userId, id))

        if(!userCart){ 
            [userCart] = await tx.insert(cart).values({ userId: id }).returning() 
        }

        const cartContent = await tx.select().from(cartItems).where(eq(cartItems.productId, productId))
        if(cartContent.length > 0){ return { status: 400, message: "Product already in cart." }  }

        const [insertCart] = await tx.insert(cartItems)
        .values({ cartId: userCart.id, productId: productId, quantity: quantity})
        .returning()

        if(!insertCart) { return res.status(400).json({ message: 'Something went wrong' }) }

        return { status: 200, message: "Product added to cart!" }
    })

    return { status: transaction.status, message: transaction.message}
}

export const updateQuantity = async (body, userId, id) => {
    const { quantity } = body
    
    if (typeof quantity !== 'number' || quantity < 0) { return { status: 400, message: 'Invalid quantity' } }

    const [findCart] = await db.select().from(cart).where(eq(cart.userId, userId)) 
    if(!findCart){ return { status: 404,  message: 'cart empty' } }

    const [findItem] = await db.select().from(cartItems).where(
        and(
            eq(cartItems.productId, id),
            eq(cartItems.cartId, findCart.id)
        )
    )
    if(!findItem){ return { status: 404, message: 'Product not found in cart' } }


    if(quantity === 0){
        await db.delete(cartItems).where(eq(cartItems.productId, id))
        return { status: 200, message: "Item deleted!" }
    }

    const [updateQuantity] = await db.update(cartItems).set({ quantity: quantity }).where(eq(cartItems.productId, id)).returning()

    return { status: 200, message: "Quantity updated!" }
}

export const removeFromCart = async (userId, id) => {
    const transaction = await db.transaction(async (tx) => {  
        const [getCart] = await tx.select().from(cart).where(eq(cart.userId, userId))

        const [deleteCartItem] = await tx.delete(cartItems)
        .where(and(
            eq(cartItems.productId, id),
            eq(cartItems.cartId, getCart.id)
        ))
        .returning()

        if(!deleteCartItem){ return { status: 404, message: "Product doesnt exist in cart" } }

        const itemsExist = await tx.select().from(cartItems).where(eq(cartItems.cartId, getCart.id))
        if(itemsExist.length > 0){ return { status: 200, message: "Product deleted" } }

        await tx.delete(cart).where(eq(cart.userId, userId)).returning()

        return { status: 200, message: "Last product and cart deleted" }
    })

    return { status: transaction.status, message: transaction.message }
}