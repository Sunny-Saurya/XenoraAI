import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RepoAnalysis from './pages/RepoAnalysis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-gray-100 font-sans antialiased selection:bg-[#00FF66] selection:text-black dark">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/*" element={
            <div className="flex items-center justify-center min-h-screen">
              <SignIn routing="path" path="/login" signUpUrl="/register" />
            </div>
          } />
          <Route path="/register/*" element={
            <div className="flex items-center justify-center min-h-screen">
              <SignUp routing="path" path="/register" signInUrl="/login" />
            </div>
          } />
          <Route 
            path="/dashboard" 
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/login" />
                </SignedOut>
              </>
            } 
          />
          <Route 
            path="/analysis/:id" 
            element={
              <>
                <SignedIn>
                  <RepoAnalysis />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/login" />
                </SignedOut>
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
