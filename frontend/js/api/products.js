window.addEventListener('load',()=>{
    const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Token found, you can proceed with the admin page
  axios
    .get("http://localhost:4000/admin/authenticate", {
      responseType: "json",
      headers: {
        Authorization: `${token}`, // Include the token in the request headers
      },
    })
    .then((response) => {
      if (response.data.authenticated) {
        console.log("Authenticated", response.data);
      } else {
        console.log("Not Authenticated", response.data);
        window.location.href = "login.html";
      }
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
      window.location.href = "login.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const createProductForm = document.getElementById("createProductForm");
    const productCategorySelect = document.getElementById("productCategory");
    const productPackSelect = document.getElementById("productPack");

    // Fetch categories and populate the category select
    axios.get("http://localhost:4000/api/categories")
        .then((response) => {
            const categories = response.data;
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                productCategorySelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching categories:", error);
        });
    // Fetch packs and populate the pack select
    axios.get("http://localhost:4000/api/packs")
        .then((response) => {
            const packs = response.data;
            packs.forEach((pack) => {
                const option = document.createElement("option");
                option.value = pack.id;
                option.textContent = pack.name;
                productPackSelect.appendChild(option);

            });
        })
        .catch((error) => {
            console.error("Error fetching packs:", error);
        });
    createProductForm.addEventListener("submit",async function (event) {
        event.preventDefault();

        const productName = document.getElementById("productName").value;
        const productDescription = document.getElementById("productDescription").value;
        const productPrice = document.getElementById("productPrice").value;
        const productStatus = document.getElementById("productStatus").value;
        const productDiscount = document.getElementById("productDiscount").value;
        const productCategory = document.getElementById("productCategory").value;
        const productPack = document.getElementById("productPack").value;
        const packId = productPack === "null" ? null : parseInt(productPack);
        const imageType = document.getElementById("img-type").value;
        const imageFileInput = document.getElementById("img-file");
        const formData = new FormData();
        formData.append("file", imageFileInput.files[0]);
        if (!imageFileInput || !imageFileInput.files[0]) return alert('No file selected!');
        try {
            const productResponse = await axios.post("http://localhost:4000/api/products", {
                name: productName,
                description: productDescription,
                price: productPrice,
                status: productStatus,
                discount: productDiscount,
                categoryId: productCategory,
                packId: packId
            },{
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const productId = productResponse.data.productId;
            const imgKey = `product-image-${productId}.${imageType}`;

            const imageResponse = await axios.post(`http://localhost:4000/api/s3/upload/${imgKey}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });

            const productImageResponse = await axios.post("http://localhost:4000/api/productImages", {
            product_id: productId,
            imageUrl: imgKey,
            });
            console.log("product and image created successfully:", productResponse.data, imageResponse.data, productImageResponse.data);
            alert("product created successfully");
        } catch (error) {
            console.error("Error creating product or image:", error);
            alert("Error creating product");
        }    
    });
});
const getProductByName = document.getElementById("getProductByNameForm");
const productList = document.getElementById("productList");

getProductByName.addEventListener("submit", function(event) {
    event.preventDefault();
    const productName = document.getElementById("productNameInput").value;
    axios.get(`http://localhost:4000/api/products/${productName}`)
        .then((response)=>{
            console.log("Product by name",response.data);
            response.data.forEach(element => {
                displayProductData(element)
            });
            
        })
        .catch((error)=>{
            console.error('Error getting products:', error);
            alert("Error getting products");
        });
});
function displayProductData(product) {
    const productListItem = document.createElement("li");
    productListItem.dataset.productId = product.id;
    axios.get(`http://localhost:4000/api/productImages/${product.id}`)
    .then((response) => {
        productListItem.innerHTML = `<hr>
            <div class="card product-card justify-content-center">
                <img class="card-img"src="https://diet-partner-images.s3.amazonaws.com/test-image-3.png">
                <div class="card-body">
                    ${product.name}<br> ${product.price}DT<br> ${product.discount}%<br> ${product.status}
                    <br>
                    <br>
                    <button class="updateProductBtn btn btn-success">Update</button>
                    
                </div>
            </div>
        `;

        productList.appendChild(productListItem);
    })
    .catch((error) => {
        console.error('Error displaying product:', error);
    })
}

productList.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("updateProductBtn")) {
        const listItem = target.closest("li");
        const productId = listItem.dataset.productId;

        const updateStatusForm = document.createElement("form");
        updateStatusForm.innerHTML = `
        <br>
            <label for="newProductStatus">New Product Status:</label>
            <select id="newProductStatus" name="newProductStatus" required>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
            </select>
            <button class="btn btn-success" type="submit">Update Status</button>
            
            <br>
        `;

        updateStatusForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const newProductStatus = updateStatusForm.querySelector("#newProductStatus").value;

            axios.put(`http://localhost:4000/api/products/update-status/${productId}`, {
                status: newProductStatus
            })
            .then((response) => {
                console.log("Product status updated successfully:", response.data);
                alert("Product status updated successfully");
            })
            .catch((error) => {
                console.error("Error updating product status:", error);
                alert("Error updating product status");
            });
        });

        const updateDiscountForm = document.createElement("form");
        updateDiscountForm.innerHTML = `
        <br>
            <label for="newProductDiscount">New Product Discount:</label>
            <input type="number" step="1" id="newProductDiscount" required>
            <button class="btn btn-success" type="submit">Update Discount</button>
            <br>
        `;

        updateDiscountForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const newProductDiscount = updateDiscountForm.querySelector("#newProductDiscount").value;

            axios.put(`http://localhost:4000/api/products/update-discount/${productId}`, {
                discount: newProductDiscount
            })
            .then((response) => {
                console.log("Product discount updated successfully:", response.data);
                alert("Product discount updated successfully");
            })
            .catch((error) => {
                console.error("Error updating product discount:", error);
                alert("Error updating product discount");
            });
        });

        listItem.appendChild(updateStatusForm);
        listItem.appendChild(updateDiscountForm);
    }
});
