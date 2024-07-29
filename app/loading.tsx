'use client'

import React, { useState, useEffect } from 'react';
import NProgress from "nprogress";

export default function Loading() {
    const loadingMessages = [
        "Loading...",
        "Please wait...",
        "Fetching data...",
        "Almost there...",
        "Hang tight...",
        "Just a moment...",
    ];

    NProgress.start();


    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 1000); // Change message every 2 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
                <p className="mt-4 text-xl text-gray-700">{loadingMessages[currentMessageIndex]}</p>
            </div>
        </div>
    );
}
