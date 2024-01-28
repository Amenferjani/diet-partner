const passOrder = (basketId) => {
            
    const lastName = document.getElementById("last-name").value
    const firstName = document.getElementById("first-name").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const phoneNumber = document.getElementById("phone-num").value
    
    axios.post(`http://localhost:4000/api/orders`,{
        basket_id:basketId,
        firstname:firstName,
        lastname:lastName,
        address:address,
        city:city,
        phone_number:phoneNumber,
    })
    .then((response) => {
        localStorage.removeItem('basketId');
        window.location=`orderSuccess.html?reference=${response.data.reference}`;
    })
    .catch((error)=>{
        window.location='error.html';
    });
};
const checkFields = () => {
        var fields = document.querySelectorAll('input[type="text"]');
        var isEmpty = false;
    
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].value.trim() === '') {
                isEmpty = true;
                break;
            }
        }
        const storedBasketId = localStorage.getItem('basketId');
        const emptyForm = document.getElementById("empty-form")
        if (storedBasketId){
            
            if (isEmpty) {
                
                emptyForm.textContent = "Veuillez remplir tous les champs"
            } else {
                passOrder(storedBasketId);
            }
        }else{
            emptyForm.textContent = "Veuillez ajouter des produits ou des packs"
        }

    }
const displayBasket = async () => {
    const basketItemsContainer = document.querySelector('.basket__items');

    // Get the basket ID from local storage
    const storedBasketId = localStorage.getItem('basketId');

    if (storedBasketId) {
        // Make a GET request to fetch basket items
        axios.get(`http://localhost:4000/api/basketItems/${storedBasketId}`)
            .then((response) => {
                const basketItems = response.data;
                

                basketItems.forEach((item) => {
                    if (item.isPack === 1) {
                        // Make a GET request to fetch pack details
                        axios.get(`http://localhost:4000/api/packs/get-pack/${item.packid}`)
                            .then((packResponse) => {
                                const pack = packResponse.data[0];
                                if (pack) {
                                    
                            // Create elements to display pack information
                            const packDiv = document.createElement('div');
                            packDiv.classList.add('card-body', 'pt-0');

                            // Build the HTML structure for a pack
                            packDiv.innerHTML = `
                                <div class="row justify-content-between">
                                    <div class="col-auto col-md-7">
                                        <div class="media flex-column flex-sm-row">
                                            <div class="media-body my-auto">
                                                <div class="row d-flex">
                                                    <div class="col-auto">
                                                        <p class="mb-0"><b>${pack.name}</b></p>
                                                        <small class="text-muted"></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <p><b>${calculateDiscountedPrice(pack.price, pack.discount)}DT</b></p>
                                    </div>
                                    <div class="col-auto">
                                        <button class="btn btn-outline-danger delete-product" data-basket-item-id="${item.id}">
                                            <i class="fas fa-trash-alt text-dark fa-lg"></i>
                                        </button>
                                    </div>
                                </div>
                                <hr class="my-2">
                            `;

                            basketItemsContainer.appendChild(packDiv);
                                }
                            })
                            .catch((packError) => {
                                console.error('Error fetching pack details:', packError);
                                // Handle the error, e.g., display an error message to the user
                            });
                    } else {
                        // Make a GET request to fetch product details
                        axios.get(`http://localhost:4000/api/products/get-product/${item.product_id}`)
                            .then((productResponse) => {
                                const product = productResponse.data[0];
                                if (product) {
                                    
                            const productDiv = document.createElement('div');
                            productDiv.classList.add('card-body', 'pt-0');

                            // Build the HTML structure for a product
                            productDiv.innerHTML = `
                                <div class="row justify-content-between">
                                    <div class="col-auto col-md-7">
                                        <div class="media flex-column flex-sm-row">
                                            <div class="media-body my-auto">
                                                <div class="row d-flex">
                                                    <div class="col-auto">
                                                        <p class="mb-0"><b>${product.name}</b></p>
                                                        <small class="text-muted"></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <p><b>${calculateDiscountedPrice(product.price, product.discount)}DT</b></p>
                                    </div>
                                    <div class="col-auto">
                                        <button class="btn btn-outline-danger delete-product" data-basket-item-id="${item.id}">
                                            <i class="fas fa-trash-alt text-dark fa-lg"></i>
                                        </button>
                                    </div>
                                </div>
                                <hr class="my-2">
                            `;

                            basketItemsContainer.appendChild(productDiv);
                                } else {
                                    console.error('Product details not found for product ID:', item.product_id);
                                    // Handle the case where product details are not found
                                }
                            })
                            .catch((productError) => {
                                console.error('Error fetching product details:', productError);
                            });
                    }
                });
                
                
            })
            .catch((error) => {
                console.error('Error fetching basket items:', error);
            });
    }
};

const calculateDiscountedPrice = (price, discount) => {
    if (discount === 0) {
        return `${parseInt(price)}`;
    }
    const discountedPrice = price - (price * discount) / 100;
    return parseInt(discountedPrice)
};

window.addEventListener('DOMContentLoaded', () => {
    displayBasket();
    
    const basketItemsContainer = document.querySelector('.basket__items');
    

    basketItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-product')) {
            event.preventDefault();

            const basketItemId = event.target.dataset.basketItemId;

            axios.delete(`http://localhost:4000/api/basketItems/${basketItemId}`)
                .then((response) => {
                    const basketItemCount = parseInt(localStorage.getItem('basketItemCount')) || 0;
                    if (basketItemCount > 0) {
                        localStorage.setItem('basketItemCount', (basketItemCount - 1).toString());
                    }
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error deleting basket item:', error);
                });
        };
    });
});