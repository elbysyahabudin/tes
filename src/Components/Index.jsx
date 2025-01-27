import React from 'react';


const Index = () => {
    return(
        <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Wyloz Dashboard</h2>
          <a href="dataProduk.html"><i className="fa-solid fa-table"></i>Data Produk</a>
          <a href="analitik.html"><i className="fa-solid fa-chart-line"></i>Analytics</a>
          <a href="cms.html"><i className="fa-solid fa-bars-progress"></i>CMS</a>
        </div>
  
        {/* Main content */}
        <div className="main-content">
          {/* Navbar */}
          <div className="navbar">
            <h1><i className="fa-solid fa-bars"></i></h1>
            <div className="dropdown">
              <img 
                src="imgs/wyloz-logo.PNG" 
                alt="Profile Picture" 
                className="dropdown-toggle" 
                id="profileDropdown" 
                aria-haspopup="true" 
                aria-expanded="false" 
              />
              <div className="dropdown-content" aria-labelledby="profileDropdown">
                <a className="dropdown-item" href="login.html">
                  <i style={{ marginRight: '20px' }} className="fa-solid fa-arrow-right-from-bracket"></i>
                  Logout
                </a>
              </div>
            </div>
          </div>
  
          {/* Main content area */}
          <div className="content">
            <h2 style={{ color: 'white', fontWeight: 'bold' }}>Selamat datang di Wyloz</h2>
            <p style={{ color: 'white' }}>
              Toko Olahraga & Fashion Online Terpercaya yang Sudah Melayani Lebih dari 100RB+ Transaksi dari Seluruh Indonesia.
            </p>
          </div>
        </div>
      </div>
    )
}