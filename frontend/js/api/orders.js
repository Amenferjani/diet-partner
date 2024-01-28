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

document.addEventListener("DOMContentLoaded", function (){
    const ordersList = document.getElementById("ordersList");

    axios.get("http://localhost:4000/api/orders")
        .then((response) => {
            const orders = response.data;
            orders.forEach(order => {
                const orderListItem = document.createElement("li");
                
                orderListItem.innerHTML = `
                    ${dateFormatter(order.order_date)}<br>
                    Reference: ${order.reference}<hr>
                `;
    
                ordersList.appendChild(orderListItem);
            });
        })
        .catch((error) => {
            console.error('Error getting orders:', error);
            alert("Error getting orders");
        });
    
});
const getOrdersForm = document.getElementById("getOrderForm");
const deleteOrdersForm = document.getElementById("deleteOrderForm");
const orderSearchList = document.getElementById("searchOrdersList");

getOrdersForm.addEventListener("submit",function (event) {
    event.preventDefault();
    const orderReference = document.getElementById("orderReferenceToGet").value;
    console.log(orderReference)
    axios.get(`http://localhost:4000/api/orders/${orderReference}`)
    .then((response) => {
        console.log("Order by reference",response.data);
            displaySearchOrders(response.data);
    })
    .catch((error) => {
        console.error('Error getting order:', error);
        alert("404")
    });
});
const displaySearchOrders = (order) => {
  const orderListItem = document.createElement("li");

  // Fetch all basket items for the given basket_id
  axios.get(`http://localhost:4000/api/basketItems/${order.basket_id}`)
      .then((response) => {
          const basketItems = response.data;
          const itemListContainer = document.createElement("ul");
          var totalAmount = 0 ;
          document.getElementById("amount")
          basketItems.forEach((item) => {
              if (item.isPack === 1) {
                  // Item is a pack, fetch pack details
                  axios.get(`http://localhost:4000/api/packs/get-pack/${item.packid}`)
                      .then((packResponse) => {
                          const pack = packResponse.data[0];
                          totalAmount+=calculateDiscountedPrice(pack.price,pack.discount);
                          document.getElementById("amount").textContent = `total amount : ${totalAmount} DT`
                          const itemListItem = document.createElement("li");
                          itemListItem.innerHTML = `${pack.name}: ${item.quantity}, Pack, ${pack.status},
                            ${calculateDiscountedPrice(pack.price,pack.discount)} DT`;
                          itemListContainer.appendChild(itemListItem);
                      })
                      .catch((packError) => {
                          console.error('Error fetching pack details', packError);
                      });
              } else {
                  // Item is a product, fetch product details
                  axios.get(`http://localhost:4000/api/products/get-product/${item.product_id}`)
                      .then((productResponse) => {
                          const product = productResponse.data[0];
                          totalAmount+=calculateDiscountedPrice(product.price,product.discount);
                          document.getElementById("amount").textContent = `total amount : ${totalAmount} DT`
                          const itemListItem = document.createElement("li");
                          itemListItem.innerHTML = `${product.name}: ${item.quantity},
                            Product, ${product.status}, ${calculateDiscountedPrice(product.price,product.discount)} DT`;
                          itemListContainer.appendChild(itemListItem);
                      })
                      .catch((productError) => {
                          console.error('Error fetching product details', productError);
                      });
              }
          });
          
          orderListItem.innerHTML = `
              ${order.lastname} ${order.firstname}<br>
              ${order.address} ${order.city}<br>
              ${order.phone_number}<br>
              ${dateFormatter(order.order_date)}<br>
              
              Reference: ${order.reference}<br>
              <h5 id="amount"></h5>
          `;
          orderListItem.appendChild(itemListContainer);
          // Append the orderListItem to your orderSearchList container
          orderSearchList.appendChild(orderListItem);
      })
      .catch((error) => {
          console.error("Error fetching basket items", error);
      });
};

const calculateDiscountedPrice = (price, discount) => {
  if (discount === 0) {
      return `${parseInt(price)}`;
  }
  const discountedPrice = price - (price * discount) / 100;
  return parseInt(discountedPrice)
};
deleteOrdersForm.addEventListener("submit",function(event) {
    event.preventDefault();
    const orderReferenceToDelete = document.getElementById("orderReferenceToDelete").value;
    console.log(orderReferenceToDelete);
    axios.delete(`http://localhost:4000/api/orders/${orderReferenceToDelete}`)
    .then((response) => {
        console.log("Product deleted successfully:", response.data);
        alert("order deleted")
    })
    
    
    .catch((error) => {
        console.error('Error deleting order', error);
        alert("Error deleting order")
    })
})

const dateFormatter = (isoDate) =>{
    const date = new Date(isoDate);

    const year = date.getFullYear(); // Get the year (e.g., 2023)
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (01-12)
    const day = date.getDate().toString().padStart(2, '0'); // Get the day (01-31)
    const hour = date.getHours().toString().padStart(2, '0'); // Get the hour (00-23)
    const minute = date.getMinutes().toString().padStart(2, '0'); // Get the minute (00-59)
    
    return (` ${hour}:${minute} / ${year}-${month}-${day} `);
}