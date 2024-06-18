import fs from "node:fs"
import {DateTime, Duration} from "luxon"

const CacheRoot = ".cache" as const;


type CacheMeta = {
    // All dates are stored as UTC timestamps
    createdAt: number;
    lastAccessedAt: number;

    expirationDuration: number;
    expiresAt: number;
}

type CacheEntry<TData> = {
    key: string;
    meta: CacheMeta;
    data: TData;
}

export type CacheEntryConfig = {
    expiry: any;
}

function parseExpiry(expiry: any): number {
    return Duration.fromDurationLike(expiry).as('seconds')
}

function getCachePath(key: string) {
    return `${CacheRoot}/${key}.json`;
}

async function createCacheItem<TData>(key: string, factory: () => Promise<TData>, cfg: CacheEntryConfig) {
    console.log(`Cache miss for ${key}`)
    if (fs.existsSync(getCachePath(key))) fs.rmSync(getCachePath(key))

    const data = await factory();

    const createdAt = DateTime.now().toUTC().toUnixInteger();
    const lastAccessedAt = DateTime.now().toUTC().toUnixInteger();
    const expirationDuration = parseExpiry(cfg.expiry);

    const entry = {
        key,
        meta: {
            createdAt,
            lastAccessedAt,
            expirationDuration,
            expiresAt: createdAt + expirationDuration
        },
        data
    } as const satisfies CacheEntry<TData>;

    fs.writeFileSync(getCachePath(key), JSON.stringify(entry));

    return data;
}


function validateEntry<TData>(key: string, entry: CacheEntry<TData>) {
    if (entry.key !== key) return false;
    if (DateTime.fromSeconds(entry.meta.createdAt) > DateTime.now().toUTC()) return false;
    if (DateTime.fromSeconds(entry.meta.expiresAt) < DateTime.now().toUTC()) return false;

    return true;
}

export async function cached<TData>(key: string, factory: () => Promise<TData>, cfg: CacheEntryConfig = {expiry: {minute: 1}}) {
    if (!fs.existsSync(CacheRoot)) fs.mkdirSync(CacheRoot);
    if (!fs.existsSync(getCachePath(key))) return await createCacheItem(key, factory, cfg);
    try {

        const entry: CacheEntry<TData> = JSON.parse(fs.readFileSync(getCachePath(key)).toString());
        if (!validateEntry(key, entry)) return await createCacheItem(key, factory, cfg);

        return entry.data
    } catch (e) {
        return await createCacheItem(key, factory, cfg);
    }
}