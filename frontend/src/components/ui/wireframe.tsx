import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const wireframeVariants = cva(
    "relative rounded-lg border-2 border-dashed p-4",
    {
        variants: {
            tone: {
                default:
                    "border-muted-foreground/40 bg-muted/20 text-muted-foreground",
                subtle:
                    "border-border bg-background text-muted-foreground",
            },
        },
        defaultVariants: {
            tone: "default",
        },
    }
)

export interface WireframeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wireframeVariants> {
    label?: string
}

export function Wireframe({
    label,
    tone,
    className,
    children,
    ...props
}: WireframeProps) {
    if (process.env.NODE_ENV === "production") {
        return null
    }

    return (
        <div
            className={cn(wireframeVariants({ tone }), className)}
            {...props}
        >
            {label && (
                <div className="absolute -top-3 left-3 bg-background px-2 text-xs font-medium">
                    {label}
                </div>
            )}

            {children}
        </div>
    )
}