const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path'); // HANYA SATU KALI DECLARE DISINI

// Import Models
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// --- SETUP FOLDER STATIC (PENTING UNTUK GAMBAR) ---
// Menggunakan path.join agar aman di Docker Railway
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- KONEKSI MONGODB ---
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/f1marketplace';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// --- SETUP MULTER (UPLOAD) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Pastikan folder ini ada (sudah dibuat via Dockerfile)
  },
  filename: function (req, file, cb) {
    // Tambah timestamp biar nama file unik
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

// ================= ROUTES API =================

// 1. CEK SERVER
app.get('/', (req, res) => {
    res.send('Server F1 Marketplace Berjalan!');
});

// 2. GET PRODUCTS (Katalog)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. CREATE PRODUCT (Admin)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.productData);
    let imagePath = '';

    // --- FIX PENTING: URL GAMBAR DINAMIS ---
    // Jika di Railway, ini akan jadi https://f1s.../uploads/..
    // Jika di Local, ini akan jadi http://localhost:3000/uploads/..
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}`;

    if (req.file) {
      imagePath = `${fullUrl}/uploads/${req.file.filename}`;
    } else if (data.images && data.images.length > 0) {
      imagePath = data.images[0];
    }

    const newProduct = new Product({
      ...data,
      id: data.id || Date.now().toString(),
      images: [imagePath]
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// 4. SEED DATABASE
app.post('/api/seed', async (req, res) => {
  try {
    console.log("Resetting Database...");
    await Product.deleteMany({});
    await Order.deleteMany({});
    
    const productsJson = req.body;
    await Product.insertMany(productsJson);

    res.json({ message: "Database Total Reset! Semua Produk & Order telah dihapus." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. CREATE ORDER
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. GET ORDERS
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. DELETE PRODUCT
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findOneAndDelete({ id: id });
        
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di Port ${PORT}`);
});