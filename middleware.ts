import { CookieOptions, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  const emailLinkError = "Email link is invalid or has expired"
  if (
    req.nextUrl.searchParams.get("error_description") === emailLinkError &&
    req.nextUrl.pathname !== "/signup"
  ) {
    return NextResponse.redirect(
      new URL(
        `/signup?error_description=${req.nextUrl.searchParams.get(
          "error_description"
        )}`,
        req.url
      )
    )
  }

  if (["/login", "/signup"].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }
  return res
}
