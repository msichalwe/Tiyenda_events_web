// components/PageTransition.js
"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../loading';
import NProgress from "nprogress";
import 'nprogress/nprogress.css';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            NProgress.start();
            setLoading(true);
        };
        const handleComplete = () => {
            NProgress.done();
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <>
            {loading && <Loading />}
            {children}
        </>
    );
};

export default PageTransition;
