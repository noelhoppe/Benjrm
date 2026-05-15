// frontend/src/App.tsx
import { Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import RootLayout from './layouts/RootLayout';
import PublicLayout from './layouts/PublicLayout'; // Don't forget this import

function App() {
    return (
        <Routes>
            {/* PUBLIC ROUTES: Wrapped in the minimal layout */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="*" element={<ErrorPage title="404" message="The page you are looking for does not exist." />} />
            </Route>

            {/* PRIVATE ROUTES: Wrapped in the authenticated layout */}
            <Route element={<RootLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

export default App;
