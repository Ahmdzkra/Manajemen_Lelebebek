import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ 
    className, 
    variant = "default", 
    size = "default", 
    asChild = false, 
    ...props 
}, ref) => {
    
    // Mapping variant ke class Tailwind manual
    const variants = {
        default: "bg-green-600 text-white shadow-sm hover:bg-green-700",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline: "border border-gray-300 dark:border-slate-600 bg-transparent shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200",
        secondary: "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm hover:bg-gray-200 dark:hover:bg-slate-600",
        ghost: "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200",
        link: "text-green-600 dark:text-green-400 underline-offset-4 hover:underline",
        warning: "bg-amber-500 text-white shadow-sm hover:bg-amber-600",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50";

    return (
        <button
            ref={ref}
            className={cn(
                baseStyles,
                variants[variant] || variants.default,
                sizes[size] || sizes.default,
                className
            )}
            {...props}
        />
    );
});

Button.displayName = "Button";

export { Button };
export default Button;
