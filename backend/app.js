const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require ('multer')
const jwt = require('jsonwebtoken'); 
const path = require('path'); 


const app = express();

app.use(cors({ origin: '*' })); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, 'uploads'); // Make sure the destination directory exists
//   },
//   filename: (req, file, cb) => {
//       cb(null, file.originalname); // Use the original file name
//   },
// });

const upload = multer({ 
  storage:  multer.memoryStorage(),
});

const basketItemsRoutes = require('./routes/basketItems');
const basketsRoutes = require('./routes/baskets');
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');
const packImagesRoutes = require('./routes/packImages');
const packsRoutes = require('./routes/packs');
const productImagesRoutes = require('./routes/productImages');
const productsRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const categoryImagesRoutes = require("./routes/categoryImages");
const receptionImagesRoutes = require("./routes/receptionImages")

const JWT_SECRET_KEY = 'f2$H#0pL&9A!zqNkR8TgYv3w5ZsXxUrZ'; 


function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId; 
    next();
  });
}

app.get('/admin/authenticate', verifyToken, (req, res) => {
  res.status(200).json({ authenticated: true });
});

app.use('/api/basketItems', basketItemsRoutes);
app.use('/api/baskets', basketsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/packImages', packImagesRoutes);
app.use('/api/packs', packsRoutes);
app.use('/api/productImages', productImagesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categoryImages',categoryImagesRoutes);
app.use('/api/receptionImages',receptionImagesRoutes);

const imageController = require('./controllers/controllers');
app.post('/api/s3/upload/:key', upload.single('image'), imageController.uploadImageToS3);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
