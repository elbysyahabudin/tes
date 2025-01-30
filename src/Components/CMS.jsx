import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import '../App.css';
import Swal from 'sweetalert2';
// Initialize Supabase client
const supabaseUrl = "https://trqvushwhkvchkgqhmge.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRycXZ1c2h3aGt2Y2hrZ3FobWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MDU1MjUsImV4cCI6MjA1MzQ4MTUyNX0.J-yggfqvHPQtP-Zk-bwOxTRqD64J6jgQ_DOLCCp-JxY"; // Replace with your Supabase API Key
const supabase = createClient(supabaseUrl, supabaseKey);
import * as XLSX from "xlsx";

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

const ProductForm = () => {
  
  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    nama_produk: "",
    harga: "",
    kategori: "",
    kuantitas: "",
    pengiriman: "",
    metode_pembayaran: "",
    kurir: "",
    kota_pelanggan: "",
    provinsi: "",
    tanggal_pembelian: "",
  });

  const [errors, setErrors] = useState({});
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.nama_pelanggan) newErrors.nama_pelanggan = "Nama pelanggan harus diisi";
    if (!formData.nama_produk) newErrors.nama_produk = "Nama produk harus diisi";
    if (!formData.harga) newErrors.harga = "Harga harus diisi";
    if (!formData.kategori) newErrors.kategori = "Kategori harus dipilih";
    if (!formData.pengiriman) newErrors.pengiriman = "Metode pengiriman harus dipilih";
    if (!formData.metode_pembayaran) newErrors.metode_pembayaran = "Metode pembayaran harus dipilih";
    if (!formData.kurir) newErrors.kurir = "Kurir harus dipilih";
    if (!formData.kota_pelanggan) newErrors.kota_pelanggan = "Kota pelanggan harus diisi";
    if (!formData.provinsi) newErrors.provinsi = "Provinsi harus dipilih";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setMessage("");

      try {
        const { data, error } = await supabase
          .from("tabel_produk") // Replace with your table name
          .insert([formData]);

        if (error) {
          setMessage("Error adding data: " + error.message);
        } else {
          Swal.fire({
            title: 'Success!',
            text: 'Data has been successfully added!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          setFormData({
            nama_pelanggan:"",
            nama_produk: "",
            harga: "",
            kategori: "",
            kuantitas: "",
            pengiriman: "",
            metode_pembayaran: "",
            kurir: "",
            kota_pelanggan: "",
            provinsi: "",
            tanggal_pembelian: "",
          });
        }
      } catch (err) {
        setMessage("An unexpected error occurred: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleFileChange = (event) => {
    if (event.target.files?.length) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      readExcel(selectedFile);
    }
  };

  // Read and Parse Excel File
  const readExcel = (selectedFile) => {
    const reader = new FileReader();
    reader.readAsBinaryString(selectedFile);
  
    reader.onload = (event) => {
      if (!event.target?.result) return;
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(sheet);
  
      // Filter out the subtitle row (usually located at the second index)
      const filteredData = jsonData.filter((row, index) => index > 0); // Skip subtitle row
  
      setExcelData(filteredData);
    };
  };

  const kategoris = ["Kaos", "Celana", "Tas", "Baju", "Sepatu", "Jaket"];

  const handleImport = async () => {
    if (excelData.length === 0) {
      alert("No data to import!");
      return;
    }

    setLoading(true);

    const formattedData = excelData.map((row) => {
      const productName = row["Product Name"];
      const firstSixWords = productName.split(" ").slice(0, 6).join(" ");
    
      let kategori = "Unknown";
      for (let category of kategoris) {
        if (firstSixWords.toLowerCase().includes(category.toLowerCase())) {
          kategori = category;
          break;
        }
      }
    
      return {
        nama_produk: firstSixWords,
        kuantitas: row["Quantity"],
        harga: parseFloat(row["SKU Unit Original Price"].replace(/[^0-9]+/g, "")) || 0,
        tanggal_pembelian: reformatDate(row["Created Time"]),
        kurir: row["Shipping Provider Name"],
        nama_pelanggan: row["Buyer Username"],
        provinsi: row["Province"],
        kota_pelanggan: row["Regency and City"],
        metode_pembayaran: row["Payment Method"],
        pengiriman: "Pengiriman kurir",
        kategori: kategori,
      };
    });
    
    const { data, error } = await supabase.from("tabel_produk").insert(formattedData);
  
    if (error) {
      console.error("Error inserting data:", error);
      alert("Failed to insert data.");
    } else {
      alert("Data inserted successfully!");
      console.log("Inserted Data:", data);
    }
    
    setLoading(false);
  };

  const reformatDate = (dateString) => {
    const dateParts = dateString.split(" ")[0];
    const [day, month, year] = dateParts.split("/");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
     <div className="import-content">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-4" />
        <button 
          onClick={handleImport} 
          disabled={!file || loading} 
          className="btn btn-primary">
          {loading ? "Importing..." : "Import to Database"}
        </button>
      </div>

      <hr className="separator" />
      <form onSubmit={handleSubmit} id="productForm">
        
        <div className="form-grid">
          <div className="mb-3">
            <label htmlFor="pelangganName" className="form-label">
              Nama Pelanggan
            </label>
            <input
              type="text"
              className="form-control"
              id="pelangganName"
              name="nama_pelanggan"
              placeholder="Masukkan nama pelanggan"
              value={formData.nama_pelanggan}
              onChange={handleInputChange}
            />
            {errors.nama_pelanggan && <span className="error-message">{errors.nama_pelanggan}</span>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="productName" className="form-label">
              Nama Produk
            </label>
            <input
              type="text"
              className="form-control"
              id="productName"
              name="nama_produk"
              placeholder="Masukkan nama produk"
              value={formData.nama_produk}
              onChange={handleInputChange}
            />
            {errors.nama_produk && <span className="error-message">{errors.nama_produk}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Harga
            </label>
            <input
              type="text"
              className="form-control"
              id="price"
              name="harga"
              placeholder="Masukkan harga"
              value={formData.harga}
              onChange={handleInputChange}
            />
            {errors.harga && <span className="error-message">{errors.harga}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Kategori
            </label>
            <select
              className="form-control"
              id="category"
              name="kategori"
              value={formData.kategori}
              onChange={handleInputChange}
            >
              <option value="">Pilih Kategori</option>
              <option value="Kaos">Kaos</option>
              <option value="Celana">Celana</option>
              <option value="Jaket">Jaket</option>
              <option value="Tas">Tas</option>
              <option value="Sepatu">Sepatu</option>
            </select>
            {errors.kategori && <span className="error-message">{errors.kategori}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="quantity1" className="form-label">
              Kuantitas
            </label>
            <input
              type="number"
              className="form-control"
              id="quantity1"
              name="kuantitas"
              placeholder="Masukkan kuantitas"
              value={formData.kuantitas}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="pengiriman" className="form-label">
              Metode Pengiriman
            </label>
            <select
              className="form-control"
              id="pengiriman"
              name="pengiriman"
              value={formData.pengiriman}
              onChange={handleInputChange}
            >
              <option value="">Pilih Metode Pengiriman</option>
              <option value="COD">COD</option>
              <option value="Pengiriman Kurir">Pengiriman Kurir</option>
            </select>
            {errors.pengiriman && <span className="error-message">{errors.pengiriman}</span>}
          </div>

          <div className="mb-3">
          <label htmlFor="pembayaran" className="form-label">
            Metode Pembayaran
          </label>
          <select
            className="form-control"
            id="pembayaran"
            name="metode_pembayaran"
            value={formData.metode_pembayaran}
            onChange={handleInputChange}
          >
            <option value="">Pilih Metode Pembayaran</option>
            <option value="Cash">Bayar di tempat</option>
            <option value="Transfer Bank">Transfer</option>
            <option value="Dana">Dana</option>
            <option value="Gopay">Gopay</option>
            <option value="Link Aja">Link Aja</option>
            <option value="Ovo">Ovo</option>
            <option value="Shopee Pay">Shopee Pay</option>
    
          </select>
          {errors.metode_pembayaran && <span className="error-message">{errors.metode_pembayaran}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="kurir" className="form-label">
            Kurir
          </label>
          <select
            className="form-control"
            id="kurir"
            name="kurir"
            value={formData.kurir}
            onChange={handleInputChange}
          >
            <option value="">Pilih Kurir</option>
            <option value="Tidak ada">Tidak ada</option>
            <option value="JNE">JNE</option>
            <option value="J&T">J&T</option>
            <option value="SiCepat">SiCepat</option>
            <option value="TiKi">Lala Move</option>
            <option value="Wahana">Wahana</option>
          </select>
          {errors.kurir && <span className="error-message">{errors.kurir}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="kota-pelanggan" className="form-label">
            Kota Pelanggan
          </label>
          <input
            type="text"
            className="form-control"
            id="kota-pelanggan"
            name="kota_pelanggan"
            placeholder="Masukkan kota pelanggan"
            value={formData.kota_pelanggan}
            onChange={handleInputChange}
          />
          {errors.kota_pelanggan && <span className="error-message">{errors.kota_pelanggan}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="province" className="form-label">
            Provinsi
          </label>
          <select
            className="form-control"
            id="province"
            name="provinsi"
            value={formData.provinsi}
            onChange={handleInputChange}
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </select>
          {errors.provinsi && <span className="error-message">{errors.provinsi}</span>}
        </div>


        <div className="mb-3">
          <label htmlFor="tanggal-pembelian" className="form-label">
            Tanggal Pembelian
          </label>
          <input
            type="date"
            className="form-control"
            id="tanggal-pembelian"
            name="tanggal_pembelian"
            value={formData.tanggal_pembelian}
            onChange={handleInputChange}
          />
        </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductForm;
