import "@/styles/globals.css";
import "@/styles/spinner.css";
import Layout from "@/components/layout";
import GoogleAnalytics from "@/components/analyse";

export default function App({ Component, pageProps }) {
    return (
        <>
        <Layout>
            <Component {...pageProps} />
        </Layout>
        </>
    );
}
