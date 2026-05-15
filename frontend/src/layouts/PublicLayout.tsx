// frontend/src/layouts/PublicLayout.tsx

import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Navbar from "@/components/Navbar.tsx";

export default function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col py-8">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
