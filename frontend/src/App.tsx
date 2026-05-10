import {Routes, Route } from 'react-router';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage.tsx';

function App() {
    return (
            <div className="flex flex-col min-h-screen">


                <main className="flex-1 flex flex-col">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<ErrorPage title="404" message="The page you are looking for does not exist." />} />
                    </Routes>
                </main>

                <Footer />

            </div>
    );
}

export default App
