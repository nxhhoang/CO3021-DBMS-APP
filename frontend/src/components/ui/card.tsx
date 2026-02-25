import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border bg-card text-card-foreground shadow-sm",
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-col space-y-1.5 p-6",
                className
            )}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                "text-lg font-semibold leading-none tracking-tight",
                className
            )}
            {...props}
        />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                "text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "p-6 pt-0",
                className
            )}
            {...props}
        />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex items-center p-6 pt-0",
                className
            )}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

export interface CardMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    containerClassName?: string;
}

const CardMedia = React.forwardRef<HTMLImageElement, CardMediaProps>(
    ({ className, containerClassName, alt = "Card image", ...props }, ref) => (
        <div className={cn("relative w-full h-48 overflow-hidden", containerClassName)}>
            <img
                ref={ref}
                alt={alt}
                className={cn("h-full w-full object-cover transition-all hover:scale-105", className)}
                {...props}
            />
        </div>
    )
);
CardMedia.displayName = "CardMedia";

export { Card, CardHeader, CardTitle, CardContent, CardFooter, CardMedia, CardDescription }