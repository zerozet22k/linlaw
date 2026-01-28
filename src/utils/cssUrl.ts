export const cssUrl = (input?: unknown): string | undefined => {
    if (input == null) return undefined;
    const url = String(input).trim();
    if (!url) return undefined;
    return `url(${JSON.stringify(url)})`;
};
