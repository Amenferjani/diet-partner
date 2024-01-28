
function addItemToBasketLocalStorage() {
    const basketItemCount = parseInt(localStorage.getItem('basketItemCount')) || 0;
    localStorage.setItem('basketItemCount', (basketItemCount + 1).toString());

    // Update the basket icon
    updateBasketItemCount();
};

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const isPack = urlParams.get('isPack');
  
  if (isPack === '0') {
    // Handle the case when it's not a pack
    axios.get(`http://localhost:4000/api/products/get-product/${productId}`)
      .then((response) => {
        const product = response.data[0];
        console.log(product);
        document.querySelector('.product-subtitle').textContent = product.status;
        document.querySelector('.product-title').textContent = product.name;
        document.querySelector('.product-text').textContent = product.description;
  
        const priceElement = document.querySelector('.price');
        const badgeElement = document.querySelector('.badge');
        const delElement = document.querySelector('.del');
  
        if (parseInt(product.discount) === 0) {
          priceElement.textContent = `${parseInt(product.price)}DT`;
          badgeElement.style.display = 'none';
          delElement.style.display = 'none';
        } else {
          priceElement.textContent = `${parseInt(product.price - ((product.price * product.discount) / 100))}DT`;
          badgeElement.textContent = `${parseInt(product.discount)}%`;
          delElement.textContent   = `${parseInt(product.price)}DT`;
        }
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
    axios.get(`http://localhost:4000/api/productImages/${17}`)
      .then((response) => {
        const imageUrl = response.data.url;
        document.querySelector('.img-cover').src = `https://diet-partner-images.s3.amazonaws.com/${imageUrl}`;
      })
      .catch((error) => {
        console.error('Error fetching product image URL:', error);
      });
  
    document.getElementById("add-to-basket").addEventListener("click", (event) => {
      
      event.preventDefault();
      // Function to create a new basket and store the ID in local storage
      function createBasket() {
        axios.post("http://localhost:4000/api/baskets")
          .then((response) => {
            const basketId = response.data.id;
            const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
  
            // Store the basket ID and expiration time in local storage
            localStorage.setItem("basketId", basketId);
            localStorage.setItem("basketExpiration", expirationTime);
  
            console.log("Basket created with ID:", basketId);
            addItemToBasket(productId);
          })
          .catch((error) => {
            console.error("Error creating basket:", error);
          });
      }
  
      // Function to add an item to the basket
      function addItemToBasket(productId) {
        const basketId = localStorage.getItem("basketId");
  
        if (!basketId) {
          console.error("Basket ID not found in local storage.");
          return;
        }
  
        axios.post("http://localhost:4000/api/basketItems", {
          basket_id: basketId,
          product_id: productId,
          isPack: 0,
          quantity: 1, // Assuming quantity is always 1
        })
          .then((response) => {
            console.log("Item added to basket.");
            addItemToBasketLocalStorage();
            document.getElementById("add-to-basket-button").classList.add("animate__animated", "animate__backOutRight");
          })
          .catch((error) => {
            console.error("Error adding item to basket:", error);
          });
      };
  
      // Check if a basket ID is stored in local storage
      const storedBasketId = localStorage.getItem("basketId");
  
      if (!storedBasketId) {
        createBasket();
  
      } else {
        addItemToBasket(productId);
      };
    });
  }else if (isPack === '1') {
    // Handle the case when it's a pack
    axios.get(`http://localhost:4000/api/packs/get-pack/${productId}`)
      .then((response) => {
        const pack = response.data[0];
        console.log(pack);
        // Display pack details using similar logic as above
        document.querySelector('.product-subtitle').textContent = pack.status;
        document.querySelector('.product-title').textContent = pack.name;
        document.querySelector('.product-text').textContent = pack.description;
  
        const priceElement = document.querySelector('.price');
        const badgeElement = document.querySelector('.badge');
        const delElement = document.querySelector('.del');
  
        // Customize the price, badge, and del elements for packs
        if (parseInt(pack.discount) === 0) {
          priceElement.textContent = `${parseInt(pack.price)}DT`;
          badgeElement.style.display = 'none';
          delElement.style.display = 'none';
        } else {
          priceElement.textContent = `${parseInt(pack.price - ((pack.price * pack.discount) / 100))}DT`;
          badgeElement.textContent = `${parseInt(pack.discount)}%`;
          delElement.textContent = `${parseInt(pack.price)}DT`;
        }
  
        // Add event listener to the "Add to Basket" button for packs
        document.getElementById("add-to-basket").addEventListener("click", (event) => {
          event.preventDefault();
          // Function to create a new basket and store the ID in local storage
          function createBasket() {
            axios.post("http://localhost:4000/api/baskets")
              .then((response) => {
                const basketId = response.data.id;
                const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
  
                // Store the basket ID and expiration time in local storage
                localStorage.setItem("basketId", basketId);
                localStorage.setItem("basketExpiration", expirationTime);
  
                console.log("Basket created with ID:", basketId);
                addItemToBasket(productId);
              })
              .catch((error) => {
                console.error("Error creating basket:", error);
              });
          }
  
          // Function to add a pack to the basket
          function addItemToBasket(productId) {
            const basketId = localStorage.getItem("basketId");
  
            if (!basketId) {
              console.error("Basket ID not found in local storage.");
              return;
            }
            axios.post("http://localhost:4000/api/basketItems", {
              basket_id: basketId,
              product_id: productId,
              isPack: 1, // Assuming isPack is set to 1 for packs
              quantity: 1, // Assuming quantity is always 1
            })
            .then((response) => {
              console.log("Pack added to the basket.");
              document.getElementById("add-to-basket-button").classList.add("animate__animated", "animate__backOutRight");
            })
            .catch((error) => {
              console.error("Error adding pack to the basket:", error);
            });
          }
  
          // Check if a basket ID is stored in local storage
          const storedBasketId = localStorage.getItem("basketId");
  
          if (!storedBasketId) {
            createBasket();
          } else {
            addItemToBasket(productId);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching pack details:', error);
      });
  
    // Fetch and display the pack image from the packImages table.
    axios.get(`http://localhost:4000/api/packImages/13`)
      .then((response) => {
        const imageUrl = response.data.url;
        document.querySelector('.img-cover').src = `https://diet-partner-images.s3.amazonaws.com/${imageUrl}`;
      })
      .catch((error) => {
        console.error('Error fetching pack image URL:', error);
      });
  }
  window.addEventListener('load',updateBasketItemCount);