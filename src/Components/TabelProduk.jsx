import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Importing Bootstrap CSS
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient('https://trqvushwhkvchkgqhmge.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRycXZ1c2h3aGt2Y2hrZ3FobWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MDU1MjUsImV4cCI6MjA1MzQ4MTUyNX0.J-yggfqvHPQtP-Zk-bwOxTRqD64J6jgQ_DOLCCp-JxY');

const TabelProduk = () => {
  const [kategori, setKategori] = useState('');
  const [kurir, setKurir] = useState('');
  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [products, setProducts] = useState([]);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('tabel_produk')  // Replace with your actual table name
        .select('*');

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setProducts(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content-tabel-produk">
      <div className="filter-container">
        <select id="dropdown-kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} className="form-control">
          <option value="">Filter Kategori</option>
        </select>
        
        <select id="kurir-pengiriman" value={kurir} onChange={(e) => setKurir(e.target.value)} className="form-control">
          <option value="">Filter Kurir</option>
        </select>
        
        <select id="metode-pembayaran" value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)} className="form-control">
          <option value="">Filter Pembayaran</option>
        </select>
        
        <select id="province-filter" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} className="form-control">
          <option value="">Filter Provinsi</option>
        </select>
        
        <input 
          type="date" 
          id="date-filter" 
          value={tanggal} 
          onChange={(e) => setTanggal(e.target.value)} 
          className="form-control"
        />
      </div>
      
      <table id="table-data-produk" className="table table-striped table-bordered transparent-table">

        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Kuantitas</th>
            <th>Kategori</th>
            <th>Metode Pengiriman</th>
            <th>Metode Pembayaran</th>
            <th>Kurir</th>
            <th>Kota Pelanggan</th>
            <th>Provinsi</th>
            <th>Tanggal Pembelian</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.no}</td>
              <td>{product.nama_produk}</td>
              <td>{product.kuantitas}</td>
              <td>{product.kategori}</td>
              <td>{product.pengiriman}</td>
              <td>{product.metode_pembayaran}</td>
              <td>{product.kurir}</td>
              <td>{product.kota_pelanggan}</td>
              <td>{product.provinsi}</td>
              <td>{product.tanggal_pembelian}</td>
              <td>
                <button className="btn btn-primary">Edit</button>
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelProduk;
