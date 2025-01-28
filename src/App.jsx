import { BrowserRouter as Router, Route, NavLink, Link, Routes } from 'react-router-dom';

import TabelProduk from './Components/TabelProduk';
import Analitik from './Components/Analitik';
import CMS from './Components/CMS';
import Login from './Components/Login';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faChartLine, faBarsProgress, faBars, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import wylozLogo from './Assets/wyloz-logo.png';

function App() {
  return (
    <Router>
      <div className="sidebar">
        {/* Wrapping h2 in Link to make it clickable */}
        <Link to="/" className="dashboard-title">
          <h1>Wyloz Dashboard</h1>
        </Link>
        <NavLink
          to="/tabelProduk"
          className={({ isActive }) => (isActive ? 'active-menu' : '')}
        >
          <FontAwesomeIcon icon={faTable} className="icon-sidebar" /> Data Produk
        </NavLink>
        <NavLink
          to="/analitik"
          className={({ isActive }) => (isActive ? 'active-menu' : '')}
        >
          <FontAwesomeIcon icon={faChartLine} className="icon-sidebar" /> Analytics
        </NavLink>
        <NavLink
          to="/cms"
          className={({ isActive }) => (isActive ? 'active-menu' : '')}
        >
          <FontAwesomeIcon icon={faBarsProgress} className="icon-sidebar" /> CMS
        </NavLink>
      </div>

      <div className="main-container">
        <div className="navbar">
          <h1>
            <FontAwesomeIcon icon={faBars} />
          </h1>
          <div className="dropdown">
            <img
              src={wylozLogo}
              alt="Profile Picture"
              className="dropdown-toggle"
            />
            <div className="dropdown-content">
              <a className="dropdown-item" href="login.html">
                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
              </a>
            </div>
          </div>
        </div>

        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/tabelProduk" element={<TabelProduk />} />
            <Route path="/analitik" element={<Analitik />} />
            <Route path="/cms" element={<CMS />} />
            <Route path="/" element={<h2>Welcome to Wyloz Dashboard</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
