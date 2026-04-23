import { useEffect, useMemo, useState } from "react";
import ApiEndpointCard from "../components/ApiEndpointCard";
import ApiHeader from "../components/ApiHeader";
import PlaygroundPanel from "../components/PlaygroundPanel";
import SectionTabs from "../components/SectionTabs";
import UtilitySidebar from "../components/UtilitySidebar";
import { crudEndpoints } from "../data/crudEndpoints";
import { utilityEndpoints } from "../data/utilityEndpoints";
import type { ApiEndpoint, ApiSection } from "../types/api";
import UserSessionInfo from "../components/UserSessionInfo";

export default function ApiUtilitiesPage() {
    const [activeSection, setActiveSection] = useState<ApiSection>("utilities");
    const [selectedId, setSelectedId] = useState<string>(utilityEndpoints[0].id);

    const endpoints = useMemo<ApiEndpoint[]>(() => {
        return activeSection === "utilities" ? utilityEndpoints : crudEndpoints;
    }, [activeSection]);

    useEffect(() => {
        setSelectedId(endpoints[0]?.id ?? "");
    }, [activeSection, endpoints]);

    const selectedEndpoint = useMemo(() => {
        return endpoints.find((item) => item.id === selectedId) ?? endpoints[0];
    }, [endpoints, selectedId]);

    if (!selectedEndpoint) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f7f6f3] text-[#1a1a1a]">
            <div
                className="pointer-events-none absolute inset-0 opacity-100"
                style={{
                    background:
                        "radial-gradient(circle at 80% 20%, rgba(186,176,163,0.12), transparent 60%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8">
                <ApiHeader />

                <UserSessionInfo />

                <SectionTabs
                    activeSection={activeSection}
                    onChange={setActiveSection}
                />

                <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <UtilitySidebar
                        endpoints={endpoints}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />

                    <div className="grid gap-6">
                        <ApiEndpointCard endpoint={selectedEndpoint} />
                        <PlaygroundPanel endpoint={selectedEndpoint} />
                    </div>
                </div>
            </div>
        </div>
    );
}