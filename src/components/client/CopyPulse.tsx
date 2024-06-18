import type {PropsWithChildren} from "react";
import {useEffect, useState} from "react";

export type CopyPulseProps = {
    content: string;
}

export default function CopyPulse({content, children}: PropsWithChildren<CopyPulseProps>) {
    const [pulsing, setPulsing] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setPulsing(false), 1000)
        return () => clearTimeout(timeout);
    }, [pulsing]);


    return <div
        className={pulsing ? "animate-ping-once" : ""}
        onClick={() => {
            navigator.clipboard.writeText(content);
            setPulsing(true);
        }}>
        {children}
    </div>
}