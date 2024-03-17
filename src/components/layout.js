
import {Footer} from "@/components/footer";
import {Header} from "@/components/haeder";


const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-between p-24 border-gray-300 bg-gradient-to-b from-gray-100 to-blue-gray-500 pb-6 pt-8 backdrop-blur-lg text-gray-800">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
