import type {AppInformation} from "./types/types.steam";

export interface SteamResponse<TResponse> {
  response: TResponse;
}

export interface RecentGamesCollection {
  total_count: number;
  games: RecentlyPlayedGame[];
}

export interface RecentlyPlayedGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
}

export interface SteamPersonaCollection {
  players: SteamPersonCore[];
}

export interface SteamPersonCore {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  commentpermission: number;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  realname: string;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
  loccountrycode: string;
  locstatecode: string;

  gameid: string | undefined;
  gameserverip: string | undefined;
  gameextrainfo: string | undefined;
}

export async function getRecentGamesCore(apiKey: string, steamId: string) {

  const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;

  const response = await fetch(url);
  const json = await response.json() as SteamResponse<RecentGamesCollection>;

  return json.response.games;

}

export async function getSteamPersonaCore(apiKey: string, steamId: string) {
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;

  const response = await fetch(url);
  const json = await response.json() as SteamResponse<SteamPersonaCollection>;

  if (json.response.players.length !== 1) return null;
  return json.response.players[0];
}

export async function getAppInformationCore<TAppId extends number>(appId: TAppId) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;


  const response = await fetch(url);
  const json = await response.json() as Record<TAppId, { success: boolean, data: AppInformation }>;
  const {success, data} = json[appId];
  if (!success) return null;
  return data;
}