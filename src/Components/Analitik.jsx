import React, { useEffect, useState, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import produkTerjualImg from '../Assets/package.png';
import totalUangImg from '../Assets/penjualan.png';
import Chart from 'chart.js/auto'; // Import Chart.js

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

const kategoris = ["Celana", "Jaket", "Kaos", "Polo Shirt", "Tank Top"];
const kurirs = ["JNE", "J&T", "SiCepat",  "TiKi", "Wahana"];
const pembayarans = ["Cash", "Transfer Bank",  "Dana", "Gopay", "LinkAja", "Ovo","Shopee Pay", ];

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ContentAnalitik = () => {
  const [produkTerjual, setProdukTerjual] = useState(0);
  const [totalUang, setTotalUang] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  const chartRefs = useRef({
    provinsi: null,
    kategori: null,
    kurir: null,
    pembayaran: null,
    penjualan: null, // Line chart reference for monthly data
  });

  const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);


  // const createChart = (ctx, type, labels, data, colors) => {
    const createChart = (ctxId, type, labels, data, colors, title) => {
      const ctx = document.getElementById(ctxId).getContext('2d');
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: [{
            label: '',
            data: labels.map(label => data[label] || 0),
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { 
              display: type === 'pie' ? true : false,  
              position: type === 'pie' ? 'bottom' : 'top',
              labels: { color: 'white' } 
            },
            title: { display: true, text: title, color: 'white', font: { size: 20 } }
          },
          scales: type === 'line' || type === 'bar' ? {
            x: {
              ticks: { color: 'white' }, 
              grid: { color: 'rgba(255, 255, 255, .2)' } // Solid white grid
            },
            y: {
              ticks: { color: 'white' }, 
              grid: { color: 'rgba(255, 255, 255, .2)' }, 
              beginAtZero: true
            }
          } : {}, // Empty object disables grid lines for pie charts
          elements: {
            line: {
              backgroundColor: '#FFFFFF',  // Make the background white
            }
          }
        }
      });
    };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('tabel_produk').select('kuantitas, harga, kategori, metode_pembayaran, kurir, provinsi, tanggal_pembelian');

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      const produkTerjualSum = data.reduce((sum, row) => sum + row.kuantitas, 0);
      const totalUangSum = data.reduce((sum, row) => sum + row.harga * row.kuantitas, 0);

      setProdukTerjual(produkTerjualSum);
      setTotalUang(totalUangSum);

      // Process data for monthly sales
      const monthlySales = months.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
      }, {});

      data.forEach(row => {
        const month = new Date(row.tanggal_pembelian).toLocaleString('default', { month: 'short' });
        if (monthlySales[month] !== undefined) {
          monthlySales[month] += row.kuantitas;
        }
      });

      setMonthlyData(monthlySales);

      // Create charts after data is fetched
      const chartData = {
        provinsi: provinces.reduce((acc, province) => { acc[province] = 0; return acc; }, {}),
        kategori: kategoris.reduce((acc, kategori) => { acc[kategori] = 0; return acc; }, {}),
        kurir: kurirs.reduce((acc, kurir) => { acc[kurir] = 0; return acc; }, {}),
        pembayaran: pembayarans.reduce((acc, pembayaran) => { acc[pembayaran] = 0; return acc; }, {}),
      };

      data.forEach(row => {
        chartData.provinsi[row.provinsi] += row.kuantitas;
        chartData.kategori[row.kategori] += row.kuantitas;
        chartData.kurir[row.kurir] += row.kuantitas;
        chartData.pembayaran[row.metode_pembayaran] += row.kuantitas;
      });

      // Destroy previous charts if they exist
      Object.keys(chartRefs.current).forEach(key => {
        if (chartRefs.current[key]) chartRefs.current[key].destroy();
      });

      const colors = {
        background: ['rgba(255, 99, 132, .6)', 'rgba(54, 162, 235, .6)', 'rgba(255, 206, 86, .6)', 'rgba(75, 192, 192, .6)', 'rgba(153, 102, 255, .6)'],
        border: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)']
      };
      // Create new charts
      chartRefs.current.provinsi = createChart('chart-provinsi', 'bar', provinces, chartData.provinsi, colors,"Penjulan Per Provinsi");
      chartRefs.current.kategori = createChart('chart-kategori', 'pie', kategoris, chartData.kategori, colors, "Kategori");
      chartRefs.current.kurir = createChart('chart-kurir', 'pie', kurirs, chartData.kurir, colors, "Kurir");
      chartRefs.current.pembayaran = createChart('chart-pembayaran', 'pie', pembayarans, chartData.pembayaran, colors, "Metode Pembayaran");

      // Line chart for monthly sales
      chartRefs.current.penjualan = createChart('chart-penjualan', 'line', months, monthlySales, colors, "Penjualan Per Bulan");
    };

    fetchData();
  }, []);

  return (
    <div className="content-analitik">
      <div className="row-pertama">
        <div className="card">
          <img src={produkTerjualImg} alt="Product Image" className="card-image" />
          <div className="teks-wrapper-column">
            <p className="card-text">Produk terjual</p>
            <p className="card-value">{produkTerjual}</p>
          </div>
        </div>
        <div className="card">
          <img src={totalUangImg} alt="Total Money Image" className="card-image" />
          <div className="teks-wrapper-column">
            <p className="card-text">Total Uang</p>
            <p className="card-value">{formatRupiah(totalUang)}</p>
          </div>
        </div>
      </div>

      <div className="row-kedua">
        <div className="card">
          <canvas id="chart-penjualan" width="1070" height="200"></canvas>
        </div>
      </div>

      <div className="row-ketiga">
        <div className="card">
          <canvas id="chart-provinsi" width="1070" height="200"></canvas>
        </div>
      </div>

      <div className="row-keempat">
        <div className="card">
          <canvas id="chart-kategori" width="700" height="200"></canvas>
        </div>
        <div className="card">
          <canvas id="chart-kurir" width="500" height="200"></canvas>
        </div>
        <div className="card">
          <canvas id="chart-pembayaran" width="500" height="200"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalitik;
