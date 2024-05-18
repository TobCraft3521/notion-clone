import { stripe } from "@/lib/stripe"
import { createOrRetrieveCustomer } from "@/lib/stripe/adminTasks"
import { getURL } from "@/lib/utils"
import { CookieOptions, createServerClient } from "@supabase/ssr"
import { uuid } from "drizzle-orm/pg-core"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json()
  const cookieStore = cookies()
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      }
    )
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const customer = await createOrRetrieveCustomer({
      email: user?.email || "",
      uuid: user?.id || "",
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer: customer || undefined,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 30,
        metadata,
      },
      success_url: `${getURL()}/dashboard`,
      cancel_url: `${getURL()}/dashboard`,
    })
    return NextResponse.json({
      sessionId: session.id,
    })
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
