import { Outlet } from 'react-router';
import NavbarMain from '../components/NavbarMain';
import Footer from '../components/Footer';

export default function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <NavbarMain />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}