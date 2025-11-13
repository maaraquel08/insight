"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    personalizeLabel?: string;
    onPersonalize?: () => void;
}

export function PageHeader({
    title,
    description,
    actionLabel = "Create Report",
    onAction,
    personalizeLabel = "Personalize",
    onPersonalize,
}: PageHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isMainPage = pathname === "/";

    const handleBack = () => {
        router.push("/");
    };

    return (
        <div className="flex items-center justify-between w-full max-w-[1320px] rounded-lg">
            <div className="flex items-center gap-3">
                {!isMainPage && (
                    <Button
                        onClick={handleBack}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg hover:bg-[#f1f2f3]"
                    >
                        <ArrowLeft className="h-5 w-5 text-[#262b2b]" />
                    </Button>
                )}
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-2xl font-medium text-[#262b2b] leading-8 tracking-[-0.7px]">
                        {title}
                    </h1>
                    <p className="text-sm font-normal text-[#5d6c6b] leading-5">
                        {description}
                    </p>
                </div>
            </div>
            {(actionLabel && onAction) ||
            (personalizeLabel && onPersonalize) ? (
                <div className="flex items-center justify-end gap-2">
                    {personalizeLabel && onPersonalize && (
                        <Button
                            onClick={onPersonalize}
                            variant="outline"
                            className="h-9 min-w-[56px] px-2 py-3 rounded-lg border-[#b8c1c0] text-[#262b2b] hover:bg-[#f1f2f3]"
                            size="sm"
                        >
                            {personalizeLabel}
                        </Button>
                    )}
                    {actionLabel && onAction && (
                        <Button
                            onClick={onAction}
                            className="bg-[#158039] hover:bg-[#158039]/90 text-white h-9 min-w-[56px] px-2 py-3 rounded-lg"
                            size="sm"
                        >
                            {actionLabel}
                        </Button>
                    )}
                </div>
            ) : null}
        </div>
    );
}
