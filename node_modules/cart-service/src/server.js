const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
const cartRoutes = require('./routes/cartRoutes');
app.use('/cart', cartRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`✅ Cart service running on port ${PORT}`);
});
