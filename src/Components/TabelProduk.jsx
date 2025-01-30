import React, { useState, useEffect } from "react";
import $ from "jquery";
import Swal from 'sweetalert2';
import { createClient } from "@supabase/supabase-js";
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';


import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

const supabaseUrl = "https://trqvushwhkvchkgqhmge.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRycXZ1c2h3aGt2Y2hrZ3FobWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MDU1MjUsImV4cCI6MjA1MzQ4MTUyNX0.J-yggfqvHPQtP-Zk-bwOxTRqD64J6jgQ_DOLCCp-JxY"; // Replace with your Supabase API Key
const supabase = createClient(supabaseUrl, supabaseKey);

const provinces = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", 
  "Kepulauan Riau", "Jambi", "Sumatera Selatan", "Bangka Belitung", 
  "Bengkulu", "Lampung", "DKI Jakarta", "Jawa Barat", 
  "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten", 
  "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", 
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", 
  "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", 
  "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", 
  "Gorontalo", "Sulawesi Barat", "Maluku", "Maluku Utara", 
  "Papua", "Papua Barat"
];

const kategoris = ["Kaos", "Celana", "Tas", "Baju", "Sepatu", "Jaket"];
const kurirs = ["JNE", "SiCepat", "J&T", "Pos Indonesia", "Wahana", "TiKi", "Ninja Express", "Lala Move"];
const pembayarans = ["Transfer", "Ovo", "Dana", "Gopay", "Shopee Pay", "LinkAja"];

const TabelProduk = () => {
  const [editProductName, setEditProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    "#dropdown-kategori": "",
    "#kurir-pengiriman": "",
    "#metode-pembayaran": "",
    "#province-filter": "",
    "#date-filter": "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("tabel_produk").select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setProducts(data);
      }
    };
    fetchData();
  }, []); // Run only on mount

  useEffect(() => {
    if (products.length > 0) {
      const table = $("#table-data-produk").DataTable({
        pageLength: 7,
        paging: true,
        searching: true,
        ordering: true,
        destroy: true, // Ensure the previous table instance is destroyed
        dom: 'Brtip',
      });
  
      // Apply filters to the table
      Object.keys(filters).forEach((filterId) => {
        const columnIndex = {
          "#dropdown-kategori": 4,
          "#kurir-pengiriman": 5,
          "#metode-pembayaran": 6,
          "#province-filter": 9,
          "#date-filter": 10,
        }[filterId];
  
        table.column(columnIndex).search(filters[filterId]).draw();
      
    });
    
  
      return () => {
        table.destroy();
      };
    }
  }, [products, filters]); // Re-run whenever products or filters change

  const handleFilterChange = (filterId, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterId]: value,
    }));
  };

  const handleEdit = (product) => {
    // Store the current product's ID for future reference
    const { no, nama_pelanggan, nama_produk, kuantitas, kategori, pengiriman, metode_pembayaran, kurir, kota_pelanggan, provinsi, tanggal_pembelian } = product;
    
    // Open Swal with prefilled product details
    Swal.fire({
      title: 'Edit Product Name',
      html: `
        <div class="swal2-grid-container">
          <div class="form-group">
            <label for="pelangganName">Nama Pelanggan:</label>
            <input type="text" id="pelangganName" value="${nama_pelanggan}" />
          </div>
          <div class="form-group">
            <label for="productName">Nama Produk:</label>
            <input type="text" id="productName" value="${nama_produk}" />
          </div>
          <div class="form-group">
            <label for="quantity">Kuantitas:</label>
            <input type="number" id="quantity" value="${kuantitas}" />
          </div>
          <div class="form-group">
            <label for="category">Kategori:</label>
            <select id="category" class="swal2-input">
              ${kategoris.map(kategoriOption => 
                `<option value="${kategoriOption}" ${kategoriOption === kategori ? 'selected' : ''}>${kategoriOption}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="shippingMethod">Metode Pengiriman:</label>
            <select id="shippingMethod" class="swal2-input">
              ${kurirs.map(kurirOption => 
                `<option value="${kurirOption}" ${kurirOption === pengiriman ? 'selected' : ''}>${kurirOption}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="paymentMethod">Metode Pembayaran:</label>
            <select id="paymentMethod" class="swal2-input">
              ${pembayarans.map(paymentOption => 
                `<option value="${paymentOption}" ${paymentOption === metode_pembayaran ? 'selected' : ''}>${paymentOption}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="courier">Kurir:</label>
            <select id="courier" class="swal2-input">
              ${kurirs.map(kurirOption => 
                `<option value="${kurirOption}" ${kurirOption === kurir ? 'selected' : ''}>${kurirOption}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="city">Kota Pelanggan:</label>
            <input type="text" id="city" value="${kota_pelanggan}" />
          </div>
          <div class="form-group">
            <label for="province">Provinsi:</label>
            <select id="province" class="swal2-input">
              ${provinces.map(provinceOption => 
                `<option value="${provinceOption}" ${provinceOption === provinsi ? 'selected' : ''}>${provinceOption}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="purchaseDate">Tanggal Pembelian:</label>
            <input type="date" id="purchaseDate" value="${tanggal_pembelian}" />
          </div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      preConfirm: async () => {
        // Capture the updated values from the modal
        const updatedPelangganName = document.getElementById('pelangganName').value;
        const updatedProductName = document.getElementById('productName').value;
        const updatedQuantity = document.getElementById('quantity').value;
        const updatedCategory = document.getElementById('category').value;
        const updatedShippingMethod = document.getElementById('shippingMethod').value;
        const updatedPaymentMethod = document.getElementById('paymentMethod').value;
        const updatedCourier = document.getElementById('courier').value;
        const updatedCity = document.getElementById('city').value;
        const updatedProvince = document.getElementById('province').value;
        const updatedPurchaseDate = document.getElementById('purchaseDate').value;
  
        // Update the selected product
        const { error } = await supabase
          .from('tabel_produk')
          .update({
            nama_pelanggan: updatedPelangganName,
            nama_produk: updatedProductName,
            kuantitas: updatedQuantity,
            kategori: updatedCategory,
            pengiriman: updatedShippingMethod,
            metode_pembayaran: updatedPaymentMethod,
            kurir: updatedCourier,
            kota_pelanggan: updatedCity,
            provinsi: updatedProvince,
            tanggal_pembelian: updatedPurchaseDate,
          })
          .eq('no', no); // Ensure we are updating the correct product by `no`
  
        if (error) {
          Swal.fire('Error', error.message, 'error');
        } else {
          Swal.fire('Success', 'Product updated successfully!', 'success');
          // Refresh the product list after the update
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.no === no
                ? { ...product, nama_pelanggan: updatedPelangganName, nama_produk: updatedProductName, kuantitas: updatedQuantity, kategori: updatedCategory, pengiriman: updatedShippingMethod, metode_pembayaran: updatedPaymentMethod, kurir: updatedCourier, kota_pelanggan: updatedCity, provinsi: updatedProvince, tanggal_pembelian: updatedPurchaseDate }
                : product
            )
          );
        }
      }
    });
  };
  

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      const { error } = await supabase
        .from('tabel_produk')
        .delete()
        .eq('no', productId);
  
      if (error) {
        Swal.fire('Error', error.message, 'error');
      } else {
        await Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        window.location.reload(); // Ensure the page reloads after the alert
      }
    }
  };
  
  
    
    
  

  return (
    <div className="content-tabel-produk">
      <div className="filter-container">
        <select
          id="dropdown-kategori"
          value={filters["#dropdown-kategori"]}
          onChange={(e) => handleFilterChange("#dropdown-kategori", e.target.value)}
          className="form-control"
        >
          <option value="">Filter Kategori</option>
          {kategoris.map((kategori, index) => (
            <option key={index} value={kategori}>{kategori}</option>
          ))}
        </select>

        <select
          id="kurir-pengiriman"
          value={filters["#kurir-pengiriman"]}
          onChange={(e) => handleFilterChange("#kurir-pengiriman", e.target.value)}
          className="form-control"
        >
          <option value="">Filter Kurir</option>
          {kurirs.map((kurir, index) => (
            <option key={index} value={kurir}>{kurir}</option>
          ))}
        </select>

        <select
          id="metode-pembayaran"
          value={filters["#metode-pembayaran"]}
          onChange={(e) => handleFilterChange("#metode-pembayaran", e.target.value)}
          className="form-control"
        >
          <option value="">Filter Pembayaran</option>
          {pembayarans.map((pembayaran, index) => (
            <option key={index} value={pembayaran}>{pembayaran}</option>
          ))}
        </select>

        <select
          id="province-filter"
          value={filters["#province-filter"]}
          onChange={(e) => handleFilterChange("#province-filter", e.target.value)}
          className="form-control"
        >
          <option value="">Filter Provinsi</option>
          {provinces.map((province, index) => (
            <option key={index} value={province}>{province}</option>
          ))}
        </select>

        <input
          type="date"
          id="date-filter"
          value={filters["#date-filter"]}
          onChange={(e) => handleFilterChange("#date-filter", e.target.value)}
          className="form-control"
        />
      </div>

      
      <table id="table-data-produk" className="table table-striped table-bordered custom-table">

        <thead>
          <tr>
            <th>No</th>
            <th>Nama Pelanggan</th>
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
            <tr key={product.id || index}>
              <td>{index + 1}</td>
              <td>{product.nama_pelanggan}</td>
              <td>{product.nama_produk}</td>
              <td>{product.kuantitas}</td>
              <td>{product.kategori}</td>
              <td>{product.pengiriman}</td>
              <td>{product.metode_pembayaran}</td>
              <td>{product.kurir}</td>
              <td>{product.kota_pelanggan}</td>
              <td>{product.provinsi}</td>
              <td>{product.tanggal_pembelian}</td>
              <td className="action-buttons">
                <button className="btn btn-primary" onClick={() => handleEdit(product)}><FontAwesomeIcon icon={faPenToSquare}/></button>
                <button className="btn btn-danger" onClick={() => handleDelete(product.no)}><FontAwesomeIcon icon={faTrashCan}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelProduk;
