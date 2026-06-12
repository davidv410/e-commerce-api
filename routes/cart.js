import express from 'express'
import { db } from '../db/db.js'
import { cart } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { protect } from '../middleware/protect.js'
import { cartItems } from '../db/schema.js'
import { product } from '../db/schema.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
    try{
        
        const [userCart] = await db.select()
        .from(cart)
        .where(eq(cart.userId, req.user.id))

        if(!userCart){ return res.json({ message: 'Cart is empty', cart: [] })}

        const cartContent = await db.select({ cartItemId: cartItems.id , productId: cartItems.productId, name: product.name, price: product.price, quantity: cartItems.quantity })
        .from(cartItems)
        .leftJoin(product, eq(cartItems.productId, product.id))
        .where(eq(cartItems.cartId, userCart.id))

        res.json(cartContent)

    }catch(error){

        console.log(error)

        res.status(500).json({ message: 'Server error' })

    }
})

router.post('/', protect, async (req, res) => {
    try{ 

        const transaction = await db.transaction(async (tx) => {

            let [userCart] = await tx.select()
            .from(cart)
            .where(eq(cart.userId, req.user.id))
    
            if(!userCart){ 
                [userCart] = await tx.insert(cart)
                .values({ userId: req.user.id })
                .returning() 
            }
    
            const cartContent = await tx.select()
            .from(cartItems)
            .where(eq(cartItems.productId, req.body.productId))
    
            if(cartContent.length > 0){ return { status: 400, message: "Product already in cart." }  }
    
            const [insertCart] = await tx.insert(cartItems)
            .values({ cartId: userCart.id, productId: req.body.productId, quantity: req.body.quantity})
            .returning()
    
            if(!insertCart) { return res.status(400).json({ message: 'Something went wrong' }) }

            return { status: 200, message: "Product added to cart!" }
        })

         return res.status(transaction.status).json({ message: transaction.message })


    }catch(error){

        console.log(error)

        res.status(500).json({ message: "Server error" })

    }
})

router.patch

router.delete('/product/:id', protect, async (req, res) => {

    try{

        const transaction = await db.transaction(async (tx) => {  
            const [getCart] = await tx.select()
            .from(cart)
            .where(
                eq(cart.userId, req.user.id)
            )
    
            const [deleteCartItem] = await tx.delete(cartItems)
            .where(and(
                eq(cartItems.productId, req.params.id),
                eq(cartItems.cartId, getCart.id)
            ))
            .returning()
    
            if(!deleteCartItem){ return { status: 404, message: "Product doesnt exist in cart" } }
    
            const itemsExist = await tx.select()
            .from(cartItems)
            .where(
                eq(cartItems.cartId, getCart.id))
    
            if(itemsExist.length > 0){ return { status: 200, message: "Product deleted" } }
    
            await tx.delete(cart)
            .where(eq(cart.userId, req.user.id))
            .returning()

            return { status: 200, message: "Last product and cart deleted" }
        })

        return res.status(transaction.status).json({ message: transaction.message })

    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router