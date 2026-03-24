import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';

import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function NavItem({ to, label }) {
  return (
    <li className="nav-item">
      <NavLink
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        to={to}
        end={to === '/'}
      >
        {label}
      </NavLink>
    </li>
  );
}

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">OctoFit Tracker</span>
          <ul className="navbar-nav flex-row gap-2">
            <NavItem to="/" label="Users" />
            <NavItem to="/teams" label="Teams" />
            <NavItem to="/activities" label="Activities" />
            <NavItem to="/leaderboard" label="Leaderboard" />
            <NavItem to="/workouts" label="Workouts" />
          </ul>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
