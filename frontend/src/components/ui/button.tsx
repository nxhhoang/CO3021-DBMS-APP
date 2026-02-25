import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
    variant?: "default" | "outline" | "ghost" | "link"
    size?: "default" | "sm" | "lg"
    asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
                    variant === "outline" && "border border-input hover:bg-accent hover:text-accent-foreground",
                    variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
                    variant === "link" && "text-primary underline-offset-4 hover:underline",
                    size === "default" && "h-10 px-4 py-2",
                    size === "sm" && "h-9 px-3 rounded-md",
                    size === "lg" && "h-11 px-8 rounded-md",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"