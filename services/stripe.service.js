import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import { db } from '../db/db.js'
import { cart, cartItems, product } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export const checkout = async (id) => {
    try{
      const getItems = await db.select({ name: product.name, price: product.price, quantity: cartItems.quantity})
      .from(cartItems)
      .innerJoin(cart, eq(cart.id, cartItems.cartId))
      .innerJoin(product, (eq(product.id, cartItems.productId)))
      .where(eq(cart.userId, id))

      if(!getItems.length) {
        return { status: 400, data: [] }
      }
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: getItems.map(item => ({
          price_data: {
            currency: 'eur',
            product_data: { name: item.name },
            unit_amount: Math.round(Number(item.price) * 100)
          },
          quantity: item.quantity
        })),
        metadata: { userId: id },
        success_url: `${process.env.BASE_URL}/success`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
      })

      return { status: 200, url: session.url }
      
    }catch(error){
      console.log(error)
      return { status: 500, message: error }
    }
}