require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const { sequelize } = require('./models');


app.use((err, req, res, next) => {
  console.error("this is body",req.body  );
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.use('/admin', adminRoutes);
app.use('/seller', sellerRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected properly');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }); 