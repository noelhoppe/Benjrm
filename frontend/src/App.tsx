// frontend/src/App.tsx
import { Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import RootLayout from './layouts/RootLayout';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<RootLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<ErrorPage title="404" message="The page you are looking for does not exist." />} />
            </Route>
        </Routes>
    );
}

export default App;