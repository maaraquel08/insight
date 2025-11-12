"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PeopleHealthSection } from "@/components/dashboard/people-health-section";

export default function Home() {
    const router = useRouter();

    const handleCreateReport = () => {
        router.push("/create-report");
    };

    return (
        <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
            <div className="flex flex-col gap-6 p-10 flex-1">
                <div className="flex flex-col gap-6 items-start max-w-[1320px] w-full mx-auto">
                    <PageHeader
                        title="Foresight Analytics"
                        description="Central analytics tool for key decision makers, CEO, admin, COO, executives"
                        actionLabel="Create Report"
                        onAction={handleCreateReport}
                    />

                    {/* Dashboard Content */}
                    <div className="w-full">
                        <PeopleHealthSection />
                    </div>
                </div>
            </div>
        </main>
    );
}
