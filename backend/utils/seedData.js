const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const connectDB = require('../config/database');

const products = [
  {
    name: "iPhone 15 Pro Max",
    price: 29990000,
    category: "phone",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
    rating: 4.9,
    reviewCount: 0,
    isNew: true,
    discount: 10,
    description: "iPhone 15 Pro Max titanium, chip A17 Pro, camera 48MP.",
    stock: 45
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 27990000,
    category: "phone",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
    rating: 4.8,
    reviewCount: 0,
    isNew: true,
    discount: 15,
    description: "Galaxy S24 Ultra, Snapdragon 8 Gen 3, S Pen, camera 200MP.",
    stock: 38
  },
  {
    name: "MacBook Pro M3 14 inch",
    price: 45990000,
    category: "laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    rating: 5.0,
    reviewCount: 0,
    isNew: true,
    discount: 8,
    description: "MacBook Pro 14 inch, chip M3, RAM 16GB, SSD 512GB.",
    stock: 28
  },
  {
    name: "Dell XPS 15",
    price: 38990000,
    category: "laptop",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    rating: 4.7,
    reviewCount: 0,
    isNew: false,
    discount: 20,
    description: "Dell XPS 15, Intel i7 Gen 13, RTX 4050, màn hình OLED.",
    stock: 22
  },
  {
    name: "iPad Pro M2 12.9 inch",
    price: 27990000,
    category: "tablet",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    rating: 4.9,
    reviewCount: 0,
    isNew: true,
    discount: 12,
    description: "iPad Pro 12.9 inch, chip M2, màn hình Liquid Retina XDR.",
    stock: 35
  },
  {
    name: "Samsung Galaxy Tab S9",
    price: 22990000,
    category: "tablet",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500",
    rating: 4.6,
    reviewCount: 0,
    isNew: false,
    discount: 18,
    description: "Galaxy Tab S9, Snapdragon 8 Gen 2, màn hình AMOLED 11 inch.",
    stock: 30
  },
  {
    name: "AirPods Pro 2",
    price: 6290000,
    category: "accessory",
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500",
    rating: 4.8,
    reviewCount: 0,
    isNew: false,
    discount: 15,
    description: "AirPods Pro 2, chống ồn chủ động, chip H2.",
    stock: 120
  },
  {
    name: "Sony WH-1000XM5",
    price: 8990000,
    category: "accessory",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
    rating: 5.0,
    reviewCount: 0,
    isNew: false,
    discount: 10,
    description: "Sony WH-1000XM5, chống ồn tốt nhất, pin 30 giờ.",
    stock: 85
  },
  {
    name: "Logitech MX Master 3S",
    price: 2490000,
    category: "accessory",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    rating: 4.7,
    reviewCount: 0,
    isNew: false,
    discount: 25,
    description: "Chuột không dây cao cấp, 8000 DPI, pin 70 ngày.",
    stock: 95
  },
  {
    name: "Keychron K8 Pro",
    price: 3290000,
    category: "accessory",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    rating: 4.8,
    reviewCount: 0,
    isNew: true,
    discount: 8,
    description: "Bàn phím cơ không dây, hot-swap, RGB.",
    stock: 67
  },
  {
    name: "ASUS ROG Zephyrus G14",
    price: 42990000,
    category: "laptop",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    rating: 4.9,
    reviewCount: 0,
    isNew: true,
    discount: 12,
    description: "ASUS ROG G14, Ryzen 9, RTX 4060, màn hình 165Hz.",
    stock: 18
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    price: 36990000,
    category: "laptop",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
    rating: 4.6,
    reviewCount: 0,
    isNew: false,
    discount: 15,
    description: "ThinkPad X1 Carbon Gen 11, Intel i7, nhẹ 1.12kg.",
    stock: 25
  },
  {
    name: "Xiaomi 14 Pro",
    price: 19990000,
    category: "phone",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    rating: 4.7,
    reviewCount: 0,
    isNew: true,
    discount: 20,
    description: "Xiaomi 14 Pro, Snapdragon 8 Gen 3, camera Leica.",
    stock: 55
  },
  {
    name: "Google Pixel 8 Pro",
    price: 24990000,
    category: "phone",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    rating: 4.8,
    reviewCount: 0,
    isNew: true,
    discount: 10,
    description: "Pixel 8 Pro, Google Tensor G3, camera AI đỉnh cao.",
    stock: 42
  },
  {
    name: "Apple Watch Series 9",
    price: 10990000,
    category: "accessory",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    rating: 4.9,
    reviewCount: 0,
    isNew: true,
    discount: 8,
    description: "Apple Watch Series 9, chip S9, màn hình Always-On.",
    stock: 78
  },
  {
    name: "Samsung Galaxy Watch 6",
    price: 7990000,
    category: "accessory",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    rating: 4.6,
    reviewCount: 0,
    isNew: false,
    discount: 15,
    description: "Galaxy Watch 6, Wear OS, theo dõi sức khỏe toàn diện.",
    stock: 62
  }
];

// Import Data
const importData = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    console.log('🔄 Deleting old data...'.yellow);

    // Delete all existing data
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed'.red.inverse);

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    console.log('🔐 Passwords hashed'.cyan);
    console.log('   Admin password hash:', adminPassword.substring(0, 30) + '...'.gray);
    console.log('   User password hash:', userPassword.substring(0, 30) + '...'.gray);

    // Create users with HASHED passwords
    const adminUser = await User.create({
      name: 'Admin ThQuanShop',
      email: 'admin@thquanshop.com',
      password: adminPassword,  // Password đã hash
      role: 'admin',
      phone: '0819480680'
    });

    const normalUser = await User.create({
      name: 'Nguyễn Văn A',
      email: 'user@gmail.com',
      password: userPassword,  // Password đã hash
      role: 'user',
      phone: '0987654321'
    });

    console.log('👥 Users Imported'.green.inverse);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log('📦 Products Imported'.green.inverse);

    console.log('✅ Data Imported Successfully!'.green.inverse);
    console.log('');
    console.log('📧 Admin Account:'.yellow);
    console.log('   Email: admin@thquanshop.com'.cyan);
    console.log('   Password: admin123'.cyan);
    console.log('');
    console.log('📧 User Account:'.yellow);
    console.log('   Email: user@gmail.com'.cyan);
    console.log('   Password: user123'.cyan);
    console.log('');

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    console.error(error);
    process.exit(1);
  }
};

// Destroy Data
const destroyData = async () => {
  try {
    await connectDB();
    
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Run based on argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}