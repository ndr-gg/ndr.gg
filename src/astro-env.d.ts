declare module "@11ty/eleventy-fetch";
declare module "luxon";
declare module "astro/client";

interface ImportMetaEnv {
    SECRET_APIKEY_LASTFM: string,
    SECRET_APIKEY_STEAM: string,
    SECRET_ID_STEAM: string,
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}