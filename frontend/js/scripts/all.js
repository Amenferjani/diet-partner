function createProductElement(product) {
    const productElement = document.createElement("div");
    productElement.classList.add("col-sm-4");
    const bestShoesDiv = document.createElement("div");
    bestShoesDiv.classList.add("best_shoes");
    const bestTextP = document.createElement("p");
    bestTextP.classList.add("best_text");
    bestTextP.textContent = product.name;
    const shoesIconDiv = document.createElement("div");
    shoesIconDiv.classList.add("shoes_icon");
    const img = document.createElement("img");
    img.src = `https://diet-partner-images.s3.amazonaws.com/${product.imageUrl}`;
    const starTextDiv = document.createElement("div");
    starTextDiv.classList.add("star_text");
    const leftPartDiv = document.createElement("div");
    leftPartDiv.classList.add("left_part");
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.dataset.productId = product.id;
    a.href = `details.html?id=${a.dataset.productId}&isPack=0`
    const imgButton = document.createElement("img");
    imgButton.src = "images/button.jpg";
    const rightPartDiv = document.createElement("div");
    rightPartDiv.classList.add("right_part");
    const shoesPriceDiv = document.createElement("div");
    shoesPriceDiv.classList.add("shoes_price");
    const priceWithoutDecimal = parseInt(product.price);

    const dtSpan = document.createElement("span");

    dtSpan.style.color = "#0015ff";
    dtSpan.textContent = `${priceWithoutDecimal} DT`;

    productElement.appendChild(bestShoesDiv);
    bestShoesDiv.appendChild(bestTextP);
    bestShoesDiv.appendChild(shoesIconDiv);
    shoesIconDiv.appendChild(img);
    bestShoesDiv.appendChild(starTextDiv);
    starTextDiv.appendChild(leftPartDiv);
    leftPartDiv.appendChild(ul);
    ul.appendChild(li);
    li.appendChild(a);
    a.appendChild(imgButton);
    starTextDiv.appendChild(rightPartDiv);
    rightPartDiv.appendChild(shoesPriceDiv);
    shoesPriceDiv.appendChild(dtSpan);

    return productElement;
}
async function loadProducts() {
    const container = document.getElementById("container");
    try {
        const response = await axios.get("http://localhost:4000/api/products");
        const products = response.data;
        for (const product of products) {
            // Fetch the product image URL from the product image API
            const imageResponse = await axios.get(`http://localhost:4000/api/productImages/17`);
            const imageUrl = imageResponse.data.url;
            let price ;
            if(product.discount!=0){
                price = (product.price-(product.price * product.discount)/100);
            }
            else{
                price = product.price ;
            }
            const productElement = createProductElement({
                id:product.id,
                name: product.name,
                imageUrl: imageUrl,
                price: price,
                
            });
            container.appendChild(productElement);
        }
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Call the loadProducts function when the page loads
window.addEventListener("load", loadProducts);