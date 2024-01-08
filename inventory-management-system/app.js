const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000; // You can change this port as needed

// Connect to MongoDB Atlas using the connection string
mongoose.connect('mongodb+srv://user:password5678@cluster0.22dlrtq.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample products data
const sampleProducts = [
    {
      name: 'Apples',
      description: 'Fresh red apples',
      price: 1.99,
    },
    {
      name: 'Bananas',
      description: 'Ripe bananas',
      price: 0.79,
    },
    {
      name: 'Milk',
      description: '1 gallon of whole milk',
      price: 2.49,
    },
    {
      name: 'Bread',
      description: 'Whole wheat bread',
      price: 2.29,
    },
    {
      name: 'Eggs',
      description: 'Dozen large eggs',
      price: 1.99,
    },
  ];
  

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));

// Define your MongoDB models and routes here

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = mongoose.model('Product', productSchema);

const inventoryRecordSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  timestamp: { type: Date, default: Date.now },
});

const InventoryRecord = mongoose.model('InventoryRecord', inventoryRecordSchema);

const orderSchema = new mongoose.Schema({
  products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  totalAmount: Number,
  timestamp: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);


// Route to list products
app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.render('products', { products });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  // Route to add a product (similarly for other routes)
  app.get('/add-product', (req, res) => {
    res.render('add-product');
  });
  
  // Route for the homepage
app.get('/', (req, res) => {
    res.render('home'); // Create a 'home.ejs' view for the homepage
  });
  



// Route to insert sample products into the database
app.get('/insert-sample-products', async (req, res) => {
    try {
      // Insert each product from the sampleProducts array into the Products collection
      for (const productData of sampleProducts) {
        const product = new Product(productData);
        await product.save();
      }
  
      res.send('Sample products inserted successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to insert sample products.');
    }
  });
  