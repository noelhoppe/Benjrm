import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import './index.css';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <LandingPage />
        </div>
    )
}

export default App
