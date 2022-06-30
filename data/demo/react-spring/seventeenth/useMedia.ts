import useIsBrowser from '@docusaurus/useIsBrowser';
import { useEffect, useState } from 'react';

export default function useMedia(queries: string[], values: number[], defaultValue: number) {
    const isBrowser = useIsBrowser();
    const match = () => {
        if (!isBrowser) return defaultValue;
        return values[queries.findIndex((q) => matchMedia(q).matches)] || defaultValue;
    };
    const [value, set] = useState(match);
    useEffect(() => {
        const handler = () => set(match);
        if (isBrowser) window.addEventListener('resize', handler);
        return () => {
            if (isBrowser) window.removeEventListener('resize', handler);
        };
    }, []);
    return value;
}
