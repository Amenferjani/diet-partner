const db = require('../config/database'); 
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();


    
/****************************************************************************/
/*                                                                           */
/*                                                                           */
/*//!                        PRODUCTS CONTROLLER                          !//*/
/*                                                                           */
/*                                                                           */
/****************************************************************************/
    

const createProduct = (req, res) => {
    const { name, description, price, status, discount, categoryId, packId } = req.body;

    // Your SQL INSERT query to create a new product
    const sql = `INSERT INTO Products (name, description, price, status, discount, category_id, pack_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
    
    // Execute the query and handle the response
    db.query(sql, [name, description, price, status, discount, categoryId, packId], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while creating the product.' });
        }
        const insertedId = result.insertId;
        return res.status(201).json({ message: 'Product created successfully.',productId:insertedId });
    });
};
const getAllProduct = (req, res) => {

    // Your SQL query to retrieve products with similar names
    const sql = `SELECT * FROM Products  ORDER BY created_at desc`;
    
    // Execute the query and handle the response
    db.query(sql, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the products.' });
        }

        return res.json(result);
    });
};
const getLastProducts = (req, res) => {
    const sql = `
        SELECT * 
        FROM Products 
        ORDER BY id DESC
        LIMIT 3
    `;
    
    // Execute the query
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the products.' });
        }
        
        // Return the results as JSON
        res.json(results);
    });
}
const getProductByName = (req, res) => {
    const searchQuery = req.params.name;

    // Your SQL query to retrieve products with similar names
    const sql = `SELECT * FROM Products WHERE name LIKE ?`;
    
    // Execute the query and handle the response
    db.query(sql, [`%${searchQuery}%`], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the products.' });
        }

        return res.json(result);
    });
};
const getProductByPackId = (req,res) =>{
    const packId=parseInt(req.params.id);
    const sql = `SELECT * FROM Products WHERE pack_id = ?`;

    db.query(sql,[packId],(error,result) => {
        if(error){
            return res.status(500).json({ error: 'An error occurred while fetching the products.' });
        }
        return res.json(result);
    })
}
const getProductByCategoryId = (req , res) => {
    const categoryId=parseInt(req.params.id);
    const sql = `SELECT * FROM Products WHERE category_id = ?`;
    
    db.query(sql,[categoryId],(error, result)=> {
        if(error){
            return res.status(500).json({ error: 'An error occurred while fetching the products.' });
        }
        return res.json(result);
    })
}
const getProductById = (req ,res) => {
    const productId=parseInt(req.params.id);
    const sql = `SELECT * FROM Products WHERE id = ?`;

    db.query(sql,[productId],(error,result) => {
        if(error){
            return res.status(500).json({ error: 'An error occurred while fetching the products.' });
        }
        return res.json(result);
    })
}
const updateProductStatus= (req, res) => {
    const productId = req.params.id;
    const status = req.body.status;

    // Your SQL UPDATE query to update a product
    const sql = `UPDATE Products SET status=? WHERE id=?`;
    
    // Execute the query and handle the response
    db.query(sql, [status, productId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
    return res.json({ message: 'Product updated successfully.' });
    });
};
const updateProductDiscount= (req, res) => {
    const productId = req.params.id;
    const discount = req.body.discount;

    // Your SQL UPDATE query to update a product
    const sql = `UPDATE Products SET discount=? WHERE id=?`;
    
    // Execute the query and handle the response
    db.query(sql, [discount, productId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
    return res.json({ message: 'Product updated successfully.' });
    });
};
const deleteProduct = (req, res) => {
    const productId = req.params.id;

    // Your SQL DELETE query to delete a product
    const sql = `DELETE FROM Products WHERE id=?`;
    
    // Execute the query and handle the response
    db.query(sql, [productId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the product.' });
    }
    return res.json({ message: 'Product deleted successfully.' });
    });
};

    
/****************************************************************************/
/*                                                                           */
/*                                                                           */
/*//!                        BASKETS CONTROLLER                          !//*/
/*                                                                           */
/*                                                                           */
/****************************************************************************/
    

const createBasket = (req, res) => {
    const total_amount = 0; 
    // Your SQL INSERT query to create a new basket
    const sql = `INSERT INTO baskets (created_at, total_amount) VALUES (NOW(), ?)`;

    // Execute the query and handle the response
    db.query(sql, [total_amount], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while creating the basket.' });
        }
        const insertedId = result.insertId;
        return res.status(201).json({ message: 'Basket created successfully.',id:insertedId });
    });
};

const getBasketById = (req, res) => {
    const basketId = req.params.id;
    // Your SQL query to retrieve a basket by ID
    const sql = `SELECT * FROM baskets WHERE id = ?`;

    // Execute the query and handle the response
    db.query(sql, [basketId], (error, result) => {
        if (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the basket.' });
        }
        if (result.length === 0) {
        return res.status(404).json({ error: 'Basket not found.' });
        }
        return res.json(result[0]);
    });
};
const updateBasketTotalAmount = (req, res) => {
    const basketId = req.params.id;
    const newTotalAmount = req.body.newTotalAmount;

    // Your SQL UPDATE query to update the total_amount of the basket
    const sql = `UPDATE baskets SET total_amount = ? WHERE id = ?`;

    // Execute the query and handle the response
    db.query(sql, [newTotalAmount, basketId], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while updating the basket total amount.' });
        }
        return res.json({ message: 'Basket total amount updated successfully.' });
    });
};
const deleteBasket = (req, res) => {
    const basketId = req.params.id;
    // Your SQL DELETE query to delete a basket by ID
    const sql = `DELETE FROM baskets WHERE id = ?`;

    // Execute the query and handle the response
    db.query(sql, [basketId], (error, result) => {
        if (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the basket.' });
        }
        return res.json({ message: 'Basket deleted successfully.' });
    });
};

    
/****************************************************************************/
/*                                                                           */
/*                                                                           */
/*//!                        BASKET-ITEMS CONTROLLER                          !//*/
/*                                                                           */
/*                                                                           */
/****************************************************************************/
    

const createBasketItem = (req, res) => {
    const { basket_id, product_id, quantity, isPack } = req.body;

    let productIDToInsert = null;
    let packIDToInsert = null;

    if (isPack === 1) {
        // If isPack is 1, set product_id to null and pack_id to the product_id from the request.
        packIDToInsert = product_id;
    } else {
        // If isPack is 0, set pack_id to null and product_id to the product_id from the request.
        productIDToInsert = product_id;
    }

    // Your SQL INSERT query to create a new basket item
    const sql = `INSERT INTO basketItems (basket_id, product_id, packid, isPack, quantity) VALUES (?, ?, ?, ?, ?)`;

    // Execute the query and handle the response
    db.query(sql, [basket_id, productIDToInsert, packIDToInsert, isPack, quantity], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while creating the basket item.' });
        }
        return res.status(201).json({ message: 'Basket item created successfully.' });
    });
};


const getBasketItemsById = (req, res) => {
    const basketId = req.params.basketId;

    // Your SQL query to retrieve a basket item by ID
    const sql = `SELECT * FROM basketItems WHERE basket_id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [basketId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the basket items.' });
    }
    if (result.length === 0) {
        return res.status(404).json({ error: 'Basket item not found.' });
    }
    return res.json(result);
    });
};



const updateBasketItem = (req, res) => {
    const basketItemId = req.params.id;
    const { quantity } = req.body;

    // Your SQL UPDATE query to update a basket item
    const sql = `UPDATE basketItems SET quantity = ? WHERE id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [quantity, basketItemId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the basket item.' });
    }
    return res.json({ message: 'Basket item updated successfully.' });
    });
};

const deleteBasketItem = (req, res) => {
    const basketItemId = req.params.id;

    // Your SQL DELETE query to delete a basket item by ID
    const sql = `DELETE FROM basketItems WHERE id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [basketItemId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the basket item.' });
    }
    return res.json({ message: 'Basket item deleted successfully.' });
    });
};

    
/****************************************************************************/
/*                                                                           */
/*                                                                           */
/*//!                        ORDERS CONTROLLER                          !//*/
/*                                                                           */
/*                                                                           */
/****************************************************************************/
    

// Generate random symbols using uppercase alphabet characters
function generateRandomSymbols(length) {
    
    const uppercaseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomSymbols = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * uppercaseAlphabet.length);
        randomSymbols += uppercaseAlphabet.charAt(randomIndex);
    }
    
    return randomSymbols;
}
function generateUniqueReference(orderId) {
    
    const randomSymbols = generateRandomSymbols(7); // You can adjust the length as needed
    return `${randomSymbols}-${orderId}`;
}

const createOrder = (req, res) => {
    
    const { basket_id, firstname, lastname, address, city, phone_number } = req.body;

    // Your SQL INSERT query to create a new order
    const createOrderSQL = `INSERT INTO orders (basket_id, firstname, lastname, address, city, phone_number, order_date)
                            VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    db.query(createOrderSQL, [basket_id, firstname, lastname, address, city, phone_number], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while creating the order.',error:error });
        }
        const generatedReference = generateUniqueReference(result.insertId); // Assuming result.insertId gives the newly inserted order ID

        // Update the order with the generated reference
        const updateReferenceSQL = `UPDATE orders SET reference = ? WHERE id = ?`;
        db.query(updateReferenceSQL, [generatedReference, result.insertId], (updateError) => {
            if (updateError) {
                return res.status(500).json({ error: 'An error occurred while updating the order reference.' });
            }

            return res.status(201).json({ message: 'Order created successfully.', reference: generatedReference });
        });
    });
};


const getOrderByReference = (req, res) => {
    const orderReference = req.params.reference;

    // Your SQL query to retrieve an order by reference
    const sql = `SELECT * FROM orders WHERE reference = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [orderReference], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the order.' });
    }
    if (result.length === 0) {
        return res.status(404).json({ error: 'Order not found.' });
    }
    return res.json(result[0]);
    });
};

const getAllOrders = (req,res) => {
    const sql = `SELECT * FROM orders ORDER BY order_date `;
    db.query(sql, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the categories.' });
        }
        return res.json(result);
        });
}
const deleteOrder = (req, res) => {
    const orderReference = req.params.reference;

    // Your SQL DELETE query to delete an order by reference
    const sql = `DELETE FROM orders WHERE reference = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [orderReference], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the order.' });
    }
    return res.json({ message: 'Order deleted successfully.' });
    });
};

    
/****************************************************************************/
/*                                                                           */
/*                                                                           */
/*//!                        CATEGORIES CONTROLLER                          !//*/
/*                                                                           */
/*                                                                           */
/****************************************************************************/
    

const createCategory = (req, res) => {
    const { name } = req.body;
    
        // Your SQL INSERT query to create a new category
        const sql = `INSERT INTO categories (name) VALUES (?)`;
        
        // Execute the query and handle the response
        db.query(sql, [name], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while creating the category.',error });
        }
        const insertedId = result.insertId;
        return res.status(201).json({ message: 'Category created successfully.',id:insertedId });
        });
    };
    
    const getAllCategories = (req, res) => {
        // Your SQL query to retrieve all categories
        const sql = `SELECT * FROM categories`;
        
        // Execute the query and handle the response
        db.query(sql, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the categories.' });
        }
        return res.json(result);
        });
    };
    
    const getCategoryByName = (req, res) => {
        const categoryName = req.params.name;
    
        // Your SQL query to retrieve a category by name
        const sql = `SELECT * FROM categories WHERE name = ?`;
        
        // Execute the query and handle the response
        db.query(sql, [categoryName], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the category.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Category not found.' });
        }
        return res.json(result[0]);
        });
    };
    
    const deleteCategory = (req, res) => {
        const categoryName = req.params.name;
    
        // Your SQL DELETE query to delete a category by name
        const sql = `DELETE FROM categories WHERE name = ?`;
        
        // Execute the query and handle the response
        db.query(sql, [categoryName], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while deleting the category.' });
        }
        return res.json({ message: 'Category deleted successfully.' });
        });
    };


/****************************************************************************/
/*                                                                          */
/*                                                                          */
/*//!                          PACKS CONTROLLER                          !//*/
/*                                                                          */
/*                                                                          */
/****************************************************************************/


const createPack = (req, res) => {
    const { name , price , discount } = req.body;

    // Your SQL INSERT query to create a new pack
    const sql = `INSERT INTO packs (name , price , discount ) VALUES (?,?,?)`;
    
    // Execute the query and handle the response
    db.query(sql, [name , price , discount ], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while creating the pack.' });
    }
    const insertedId = result.insertId;
    return res.status(201).json({ message: 'Pack created successfully.' ,packId: insertedId});
    });
};
const getLastPacks = (req, res) => {
    // SQL query to select the last two active packs
    const sql = `
        SELECT * 
        FROM packs 
        WHERE status = 'active'
        ORDER BY id DESC
        LIMIT 2
    `;
    
    // Execute the query
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the packs.' });
        }
        
        // Return the results as JSON
        res.json(results);
    });
};

const getAllPacks = (req, res) => {
    // Your SQL query to retrieve all packs
    const sql = `SELECT * FROM packs`;
    
    // Execute the query and handle the response
    db.query(sql, (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the packs.' });
    }
    return res.json(result);
    });
};
const getPackById = (req,res) => {
    const packId = req.params.id;
    const sql = `SELECT * FROM packs WHERE id = ?`

    db.query(sql,[packId], (error ,result) => {
        if(error){
            
            return res.status(500).json({ error: 'An error occurred while fetching the packs.' });
        }
        return res.json(result);
    });
};

const getPackByName = (req, res) => {
    const packName = req.params.name;

    // Your SQL query to retrieve a pack by ID
    const sql = `SELECT * FROM packs WHERE name = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [packName], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the pack.' });
    }
    if (result.length === 0) {
        return res.status(404).json({ error: 'Pack not found.' });
    }
    return res.json(result[0]);
    });
};

const updatePackName = (req, res) => {
    const packId = req.params.id;
    const { name } = req.body;

    // Your SQL UPDATE query to update a pack
    const sql = `UPDATE packs SET name = ? WHERE id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [name, packId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the pack.' });
    }
    return res.json({ message: 'Pack Name updated successfully.' });
    });
};
const updatePackDiscount = (req, res) => {
    const packId = req.params.id;
    const { discount } = req.body;

    // Your SQL UPDATE query to update a pack
    const sql = `UPDATE packs SET discount = ? WHERE id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [discount, packId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the pack.' });
    }
    return res.json({ message: 'Pack Discount updated successfully.' });
    });
};
const updatePackStatus = (req, res) => {
    const packId = req.params.id;
    const { status } = req.body;

    // Your SQL UPDATE query to update a pack
    const sql = `UPDATE packs SET status = ? WHERE id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [status, packId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the pack.' });
    }
    return res.json({ message: 'Pack status updated successfully.' });
    });
};

const deletePack = (req, res) => {
    const packId = req.params.id;

    // Your SQL DELETE query to delete a pack by ID
    const sql = `DELETE FROM packs WHERE id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [packId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the pack.' });
    }
    return res.json({ message: 'Pack deleted successfully.' });
    });
};


/****************************************************************************/
/*                                                                           */
/*                                                                           */
/*//!                        IMAGES CONTROLLER                          !//*/
/*                                                                           */
/*                                                                           */
/****************************************************************************/


/*                                                                           */
//!                           PRODUCT-IMAGES CONTROLLER                     !//
/*                                                                           */

const createProductImage = (req, res) => {
    const { product_id ,imageUrl } = req.body;

    // Your SQL INSERT query to create a new product image
    const sql = `INSERT INTO productImages (product_id, url) VALUES (?, ?)`;
    
    // Execute the query and handle the response
    db.query(sql, [product_id, imageUrl], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while creating the product image.' });
    }
    return res.status(201).json({ message: 'Product image created successfully.' });
    });
};

const getProductImageByProductId = (req, res) => {
    const productId = req.params.productId ;

    // Your SQL query to retrieve a product image by ID
    const sql = `SELECT * FROM productImages WHERE product_id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [productId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the product image.' });
    }
    if (result.length === 0) {
        return res.status(404).json({ error: 'Product image not found.' });
    }
    return res.json(result[0]);
    });
};
const updateProductUrlImage = (req, res) => {
    const productId = req.params.productId;
    const  imageUrl = req.body.url;

    // Your SQL UPDATE query to update a pack
    const sql = `UPDATE productImages SET url = ? WHERE product_id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [imageUrl, productId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the product image.' });
    }
    return res.json({ message: ' product image updated successfully.' });
    });
};
const deleteProductImageByProductId = (req, res) => {
    const productId = req.params.productId;

    // Your SQL DELETE query to delete a product image by ID
    const sql = `DELETE FROM productImages WHERE productId = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [productId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the product image.' });
    }
    return res.json({ message: 'Product image deleted successfully.' });
    });
};


/*                                                                           */
//!                             PACK-IMAGES CONTROLLER                      !//
/*                                                                           */


const createPackImage = (req, res) => {
    const { pack_id ,imageUrl  } = req.body;

    // Your SQL INSERT query to create a new pack image
    const sql = `INSERT INTO packImages (pack_id, url) VALUES (?, ?)`;
    
    // Execute the query and handle the response
    db.query(sql, [pack_id, imageUrl], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while creating the pack image.' });
    }
    return res.status(201).json({ message: 'Pack image created successfully.' });
    });
};

const getPackImageByPackId = (req, res) => {
    const packId = req.params.packId;

    // Your SQL query to retrieve a pack image by ID
    const sql = `SELECT * FROM packImages WHERE pack_id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [packId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the pack image.' });
    }
    if (result.length === 0) {
        return res.status(404).json({ error: 'Pack image not found.' });
    }
    return res.json(result[0]);
    });
};
const updatePackUrlImage = (req, res) => {
    const packId = req.params.packId;
    const { imageUrl } = req.body.url;

    // Your SQL UPDATE query to update a pack
    const sql = `UPDATE packImages SET url = ? WHERE pack_id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [imageUrl, packId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while updating the product image.' });
    }
    return res.json({ message: ' product image updated successfully.' });
    });
};
const deletePackImage = (req, res) => {
    const packId = req.params.pack_id;

    // Your SQL DELETE query to delete a pack image by ID
    const sql = `DELETE FROM packImages WHERE pack_id = ?`;
    
    // Execute the query and handle the response
    db.query(sql, [packId], (error, result) => {
    if (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the pack image.' });
    }
    return res.json({ message: 'Pack image deleted successfully.' });
    });
};

/*                                                                           */
//!                           CATEGORY-IMAGES CONTROLLER                    !//
/*                                                                           */

const createCategoryImage = (req, res) => {
    const { category_id,url } = req.body; // Assuming you send category_id and url in the request body
    // Insert the new category image into the categoryImages table
    const sql = 'INSERT INTO categoryImages (category_id, url) VALUES (?, ?)';
    db.query(sql, [category_id, url], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error creating category image',error });
        }
        const insertedId = result.insertId;
        return res.status(201).json({ message: 'Category image created successfully', id:insertedId });
    });
};


const getCategoryImageByCategoryId = (req ,res) => {
    categoryId = req.params.id;
    const sql = 'SELECT * FROM categoryImages WHERE category_id = ?'
    db.query(sql,[categoryId],(error, result) => {
        if(error){
            return res.status(500).json({ error: 'Error getting category image',error });
        }
        return res.json(result[0]);
    });
};


/*                                                                           */
//!                          RECEPTION-IMAGES CONTROLLER                    !//
/*                                                                           */

const createReceptionImage = (req, res) => {
    const url = req.body.url;

    const sql = "INSERT INTO receptionImage (url,display) VALUE (?,0)";
    db.query(sql, [url], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error creating reception image', error });
        }
        res.json(result);
    });
};


const getAllImagesUrl = (req,res) => {
    const sql = "SELECT * FROM receptionImage ORDER BY id DESC "

    db.query(sql , (error,result) => {
        if(error){
            return res.status(500).json({ error: 'Error getting reception image',error });
        };
        res.json(result);
    });
};


const updateReceptionImageDisplay = (req, res) => {
    const key = req.params.key;
    console.log(key)
    // Set all display values to 0
    const sqlResetAll = "UPDATE receptionImage SET display = 0";
    
    // Update a specific item's display value to 1 based on the key from req.body
    const sqlUpdateOne = "UPDATE receptionImage SET display = 1 WHERE url = ?";
    
    // Begin a transaction to ensure atomicity
    db.beginTransaction((error) => {
    if (error) {
        return res.status(500).json({ error: 'Error beginning transaction', error });
    }

    // First, reset all display values to 0
    db.query(sqlResetAll, (error) => {
        if (error) {
        return db.rollback(() => {
            res.status(500).json({ error: 'Error resetting display values', error });
        });
        }

        // Then, update the specific item's display value to 1
        db.query(sqlUpdateOne, [key], (error) => {
        if (error) {
            return db.rollback(() => {
            res.status(500).json({ error: 'Error updating display value', error });
            });
        }

        // Commit the transaction
        db.commit((error) => {
            if (error) {
            return db.rollback(() => {
                res.status(500).json({ error: 'Error committing transaction', error });
            });
            }

            res.json({ message: 'Display values updated successfully' });
        });
        });
    });
    });
};

const getImageWithDisplayValue = (req, res) => {
    const sql = "SELECT * FROM receptionImage WHERE display = 1 LIMIT 1";
    db.query(sql,(error, result)=>{
        if(error){
            return res.status(500).json({ error: 'Error getting reception image',error });
        };
        res.json(result);
    });
};

const deleteImageByKey = (req, res) => {
    const key = req.params.key;
    const sql = "DELETE FROM receptionImage WHERE url = ? "

    db.query(sql,[key],(error, result) => {
        if(error){
            return res.status(500).json({ error: 'Error deleting reception image',error });
        }
        res.json(result);
    })
}

/*                                                                           */
//!                            AWS S3-IMAGES CONTROLLER                     !//
/*                                                                           */
// controllers/imageController.js

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIA3NCJVRSPV266SVXX',
    secretAccessKey: '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'
    });

    const s3 = new AWS.S3();

    const uploadImageToS3 = (req, res) => {
        const imageKey = req.params.key;
        const imageFile = req.file.buffer; // Use req.file to access the uploaded image data
        console.log('Received request:', req.body); // Log the entire request body
        console.log('Received file:', req.file);
        console.log('Image Key:', imageKey);
        console.log('Image Buffer Length:', imageFile.length); // Corrected to access buffer length
        const params = {
            Bucket: 'diet-partner-images',
            Key: imageKey,
            Body: imageFile,
        };

        s3.putObject(params, (err, data) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'Image upload failed' });
            } else {
                console.log('Image uploaded successfully:', data);
                res.json({ message: 'ok', buffer: imageFile }); // Corrected to include buffer
            }
        });
    };
    



module.exports = {
    getAllProduct,
    getLastProducts,
    createProduct,
    updateProductStatus,
    updateProductDiscount,
    getProductByName,
    getProductById,
    getProductByPackId,
    getProductByCategoryId,
    deleteProduct,
    createBasket,
    getBasketById,
    updateBasketTotalAmount,
    deleteBasket,
    createBasketItem,
    getBasketItemsById,
    updateBasketItem,
    deleteBasketItem,
    createOrder,
    getOrderByReference,
    getAllOrders,
    deleteOrder,
    createCategory,
    getAllCategories,
    getCategoryByName,
    deleteCategory,
    createPack,
    getAllPacks,
    getLastPacks,
    getPackById,
    getPackByName,
    updatePackName,
    updatePackDiscount,
    updatePackStatus,
    deletePack,
    createProductImage,
    getProductImageByProductId,
    updateProductUrlImage,
    deleteProductImageByProductId,
    createPackImage,
    getPackImageByPackId,
    updatePackUrlImage,
    deletePackImage,
    createCategoryImage,
    getCategoryImageByCategoryId,
    createReceptionImage,
    getAllImagesUrl,
    getImageWithDisplayValue,
    updateReceptionImageDisplay,
    deleteImageByKey,
    uploadImageToS3,
    
};