const createCategoryItem = (category) => {
    const main_section = document.createElement("div");
    main_section.innerHTML = `
    <div class="racing_shoes">
            <div class="row">
                <div class="col-md-8">
                    <div class="shoes-img3"><img src=https://diet-partner-images.s3.amazonaws.com/${category.url}></div>
                </div>
                <div class="col-md-4">
                    <div class="sale_text"><strong>${category.name}<br><span style="color: #0a0506;">Disponible</span> <br>Chez Nous !!</strong></div>
                    <div class="number_text"><strong> <span style="color: #0a0506"></span></strong></div>
                    <button class="seemore"onclick="location.href='single-category.html?category=${category.id}&name=${category.name}'">Clicker ici</button>
                </div>
            </div>
        </div>
    `;
    return main_section;
};
async function loadCategories () {
    const container = document.getElementById("container");
    try {
        const response = await axios.get("http://localhost:4000/api/categories");
        const categories = response.data;
        for(const category of categories){
            const imageResponse = await axios.get("http://localhost:4000/api/categoryImages/24")
            const imageUrl = imageResponse.data.url;
            const categoryItem = createCategoryItem({
                id:category.id,
                name:category.name,
                url:imageUrl,
            });
            container.appendChild(categoryItem)
        };
    } catch (error) {
        console.log("error loading categories",error);
    }
};
window.addEventListener("load",loadCategories);