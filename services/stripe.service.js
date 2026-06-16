import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkout = async (body, id) => {
    //OVDJE CU MORAT DODAT ZAPRAVO SELECT IZ CARTA, BAZE

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: body.items.map(item => ({
        price_data: {
            //NOVAC PROMJENIT
          currency: 'usd',
          product_data: { name: item.name },
            //CIJENA IZ BAZE
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      //TREBO BI EMAIL UMJESTO ID
      metadata: { userId: id },
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    return { status: 200, url: session.url }
}