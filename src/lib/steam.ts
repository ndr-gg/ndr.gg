import {getAppInformationCore, getRecentGamesCore, getSteamPersonaCore, type RecentlyPlayedGame} from "./core/api/steam";
import type {AppInformation} from "./core/api/types/types.steam.ts";

export type SteamPersonaState =
  | "Offline"
  | "Online"
  | "Busy"
  | "Away"
  | "Snooze"
  | "Unknown";

function getPersonaState(stateIndex: number): SteamPersonaState {
  return ([
    "Offline",
    "Online",
    "Busy",
    "Away",
    "Snooze",
  ] as const)[stateIndex] ?? "Unknown";
}

export type SteamPlayerInformation = {
    steamId: string;
    persona: {
      name: string;
      state: SteamPersonaState;
      isPrivate: boolean;
      profileUrl: string;
      avatarFull: string;
      lastOnline: Date;
    },
    recentGames: { game: RecentlyPlayedGame, detail: AppInformation }[]
  }
  & ({
  isInGame: false
} | {
  isInGame: true,
  activeGame: { game: RecentlyPlayedGame, detail: AppInformation }
})

export default async function getSteamPlayerInformation(apiKey: string, steamId: string, numGames: number = 3) {
  const gameHistory = await getRecentGamesCore(apiKey, steamId);
  const recentGames = gameHistory.slice(0, numGames);
  const persona = await getSteamPersonaCore(apiKey, steamId);

  const isInGame = Boolean(persona.gameid);
  const appIds = recentGames.map(game => game.appid);
  if (isInGame) appIds.push(Number(persona.gameid));
  const gameInformation = (Object.fromEntries(await Promise.all(appIds.map(async appid => [appid, await getAppInformationCore(appid)]))));
  const activeGame = isInGame ? gameHistory.find(game => game.appid === Number(persona.gameid)) : undefined;
  return {
    steamId: steamId,
    persona: {
      name: persona.personaname,
      state: getPersonaState(persona.personastate),
      isPrivate: persona.communityvisibilitystate === 1,
      profileUrl: persona.profileurl,
      avatarFull: persona.avatarfull,
      lastOnline: new Date(persona.lastlogoff * 1000),
    },
    recentGames: recentGames.map(game => ({game, detail: gameInformation[game.appid]})),
    isInGame: Boolean(activeGame),
    activeGame: activeGame ? {
      game: activeGame,
      detail: gameInformation[activeGame.appid]
    } : undefined
  } satisfies SteamPlayerInformation;

}