import React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ButtonLoading = ({
    type = "button",
    text = "Submit",
    loading = false,
    loadingText = "Please wait...",
    disabled = false,
    className,
    onClick,
    ...props
}) => {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={cn("flex items-center gap-2", className)}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? loadingText : text}
        </Button>
    )
}

export default ButtonLoading
