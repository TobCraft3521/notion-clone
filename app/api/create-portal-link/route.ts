import { stripe } from "@/lib/stripe"
import { createOrRetrieveCustomer } from "@/lib/stripe/adminTasks"
import { getURL } from "@/lib/utils"
import { CookieOptions, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
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

    if (!user) throw new Error("User not found")

    const customer = await createOrRetrieveCustomer({
      email: user?.email || "",
      uuid: user?.id || "",
    })

    if (!customer) throw new Error("Customer not found")

    const { url } = await stripe.billingPortal.sessions.create({
      customer: customer,
      return_url: `${getURL()}/dashboard`,
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
