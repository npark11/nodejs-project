const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const contactRoute = require('./routes/contactRoute');
const postRoute = require('./routes/postRoute');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://lemontree-inventory-app.onrender.com"],
  credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Middleware
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/contact', contactRoute);
app.use('/api/posts', postRoute);


app.get('/', (req, res) => {
  res.send('Hello World!');
});




// Connect to DB and start server
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`)
    })
  })
  .catch((err) => console.log(err))
