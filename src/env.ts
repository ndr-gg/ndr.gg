const env = {
    server: {
        apikey: {
            lastFm: import.meta.env.SECRET_APIKEY_LASTFM
        }
    }
} as const

export default env;