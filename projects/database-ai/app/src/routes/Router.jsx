 import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import Settings from '../components/Settings';
import About from '../components/About';
import Pricing from '../components/Pricing';
import Profile from '../components/Profile';

export default function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home />
        }
      />
      <Route
        path="/profile/:id"
        element={
          <Profile />
        }
      />
      <Route
        path="/explore"
        element={
          <Explore />
        }
      />
      <Route
        path="/about"
        element={
          <About />
        }
      />

      <Route
        path="/pricing"
        element={
          <Pricing />
        }
      />
      
      <Route
        path="/settings"
        element={
          <Settings />
        }
      />
    </Routes>
  );
};
