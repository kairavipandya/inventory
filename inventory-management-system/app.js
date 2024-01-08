const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000; // You can change this port as needed

// Connect to MongoDB Atlas using the connection string
mongoose.connect('mongodb+srv://user:password5678@cluster0.22dlrtq.mongodb.net/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));

// Define your MongoDB models and routes here

// Define the Product model
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
  });
  
  const Product = mongoose.model('Product', productSchema);
  

// Route for the homepage
app.get('/', (req, res) => {
  res.render('home');
});

// Route to list products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
});

// Route to add a product (GET request to display the form)
app.get('/add-product', (req, res) => {
    res.render('add-product');
  });
  
  // Route to add a product (POST request to process the form submission)
  app.post('/add-product', async (req, res) => {
    try {
      const { name, description, price } = req.body;
  
      // Create a new product object
      const newProduct = new Product({
        name,
        description,
        price,
      });
  
      // Save the product to the database
      await newProduct.save();
  
      // Redirect to the product list page (you can customize this)
      res.redirect('/products');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error: ' + err.message);
    }
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Route to insert sample products (You can remove this route after insertion)
app.get('/sample-products', async (req, res) => {
    try {
      // Insert the sample products into the database
      await Product.insertMany(sampleProducts);
  
      res.send('Sample products inserted successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error: ' + err.message);
    }
  });
  