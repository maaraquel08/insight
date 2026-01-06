import * as React from "react";
import { X, Filter } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipsFilterVariants = cva(
    "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full border border-[#d9dede] bg-[#f1f2f3] text-xs font-medium cursor-pointer hover:bg-[#e8e9ea] transition-colors",
    {
        variants: {
            variant: {
                default: "border-[#d9dede] bg-[#f1f2f3] hover:bg-[#e8e9ea]",
                active: "border-[#d9dede] bg-white hover:bg-[#f9f9fa]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface ChipsFilterProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof chipsFilterVariants> {
    label: string;
    count?: number;
    onRemove?: () => void;
    showFilterIcon?: boolean;
    showRemoveIcon?: boolean;
}

const ChipsFilter = React.forwardRef<HTMLDivElement, ChipsFilterProps>(
    (
        {
            className,
            variant,
            label,
            count,
            onRemove,
            showFilterIcon = true,
            showRemoveIcon = true,
            onClick,
            ...props
        },
        ref
    ) => {
        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (onClick) {
                onClick(e);
            }
        };

        const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (onRemove) {
                onRemove();
            }
        };

        return (
            <div
                ref={ref}
                className={cn(chipsFilterVariants({ variant, className }))}
                onClick={handleClick}
                {...props}
            >
                {showFilterIcon && (
                    <Filter className="h-4 w-4 text-[#262b2b] shrink-0" />
                )}
                <span className="text-[#262b2b] whitespace-nowrap">
                    {label}
                </span>
                {count !== undefined && count > 0 && (
                    <div className="bg-[#da2f38] flex items-center justify-center min-w-[16px] px-1 py-0.5 rounded-full shrink-0">
                        <span className="text-white text-xs font-medium leading-none uppercase tracking-wide">
                            {count}
                        </span>
                    </div>
                )}
                {showRemoveIcon && (
                    <button
                        onClick={handleRemove}
                        className="flex items-center justify-center h-4 w-4 rounded hover:bg-[#da2f38]/10 transition-colors shrink-0"
                        type="button"
                    >
                        <X className="h-4 w-4 text-[#262b2b] hover:text-[#da2f38]" />
                    </button>
                )}
            </div>
        );
    }
);

ChipsFilter.displayName = "ChipsFilter";

export { ChipsFilter, chipsFilterVariants };
