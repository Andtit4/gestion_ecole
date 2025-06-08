import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success-100 text-success-800 hover:bg-success-200",
        warning:
          "border-transparent bg-warning-100 text-warning-800 hover:bg-warning-200",
        admin:
          "border-transparent bg-admin-100 text-admin-700 hover:bg-admin-200",
        teacher:
          "border-transparent bg-teacher-100 text-teacher-700 hover:bg-teacher-200",
        student:
          "border-transparent bg-student-100 text-student-700 hover:bg-student-200",
        parent:
          "border-transparent bg-parent-100 text-parent-700 hover:bg-parent-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 