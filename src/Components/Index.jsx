import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Index = () => (
  <div className="index-container">
    <div className="index-content">
      <h1>Selamat datang di toko Wyloz</h1>
      <p>Toko Olahraga & Fashion Online Terpercaya yang Sudah Melayani Lebih dari 100RB+ Transaksi dari Seluruh Indonesia.</p>
    </div>

    <div className="social-media">
      <a href="https://www.facebook.com/wyloz" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FontAwesomeIcon icon={faFacebook} />
      </a>
      <a href="https://api.whatsapp.com/send?phone=6285774992935&text=Saya%20mau%20pesan%20Kaos%20Wyloz!" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
      <a href="https://www.instagram.com/wyloz.store/" target="_blank" rel="noopener noreferrer" className="social-icon">
      <FontAwesomeIcon icon={faInstagram} />
      </a>
      <a href="https://www.tiktok.com/@wyloz.store" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FontAwesomeIcon icon={faTiktok} />
      </a>
    </div>
  </div>
);

export default Index;
