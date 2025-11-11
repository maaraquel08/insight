"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export default function Home() {
    const router = useRouter();

    const handleCreateReport = () => {
        router.push("/create-report");
    };

    return (
        <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
            <div className="flex flex-col gap-4 p-10 flex-1">
                <div className="flex flex-col gap-4 items-start max-w-[1320px] w-full mx-auto">
                    <PageHeader
                        title="Reports Hub"
                        description="Select to the available Reports"
                        actionLabel="Create Report"
                        onAction={handleCreateReport}
                    />
                </div>
            </div>
        </main>
    );
}
