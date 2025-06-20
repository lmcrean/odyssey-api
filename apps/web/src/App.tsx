import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from './components/ui/sonner';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import AuthGuard from './components/layout/AuthGuard';
import DeveloperMode from './pages/developer-mode/page';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/developer-mode" element={<DeveloperMode />} />
            <Route
              path="/dashboard/*"
              element={
                <AuthGuard>
                  <div>Protected Dashboard Routes Coming Soon</div>
                </AuthGuard>
              }
            />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
