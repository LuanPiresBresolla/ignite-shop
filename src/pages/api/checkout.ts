import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { defaultPriceId, productId } = request.body

  if (request.method !== 'POST') {
    return response.status(404).json({ error: 'Method not allowed' })
  }

  if (!defaultPriceId || !productId) {
    return response.status(400).json({ error: 'Invalid parameters' })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: defaultPriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_URL}/product/${productId}`,
  })

  return response.status(201).json({ checkoutUrl: checkoutSession.url })
}
