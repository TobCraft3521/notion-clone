"use client"

import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider"
import { Price, ProductWithPrice } from "@/lib/supabase/supabase.types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider"
import React, { useState } from "react"
import { Button } from "../ui/button"
import Loader from "./Loader"
import { formatPrice, postData } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { getStripe } from "@/lib/stripe/stripeClient"

interface SubscriptionModalProps {
  products: ProductWithPrice[]
}

const SubscriptionModal = ({ products }: SubscriptionModalProps) => {
  const { open, setOpen } = useSubscriptionModal()
  const { subscription } = useSupabaseUser()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSupabaseUser()
  const { toast } = useToast()

  const onClickContinue = async (price: Price) => {
    try {
      setIsLoading(true)
      if (!user) {
        toast({ title: "You must be logged in" })
        setIsLoading(false)
        return
      }
      if (subscription) {
        toast({ title: "Already on the PRO plan" })
        setIsLoading(false)
        return
      }
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      })
      console.log("Getting checkout for stripe")
      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      toast({ title: "Oppse! Something went wrong.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {subscription?.status === "active" ? (
        <DialogContent>Already on the PRO plan</DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to PRO</DialogTitle>
            <DialogDescription>
              To access PRO features you need to upgrade your account.
            </DialogDescription>
            {products.length ? (
              products.map((product) => (
                <div
                  className="flex justify-between items-center"
                  key={product.id}
                >
                  {product.prices?.map((price) => (
                    <React.Fragment>
                      <b className="text-3xl text-foreground">
                        {formatPrice(price)} / <small>{price.interval}</small>
                      </b>
                      <Button
                        onClick={() => onClickContinue(price)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "Upgrade ✨"}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              ))
            ) : (
              <div></div>
            )}
            {/* No Products Available */}
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default SubscriptionModal
