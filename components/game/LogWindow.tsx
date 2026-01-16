'use client';

import { useEffect, useRef } from 'react';

interface Log {
    id: string;
    text: string;
}

export function LogWindow({ logs }: { logs: Log[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div
            ref={containerRef}
            className="h-32 bg-black/50 backdrop-blur-md rounded-xl p-4 overflow-y-auto border border-white/10 font-mono text-sm shadow-xl"
        >
            {logs.map((log) => (
                <div key={log.id} className="mb-1 text-white/90 animate-fade-in">
                    <span className="text-primary mr-2">›</span>
                    {log.text}
                </div>
            ))}
        </div>
    );
}
