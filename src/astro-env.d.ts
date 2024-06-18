declare module "@11ty/eleventy-fetch";
declare module "luxon";
declare module "astro/client";

interface ImportMetaEnv {
    SECRET_APIKEY_LASTFM: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}