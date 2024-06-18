import {getLastSong as getLastSongCore} from "./core/api/lastfm.ts";
import env from "../env.ts";

type SongBase = {
    artistName: string;
    streamable: boolean;
    images: Record<string, string>; // size, url
    largestImage: string;
    albumName: string;
    trackName: string;
    trackUrl: string;
}

type CurrentSong = SongBase & {
    isCurrentlyPlaying: true;
}

type LastSong = SongBase & {
    isCurrentlyPlaying: false;
    playedAt: number;
}

export type Song = CurrentSong | LastSong;

function getSizeNumber(size: string) {
    if (size === 'small') return 1;
    if (size === 'medium') return 2;
    if (size === 'large') return 3;
    if (size === 'extralarge') return 4;
    return 5;
}

export function isLastSong(song: Song): song is LastSong {
    return !song.isCurrentlyPlaying
}

export default async function getLastSong(): Promise<Song> {

    const username = "ndr_gg";
    const apikey = env.server.apikey.lastFm;
    const response = await getLastSongCore(username, apikey);

    const isCurrentlyPlaying = response["@attr"]?.nowplaying === "true";

    const images = Object.fromEntries(response.image.map(image => [image.size, image["#text"]]));
    const [_, largestImage] = Object.entries(images)
        .reduce<[number, string]>(([psz, purl], [csz, curl]) =>
            getSizeNumber(csz) > psz
                ? [getSizeNumber(csz), curl]
                : [psz, purl], [-Infinity, ""]);

    return {
        albumName: response.album["#text"],
        artistName: response.artist["#text"],
        images,
        largestImage,
        trackName: response.name,
        trackUrl: response.url,
        streamable: Boolean(response.streamable),
        isCurrentlyPlaying,
        playedAt: Number(response.date?.uts ?? '0'),
    } satisfies Song;
}

