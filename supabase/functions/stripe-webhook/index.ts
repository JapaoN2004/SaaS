// Follow this setup guide to integrate Stripe with your Supabase project
// 1. Create a new Edge Function in Supabase Dashboard named 'stripe-webhook'
// 2. Add STRIPE_WEBHOOK_SECRET and STRIPE_API_KEY to your Edge Function Secrets
// 3. Deploy this code

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") as string, {
    apiVersion: "2022-11-15",
    httpClient: Stripe.createFetchHttpClient(),
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
    const signature = req.headers.get("Stripe-Signature")
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")

    if (!signature || !webhookSecret) {
        return new Response("Missing signature or secret", { status: 400 })
    }

    let event
    try {
        const body = await req.text()
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, cryptoProvider)
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object
                const userId = session.client_reference_id // Make sure to pass client_reference_id from frontend!
                const subscriptionId = session.subscription
                const customerId = session.customer

                if (userId) {
                    await supabase.from("subscriptions").upsert({
                        user_id: userId,
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                        status: 'active',
                        current_period_end: new Date(session.expires_at ? session.expires_at * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Fallback or fetch sub details
                    })
                }
                break
            }
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object
                // Update database with new status
                await supabase.from("subscriptions").update({
                    status: subscription.status,
                    current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
                }).eq("stripe_subscription_id", subscription.id)
                break
            }
        }
    } catch (error) {
        return new Response(`Error processing event: ${error.message}`, { status: 500 })
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
    })
})
