const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🛒 ThQuanShop API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      reviews: '/api/reviews',
      users: '/api/users'
    }
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50).cyan);
  console.log(`🚀 Server running on port ${PORT}`.green.bold);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`.yellow);
  console.log(`🌐 API URL: http://localhost:${PORT}`.cyan);
  console.log('='.repeat(50).cyan);
  console.log('');
  console.log('📡 Available Routes:'.magenta.bold);
  console.log('   POST   /api/auth/register'.green);
  console.log('   POST   /api/auth/login'.green);
  console.log('   GET    /api/auth/me'.green);
  console.log('   GET    /api/products'.green);
  console.log('   GET    /api/products/:id'.green);
  console.log('   POST   /api/products (Admin)'.green);
  console.log('   PUT    /api/products/:id (Admin)'.green);
  console.log('   DELETE /api/products/:id (Admin)'.green);
  console.log('   POST   /api/orders'.green);
  console.log('   GET    /api/orders/my'.green);
  console.log('   GET    /api/orders (Admin)'.green);
  console.log('   PUT    /api/orders/:id/status (Admin)'.green);
  console.log('   PUT    /api/orders/:id/cancel'.green);
  console.log('   GET    /api/reviews/product/:id'.green);
  console.log('   POST   /api/reviews'.green);
  console.log('   DELETE /api/reviews/:id'.green);
  console.log('   GET    /api/users (Admin)'.green);
  console.log('');
  console.log('💡 Ready to accept requests!'.green.bold);
  console.log('');
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`.red.bold);
  process.exit(1);
});