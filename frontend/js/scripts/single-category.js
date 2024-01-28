const createItem = (product) => {
    const itemDiv = document.createElement("div")
    itemDiv.classList.add("col-sm-4");
    itemDiv.innerHTML =`
        <div class="best_shoes">
            <p class="best_text">${product.data.name}</p>
            <div class="shoes_icon"><img src="https://diet-partner-images.s3.amazonaws.com/${product.url}"></div>
            <div class="star_text">
                <div class="left_part">
                    <ul>
                        <li><a href="details.html?id=${product.data.id}&isPack=0"><img src="images/button.jpg"></a></li>
                    </ul>
                </div>
                <div class="right_part">
                    <div class="shoes_price"><span style="color: #0015ff;">${parseInt(product.data.price - (product.data.price*product.data.discount)/100)}DT</span></div>
                </div>
            </div>
        </div>
    `;
    return itemDiv;
}
const loadItems = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    document.getElementById("category-name").textContent = `${urlParams.get('name')}`
    const container = document.getElementById("container")
    try {
        const response = await axios.get(`http://localhost:4000/api/products/get-by-category/${categoryId}`);
        const products = response.data 
        for(const product of products){
            const imageResponse = await axios.get(`http://localhost:4000/api/productImages/17`);
            const url = imageResponse.data.url;
            const item = createItem({
                url:url,
                data:product
            });
            container.appendChild(item)
        };
    } catch (error) {
        console.log(error)
    }

}
window.addEventListener('load',loadItems)