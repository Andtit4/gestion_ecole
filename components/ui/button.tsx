import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../app/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success-500 text-white shadow-sm hover:bg-success-600 hover:shadow-md",
        warning: "bg-warning-500 text-white shadow-sm hover:bg-warning-600 hover:shadow-md",
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/70",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    if (asChild) {
      const propsWithoutClassName = { ...props };
      if ('className' in propsWithoutClassName) {
        delete propsWithoutClassName.className;
      }
      return <React.Fragment {...propsWithoutClassName} />
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

// Composants Button spécialisés
export const IconButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'leftIcon' | 'rightIcon'> & { icon: React.ReactNode }>(
  ({ icon, className, size = "icon", ...props }, ref) => (
    <Button ref={ref} size={size} className={className} {...props}>
      {icon}
    </Button>
  )
)
IconButton.displayName = "IconButton"

export const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, children, ...props }, ref) => (
    <Button ref={ref} loading={loading} {...props}>
      {children}
    </Button>
  )
)
LoadingButton.displayName = "LoadingButton"

export { Button, buttonVariants, IconButton, LoadingButton } 


