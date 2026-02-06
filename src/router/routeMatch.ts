// src/router/routeMatch.ts
import { ROUTES } from "@/config/navigations/routes";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toRegex = (path: string) => {
    const parts = path.split("/").map((p) => (p.startsWith(":") ? "[^/]+" : escapeRegex(p)));
    return new RegExp(`^${parts.join("/")}$`);
};

type RouteConfig = (typeof ROUTES)[keyof typeof ROUTES];

const INDEX = Object.values(ROUTES).map((r) => ({
    route: r,
    re: toRegex(r.path),
}));

export function matchRoute(pathname: string, hash?: string): RouteConfig | null {
    const full = `${pathname}${hash || ""}`;
    return (
        INDEX.find((x) => x.re.test(full))?.route ||
        INDEX.find((x) => x.re.test(pathname))?.route ||
        null
    );
}
