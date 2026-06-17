import 'dotenv/config'
import express from 'express'
import Stripe from 'stripe'
import { protect } from '../middleware/protect.js';
import { db } from '../db/db.js'
import { orders, cart } from '../db/schema.js'
import { eq } from 'drizzle-orm'  

const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature error:', err.message);
        return res.status(400).json({ error: 'Invalid signature' });
    }

    if (event.type === 'checkout.session.completed') {
        const { metadata, amount_total } = event.data.object

        const [createOrder] = await db.insert(orders).values({ userId: metadata.userId, email: metadata.email, amount: amount_total / 100 }).returning()
        if(!createOrder){ return res.status(400).json({ error: 'something went wrong' }) }

        const [clearCart] = await db.delete(cart).where(eq(cart.userId, metadata.userId)).returning()
        //POSLAT MAIL
        console.log('send email')
        console.log('Payment success:', metadata.userId);
    }

    res.json({ received: true });
})

export default router