import type {AnchorHTMLAttributes, PropsWithChildren} from "react";
import {useMemo} from "react";

export type SneakyLinkProps = {
    url: string; // obfuscated
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">

export default function SneakyLink({url, children, ...props}: PropsWithChildren<SneakyLinkProps>) {
    const cleanedUrl = useMemo(() => atob(atob(atob(url))), [url]);
    const onClick = () => {
        window.open(cleanedUrl, "_blank");
    }

    return <a {...props} onClick={onClick} href='#' className={props.className + " link"}>{children}</a>
}