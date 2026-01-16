import { useState, useEffect } from 'react';
import { getDeviceId } from '@/lib/identity';

export function useIdentity() {
    const [identity, setIdentity] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const id = getDeviceId();
        setIdentity(id);
        setIsLoading(false);
    }, []);

    return { identity, isLoading };
}
