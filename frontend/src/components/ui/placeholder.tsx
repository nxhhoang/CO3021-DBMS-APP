import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const placeholderVariants = cva(
    "flex items-center justify-center rounded-lg border-2 border-dashed text-sm font-medium tracking-wide",
    {
        variants: {
            size: {
                sm: "h-24",
                md: "h-40",
                lg: "h-64",
            },
            tone: {
                default:
                    "bg-muted/30 text-muted-foreground border-muted-foreground/40",
                subtle:
                    "bg-background text-muted-foreground border-border",
            },
        },
        defaultVariants: {
            size: "md",
            tone: "default",
        },
    }
)

export interface PlaceholderProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof placeholderVariants> {
    label: string
}

export function Placeholder({
    label,
    size,
    tone,
    className,
    ...props
}: PlaceholderProps) {
    if (process.env.NODE_ENV === "production") {
        return null
    }

    return (
        <div
            className={cn(placeholderVariants({ size, tone }), className)}
            {...props}
        >
            <span className="opacity-70">{label}</span>
        </div>
    )
}