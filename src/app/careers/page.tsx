// app/careers/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import PageService from "@/services/PageService";
import { CAREER_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/CAREER_PAGE_SETTINGS";
import CareersContent from "./content";

const getDefaultCareersData = () => ({
    [CAREER_PAGE_SETTINGS_KEYS.JOBS_SECTION]: { items: [] },
});

const fetchCareersData = async () => {
    const pageService = new PageService();
    const fetched = await pageService.getPagesByKeys(
        Object.values(CAREER_PAGE_SETTINGS_KEYS)
    );
    return { ...getDefaultCareersData(), ...fetched };
};

const CareersPage = async () => {
    const data = await fetchCareersData();
    return <CareersContent data={data} />;
};

export default CareersPage;
