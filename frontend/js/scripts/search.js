// Get references to HTML elements
const searchInput = document.getElementById("search-input");
const container = document.getElementById("container");


    // Function to handle the search
    const performSearch = () => {
        // Get the search term from the input field
        const searchTerm = searchInput.value;
        container.innerHTML=``;
        // Make an AJAX request to fetch products based on the search term
        axios.get(`http://localhost:4000/api/products/get/${searchTerm}`)
            .then((response) => {
                const products = response.data;

                for (const product of products) {
                    const productDiv = document.createElement("div");
                    productDiv.classList.add("col-sm-4");

                    // Add product information to the created div
                    productDiv.innerHTML = `
                    <div class="best_shoes">
                    <p class="best_text">${product.name}</p>
                    <div class="shoes_icon"><img src="images/creatineop.png"></div>
                    <div class="star_text">
                        <div class="left_part">
                            <ul>
                                <li><a href="details.html?id=${product.id}&isPack=0"><img src="images/button.jpg"></a></li>
                            </ul>
                        </div>
                        <div class="right_part">
                            <div class="shoes_price"><span style="color: #0015ff;">${parseInt(product.price-(product.price*product.discount)/100)} DT</span></div>
                        </div>
                    </div>
                </div>
                    `;

                    // Append the product div to the container
                    container.appendChild(productDiv);
                }
            })
            .catch((error) => {
                console.error("Error fetching products", error);
            });
    };
    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });