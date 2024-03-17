import "@/styles/globals.css";
import "@/styles/spinner.css";
import Layout from "@/components/layout";

export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
