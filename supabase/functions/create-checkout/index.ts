
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        const { priceId: rawPriceId } = await req.json()
        const priceId = rawPriceId?.trim()
        const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
            apiVersion: '2022-11-15',
            httpClient: Stripe.createFetchHttpClient(),
        })

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/?success=true`,
            cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
            client_reference_id: user.id,
            customer_email: user.email,
        })

        return new Response(
            JSON.stringify({ url: session.url }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error processing checkout:', error)
        return new Response(
            JSON.stringify({ error: (error as any).message || String(error) }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    }
})
