const env = {
    server: {
        apikey: {
            lastFm: import.meta.env.SECRET_APIKEY_LASTFM,
            steam: import.meta.env.SECRET_APIKEY_STEAM,
        },
        id: {
            steam: import.meta.env.SECRET_ID_STEAM
        }
    }
} as const

export default env;