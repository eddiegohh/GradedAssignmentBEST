// Import the Express.js framework
const express = require('express');
// To link MySQL data
const mysql = require('mysql2');

// for multer
const multer = require('multer');

// Include code for body-parser
const bodyParser = require('body-parser');

// Create an instance of the Express application. This app variable will be used to define routes and configure the server.
const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// This line tells Express to serve static files from the public directory.
app.use(express.static('public'));

// Specify the port for the server to listen on
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware to parse incoming request bodies 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MySQL connection for GA_login database 
const gaLoginConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_C207',
    database: 'GA_login'
});

gaLoginConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL (GA_login):', err);
        return;
    }
    console.log('Connected to MySQL database (GA_login)');
});

// MySQL connection for vendor database 
const vendorConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_C207',
    database: 'vendor'
});

vendorConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL (vendor):', err);
        return;
    }
    console.log('Connected to MySQL database (vendor)');
});

// MySQL connection for cart database 
const cartConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_C207',
    database: 'cart'
});

cartConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL (cart):', err);
        return;
    }
    console.log('Connected to MySQL database (cart)');
});

// Routes for CRUD operations
app.get('/', (req, res) => {
    res.render('index');
});

// Route to render the signup page 
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route to handle user signup 
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const INSERT_USER_QUERY = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    gaLoginConnection.query(INSERT_USER_QUERY, [username, email, password], (error, results) => {
        if (error) {
            console.error('Error inserting user:', error);
            return res.status(500).send('Error inserting user');
        }

        console.log('User signed up successfully');
        res.redirect('/login');
    });
});

// Route to render the login page 
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Route to handle user login 
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const SELECT_USER_QUERY = 'SELECT * FROM users WHERE email = ? AND password = ?';

    gaLoginConnection.query(SELECT_USER_QUERY, [email, password], (error, results) => {
        if (error) {
            console.error('Error retrieving user:', error);
            return res.status(500).send('Error retrieving user');
        }

        if (results.length === 0) {
            return res.status(401).render('login', { error: 'Email or password incorrect' });
        }

        console.log('User logged in successfully');
        const userId = results[0].id;

        res.cookie('userId', userId, { httpOnly: true });

        // Redirect to the order page on successful login 
        res.redirect('/order');
    });
});

// Add a route to render the order page
app.get('/order', (req, res) => {
    const SELECT_ALL_VENDORS_QUERY = 'SELECT * FROM vendors';
    const SELECT_MENU_ITEMS_QUERY = 'SELECT * FROM menu_items WHERE vendor_id = ?';

    vendorConnection.query(SELECT_ALL_VENDORS_QUERY, (vendorError, vendors) => {
        if (vendorError) {
            console.error('Error retrieving vendors:', vendorError);
            return res.status(500).send('Error retrieving vendors');
        }

        let menuItems = {};
        let completedRequests = 0;

        vendors.forEach(vendor => {
            vendorConnection.query(SELECT_MENU_ITEMS_QUERY, [vendor.id], (menuError, items) => {
                if (menuError) {
                    console.error('Error retrieving menu items:', menuError);
                    return res.status(500).send('Error retrieving menu items');
                }
                menuItems[vendor.id] = items;
                completedRequests++;

                if (completedRequests === vendors.length) {
                    res.render('order', { vendors, menuItems, userRole: req.query.role || 'user' });
                }
            });
        });
    });
});

// Handle the submission of the order form
app.post('/order', (req, res) => {
    const selectedItems = req.body.items;

    // Handle the order placement logic here
    console.log('Order placed for items:', selectedItems);
    res.send('Order placed successfully!');
});

// Contact us page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Handle form submission from the contact page
app.post('/submit', (req, res) => {
    const { reason, name, email, contact, feedbacks } = req.body;
    res.render('submitted', { reason, name, email, contact, feedbacks });
});

// Routes for vendor CRUD operations
// Display all vendors
app.get('/vendors', (req, res) => {
    const SELECT_ALL_VENDORS_QUERY = 'SELECT * FROM vendors';
    vendorConnection.query(SELECT_ALL_VENDORS_QUERY, (error, results) => {
        if (error) {
            console.error('Error retrieving vendors:', error);
            return res.status(500).send('Error retrieving vendors');
        }
        res.render('vendors', { vendors: results });
    });
});

// Render form to add new vendor
app.get('/vendors/new', (req, res) => {
    res.render('new_vendor');
});

// Add a new vendor
app.post('/vendors', (req, res) => {
    const { name, canteen } = req.body;
    const INSERT_VENDOR_QUERY = 'INSERT INTO vendors (name, canteen) VALUES (?, ?)';
    vendorConnection.query(INSERT_VENDOR_QUERY, [name, canteen], (error, results) => {
        if (error) {
            console.error('Error adding vendor:', error);
            return res.status(500).send('Error adding vendor');
        }
        res.redirect('/vendors');
    });
});

// Render form to edit vendor
app.get('/vendors/:id/edit', (req, res) => {
    const { id } = req.params;
    const SELECT_VENDOR_BY_ID_QUERY = 'SELECT * FROM vendors WHERE id = ?';
    vendorConnection.query(SELECT_VENDOR_BY_ID_QUERY, [id], (error, results) => {
        if (error) {
            console.error('Error retrieving vendor:', error);
            return res.status(500).send('Error retrieving vendor');
        }
        if (results.length === 0) {
            return res.status(404).send('Vendor not found');
        }
        res.render('edit_vendor', { vendor: results[0] });
    });
});

// Update a vendor
app.post('/vendors/:id', (req, res) => {
    const { id } = req.params;
    const { name, canteen } = req.body;
    const UPDATE_VENDOR_QUERY = 'UPDATE vendors SET name = ?, canteen = ? WHERE id = ?';
    vendorConnection.query(UPDATE_VENDOR_QUERY, [name, canteen, id], (error, results) => {
        if (error) {
            console.error('Error updating vendor:', error);
            return res.status(500).send('Error updating vendor');
        }
        res.redirect('/vendors');
    });
});

// Delete a vendor
app.post('/vendors/:id/delete', (req, res) => {
    const { id } = req.params;
    const DELETE_VENDOR_QUERY = 'DELETE FROM vendors WHERE id = ?';
    vendorConnection.query(DELETE_VENDOR_QUERY, [id], (error, results) => {
        if (error) {
            console.error('Error deleting vendor:', error);
            return res.status(500).send('Error deleting vendor');
        }
        res.redirect('/vendors');
    });
});

// Route to render the vendor login page
app.get('/login/vendor', (req, res) => {
    res.render('vendorlogin', { error: null });
});

// Route to handle vendor login
app.post('/login/vendor', (req, res) => {
    const { email, password } = req.body;
    const SELECT_VENDOR_QUERY = 'SELECT * FROM vendors WHERE email = ? AND password = ?';

    gaLoginConnection.query(SELECT_VENDOR_QUERY, [email, password], (error, results) => {
        if (error) {
            console.error('Error retrieving vendor:', error);
            return res.status(500).send('Error retrieving vendor');
        }

        if (results.length === 0) {
            return res.status(401).render('vendorlogin', { error: 'Email or password incorrect' });
        }

        console.log('Vendor logged in successfully');
        const vendorId = results[0].username; // Use username since there's no id column

        res.cookie('vendorId', vendorId, { httpOnly: true });

        // Redirect to the vendors page on successful login 
        res.redirect('/vendors');
    });
});

// Fetch menu items for a vendor
app.get('/vendors/:id/menu', (req, res) => {
    const { id } = req.params;
    const SELECT_VENDOR_QUERY = 'SELECT * FROM vendors WHERE id = ?';
    const SELECT_MENU_ITEMS_QUERY = 'SELECT * FROM menu_items WHERE vendor_id = ?';

    vendorConnection.query(SELECT_VENDOR_QUERY, [id], (error, vendorResults) => {
        if (error) {
            console.error('Error retrieving vendor:', error);
            return res.status(500).send('Error retrieving vendor');
        }
        if (vendorResults.length === 0) {
            return res.status(404).send('Vendor not found');
        }

        vendorConnection.query(SELECT_MENU_ITEMS_QUERY, [id], (menuError, menuResults) => {
            if (menuError) {
                console.error('Error retrieving menu items:', menuError);
                return res.status(500).send('Error retrieving menu items');
            }

            res.render('vendor_menu', { vendor: vendorResults[0], menuItems: menuResults });
        });
    });
});

// Render form to add new menu item
app.get('/vendors/:id/menu/new', (req, res) => {
    const { id } = req.params;
    res.render('new_menu_item', { vendorId: id });
});

// Add a new menu item
app.post('/vendors/:id/menu', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const INSERT_MENU_ITEM_QUERY = 'INSERT INTO menu_items (vendor_id, name) VALUES (?, ?)';
    vendorConnection.query(INSERT_MENU_ITEM_QUERY, [id, name], (error, results) => {
        if (error) {
            console.error('Error adding menu item:', error);
            return res.status(500).send('Error adding menu item');
        }
        res.redirect(`/vendors/${id}/menu`);
    });
});

// Render form to edit menu item
app.get('/vendors/:vendorId/menu/:itemId/edit', (req, res) => {
    const { vendorId, itemId } = req.params;
    const SELECT_MENU_ITEM_BY_ID_QUERY = 'SELECT * FROM menu_items WHERE id = ?';
    vendorConnection.query(SELECT_MENU_ITEM_BY_ID_QUERY, [itemId], (error, results) => {
        if (error) {
            console.error('Error retrieving menu item:', error);
            return res.status(500).send('Error retrieving menu item');
        }
        if (results.length === 0) {
            return res.status(404).send('Menu item not found');
        }
        res.render('edit_menu_item', { menuItem: results[0], vendorId });
    });
});

// Update a menu item
app.post('/vendors/:vendorId/menu/:itemId', (req, res) => {
    const { vendorId, itemId } = req.params;
    const { name } = req.body;
    const UPDATE_MENU_ITEM_QUERY = 'UPDATE menu_items SET name = ? WHERE id = ?';
    vendorConnection.query(UPDATE_MENU_ITEM_QUERY, [name, itemId], (error, results) => {
        if (error) {
            console.error('Error updating menu item:', error);
            return res.status(500).send('Error updating menu item');
        }
        res.redirect(`/vendors/${vendorId}/menu`);
    });
});

// Delete a menu item
app.post('/vendors/:vendorId/menu/:itemId/delete', (req, res) => {
    const { vendorId, itemId } = req.params;
    const DELETE_MENU_ITEM_QUERY = 'DELETE FROM menu_items WHERE id = ?';
    vendorConnection.query(DELETE_MENU_ITEM_QUERY, [itemId], (error, results) => {
        if (error) {
            console.error('Error deleting menu item:', error);
            return res.status(500).send('Error deleting menu item');
        }
        res.redirect(`/vendors/${vendorId}/menu`);
    });
});

// Add a new item to the cart
app.post('/cart/add', (req, res) => {
    const { canteen, vendor, food } = req.body;
    const ADD_TO_CART_QUERY = 'INSERT INTO cart_items (canteen, vendor, food) VALUES (?, ?, ?)';
    cartConnection.query(ADD_TO_CART_QUERY, [canteen, vendor, food], (error, results) => {
        if (error) {
            console.error('Error adding item to cart:', error);
            return res.status(500).send('Error adding item to cart');
        }
        res.send('Item added to cart');
    });
});

// Fetch all items in the cart
app.get('/cart/items', (req, res) => {
    const FETCH_CART_ITEMS_QUERY = 'SELECT * FROM cart_items';
    cartConnection.query(FETCH_CART_ITEMS_QUERY, (error, results) => {
        if (error) {
            console.error('Error fetching cart items:', error);
            return res.status(500).send('Error fetching cart items');
        }
        res.json(results);
    });
});
// Route to remove an item from the cart
app.delete('/cart/remove/:id', (req, res) => {
    const { id } = req.params;
    const DELETE_CART_ITEM_QUERY = 'DELETE FROM cart_items WHERE id = ?';
    cartConnection.query(DELETE_CART_ITEM_QUERY, [id], (error, results) => {
        if (error) {
            console.error('Error removing item from cart:', error);
            return res.status(500).send('Error removing item from cart');
        }
        res.send('Item removed from cart');
    });
});

// Route to fetch all items in the cart for checkout page
app.get('/checkout', (req, res) => {
    const FETCH_CART_ITEMS_QUERY = 'SELECT * FROM cart_items';
    cartConnection.query(FETCH_CART_ITEMS_QUERY, (error, results) => {
        if (error) {
            console.error('Error fetching cart items:', error);
            return res.status(500).send('Error fetching cart items');
        }
        res.render('checkout', { cartItems: results });
    });
});

// Route to confirm the order
app.post('/checkout/confirm', (req, res) => {
    const FETCH_CART_ITEMS_QUERY = 'SELECT * FROM cart_items';
    cartConnection.query(FETCH_CART_ITEMS_QUERY, (fetchError, results) => {
        if (fetchError) {
            console.error('Error fetching cart items:', fetchError);
            return res.status(500).send('Error fetching cart items');
        }

        // Clear the cart after fetching the items
        const CLEAR_CART_QUERY = 'DELETE FROM cart_items';
        cartConnection.query(CLEAR_CART_QUERY, (clearError) => {
            if (clearError) {
                console.error('Error clearing cart:', clearError);
                return res.status(500).send('Error clearing cart');
            }
            res.json({ order: results });
        });
    });
});

// Route to render the order summary page
app.get('/ordersummary', (req, res) => {
    const order = JSON.parse(decodeURIComponent(req.query.order));
    res.render('ordersummary', { cartItems: order });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});





















