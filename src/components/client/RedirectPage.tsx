import {useEffect, useState} from "react";
import CopyPulse from "./CopyPulse.tsx";

export type RedirectPageInnerProps = {
    defaultSeconds: number;
    url: string;
    label: string;
}
type RedirectPreference = 'immediate' | 'confirm' | 'auto'

const KEY_REDIRECTPREFERENCES = "x-ndr-redirpref";


export default function RedirectPageInner({defaultSeconds, url, label}) {

    const [seconds, setSeconds] = useState(defaultSeconds);
    const [redirectPreference, _setRedirectPreference] = useState<RedirectPreference>((window.localStorage.getItem(KEY_REDIRECTPREFERENCES) ?? 'auto') as RedirectPreference);

    const setRedirectPreference = (pref: RedirectPreference) => {
        window.localStorage.setItem(KEY_REDIRECTPREFERENCES, pref);
        _setRedirectPreference(pref)
    }

    function redirect() {
        location.href = url;
    }

    const getRedirectPreferenceDescription = (pref: RedirectPreference) => {
        if (pref === 'confirm') return "Require additional input before redirecting";
        if (pref === 'immediate') return "Immediately redirect";
        return "Redirect after a short delay";
    }


    // "auto" redirect pref
    useEffect(() => {
        if (redirectPreference !== 'auto') return;
        setSeconds(defaultSeconds)
        const timeout = setTimeout(redirect, 1000 * defaultSeconds);
        return () => clearTimeout(timeout);
    }, [redirectPreference]);

    // Seconds countdown
    useEffect(() => {
        const interval = setInterval(() => setSeconds(s => s - 1), 1000);

        return () => clearInterval(interval)
    }, []);

    if (redirectPreference === 'immediate') {
        redirect();
        return <h1 className={'text-4xl'}>Redirecting...</h1>
    }

    return <div className='flex flex-col gap-4 items-center'>
        <h2 className="text-3xl font-black">
            Thanks for stopping by
        </h2>
        <span title={url}>Enjoy your time at <span className="link">{label}</span></span>

        {redirectPreference === 'confirm'
            ? <div id="confirmation" className='flex gap-4'  >
                <button
                    className='flex items-center justify-center w-20 h-6 border-accent-light text-accent-light border-2 bg-accent-light bg-opacity-15 opacity-75 disabled:opacity-25 hover:enabled:opacity-100 transition-all text-sm rounded-sm'
                    onClick={() => window.history.back()}
                >
                    Go back
                </button>
                <button
                    className='flex items-center justify-center w-20 h-6 border-accent-light text-accent-light border-2 bg-accent-light bg-opacity-15 opacity-75 disabled:opacity-25 hover:enabled:opacity-100 transition-all text-sm rounded-sm'
                    onClick={() => redirect()}
                >
                    Confirm
                </button>
            </div>
            : <p className='text-neutral-700'>
                You will be redirected in
                &nbsp;
                <span id="seconds" className='text-accent-dark text-lg'>
                    {seconds}
                </span>
            </p>}

        <div className="flex flex-col gap-2 items-center">

            <p className='text-neutral-700'>

                {redirectPreference === 'confirm' ? <span className='text-neutral-700'>
                    or update your&nbsp;
                </span> : null}

                preferences

            </p>
            <div id="prefs" className='flex gap-4'>
                {['auto', 'immediate', 'confirm'].map((pref: RedirectPreference) =>
                    <button
                        title={getRedirectPreferenceDescription(pref)}
                        key={pref}
                        className='flex items-center justify-center w-20 h-6 border-accent-light text-accent-light border-2 bg-accent-light bg-opacity-15 opacity-75 disabled:opacity-25 hover:enabled:opacity-100 transition-all text-sm rounded-sm'
                        disabled={redirectPreference === pref}
                        onClick={() => setRedirectPreference(pref)}
                    >
                        {pref}
                    </button>)}
            </div>
        </div>

        <div id="redirecting-to" className='text-xs items-center flex flex-col'>
            <p className='text-neutral-700'>Redirecting to:</p>
            <CopyPulse content={url}>
                <p className='text-neutral-700 hover:text-white cursor-pointer'>{url}</p>
            </CopyPulse>
        </div>
    </div>

}