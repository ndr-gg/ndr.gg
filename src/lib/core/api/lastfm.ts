import {cached} from "../cache.ts";

export type LastFMBooleanNumber = 0 | 1;
export type Track = {
    artist: {
        mbid: string;
        '#text': string;
    };
    streamable: LastFMBooleanNumber;
    image: {
        '#text': string;
        size: string;
    }[];
    mbid: string;
    album: {
        mbid: string;
        '#text': string;
    };
    name: string;
    url: string;
    date: {
        uts: string;
        '#text': string;
    };
    '@attr'?: {
        nowplaying: "true"
    };
}

export async function getLastSong(username: string, apikey: string): Promise<Track> {
    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apikey}&format=json&limit=1`

    // return await cached<Track>("lastfm.getLastSong", async () => {
    const response = await fetch(url);
    const json = await response.json();

    return json.recenttracks.track[0];
    // }, {
    //     expiry: {minute: 1}
    // })
}
