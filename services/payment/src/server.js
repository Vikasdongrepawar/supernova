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

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`✅ Payment service running on port ${PORT}`);
});