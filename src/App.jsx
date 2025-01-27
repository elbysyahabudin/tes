import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import TabelProduk from './Components/TabelProduk';
import Analitik from './Components/Analitik';
import CMS from './Components/CMS';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faChartLine, faBarsProgress, faBars, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <Router>
      <div className="sidebar">
        <h2>Wyloz Dashboard</h2>
        <Link to="/tabelProduk"><FontAwesomeIcon icon={faTable}/>Data Produk</Link>
        <Link to="/analitik"><FontAwesomeIcon icon={faChartLine}/>Analytics</Link>
        <Link to="/cms"><FontAwesomeIcon icon={faBarsProgress}/>CMS</Link>
      </div>

      <div className="main-container">
        <div className="navbar">
          <h1>
            <FontAwesomeIcon icon={faBars}/>
          </h1>
          <div className="dropdown">
            <img
              src="imgs/wyloz-logo.PNG"
              alt="Profile Picture"
              className="dropdown-toggle"
            />
            <div className="dropdown-content">
              <a className="dropdown-item" href="login.html">
                <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                Logout
              </a>
            </div>
          </div>
        </div>

        <div className="content">
          <Routes>
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
