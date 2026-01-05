/* RELATED_BUSINESSES_PAGE_SETTINGS */
export const dynamic = "force-dynamic";

import React from "react";
import PageService from "@/services/PageService";

import RelatedBusinessesContent from "./content";

import {
    RELATED_BUSINESSES_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/keys/RELATED_BUSINESSES_PAGE_SETTINGS";

const getDefaultRelatedBusinessesData = () => ({
    [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.SECTIONS]: {
        maxBusinessesCount: 50,
        includeInactive: 0,
    },
});

const fetchRelatedBusinessesData = async () => {
    const pageService = new PageService();
    const fetchedData = await pageService.getPagesByKeys(
        Object.values(RELATED_BUSINESSES_PAGE_SETTINGS_KEYS)
    );

    return {
        ...getDefaultRelatedBusinessesData(),
        ...fetchedData,
    };
};

const RelatedBusinessesPage = async () => {
    const data = await fetchRelatedBusinessesData();
    return <RelatedBusinessesContent data={data} />;
};

export default RelatedBusinessesPage;
