'use client';

import { useTransition } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * A custom Link component that wraps Next.js's next/link component.
 */
export default function Link({
                                 href,
                                 children,
                                 replace,
                                 ...rest
                             }: Parameters<typeof NextLink>[0]) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    const loadingMessages = [
        "Loading, please wait...",
        "Almost there...",
        "Just a moment..."
    ];

    useEffect(() => {
        if (isPending) {
            const interval = setInterval(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
            }, 2000); // Change message every 2 seconds
            return () => clearInterval(interval);
        }
    }, [isPending]);

    if (isPending) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
                    <p className="mt-4 text-xl text-gray-700">{loadingMessages[currentMessageIndex]}</p>
                </div>
            </div>
        );
    }

    return (
        <NextLink
            href={href}
            onClick={(e) => {
                e.preventDefault();
                startTransition(() => {
                    const url = href.toString();
                    if (replace) {
                        router.replace(url);
                    } else {
                        router.push(url);
                    }
                });
            }}
            {...rest}
        >
            {children}
        </NextLink>
    );
}
