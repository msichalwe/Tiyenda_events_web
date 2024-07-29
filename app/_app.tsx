import '../styles/globals.css';
import NProgress from 'nprogress';
import Loading from "@/app/loading";

function MyApp({ Component, pageProps }: { Component: typeof Loading, pageProps: any }): JSX.Element {
    NProgress.configure({
        showSpinner: false,
    });

    return (
        <>
            <Loading />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;