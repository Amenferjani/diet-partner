const container = document.getElementById("container");
		const productsContainer = document.getElementById("products-container");
		const createPackItem2 = (pack) => {
			const itemDiv =document.createElement("div");
			itemDiv.classList.add("col-md-6")
			itemDiv.innerHTML=`
					<div class="about-img2">
    	    				<div class="shoes-img2"><img src="https://diet-partner-images.s3.amazonaws.com/${pack.image}"></div>
    	    				<p class="sport_text">${pack.name}</p>
    	    				<div class="dolar_text"><strong style="color: #001aff;">${pack.price}DT</strong></div>
    	    				<div class="star_icon">
    	    					
    	    				</div>
    	    		</div>
			`;
			return itemDiv;
		}
		const createPackItem1 = (pack) => {
			const itemDiv =document.createElement("div");
			itemDiv.classList.add("col-md-6")
			itemDiv.innerHTML=`
    	    			<div class="about-img">
    	    				<button class="new_bt">packs</button>
    	    				<div class="shoes-img"><img src="https://diet-partner-images.s3.amazonaws.com/${pack.image}"></div>
    	    				<p class="sport_text">${pack.name}</p>
    	    				<div class="dolar_text"><strong style="color: #001aff;">${pack.price}DT</strong></div>
    	    				<div class="star_icon">
    	    			</div>
			`;
			return itemDiv;
		}
		const createProduct = (product) => {
			const productDiv = document.createElement('div');
			productDiv.classList.add("col-sm-4");
			productDiv.innerHTML=`
				<div class="best_shoes">
					<p class="best_text">${product.name}</p>
					<div class="shoes_icon"><img src="https://diet-partner-images.s3.amazonaws.com/${product.url}"></div>
					<div class="star_text">
						<div class="left_part">
							<ul>
								<li><a href="#"><img src="images/button.jpg"></a></li>
							</ul>
						</div>
						<div class="right_part">
							<div class="shoes_price"><span style="color: #0015ff;">${product.price}DT</span></div>
						</div>
					</div>
				</div>
			`;
			return productDiv;
		};
		const loadPage = async() => {
			try {
				const response = await axios.get("http://localhost:4000/api/packs/get-last-two")
				const packs = response.data;
				
					const imageResponse = await axios.get("http://localhost:4000/api/packImages/19");
					const item1 = createPackItem1({
						image: imageResponse.data.url,
						name:packs[0].name,
						price: parseInt(packs[0].price-(packs[0].price*packs[0].discount)/100),
					});
					container.appendChild(item1);
					const item2 = createPackItem2({
						image: imageResponse.data.url,
						name:packs[1].name,
						price: parseInt(packs[1].price-(packs[1].price*packs[1].discount)/100),
					});
					container.appendChild(item2);
					const anchor = document.createElement("a")
					anchor.href ='pack.html'
					anchor.innerHTML =`<button class="see-more-btn" action="contact.html">Voir Plus</button>`
					container.appendChild(anchor)

					const productResponse = await axios.get("http://localhost:4000/api/products/get-last-three");
					const products = productResponse.data;
					for (const product of products){
						const ProductImageResponse = await axios.get("http://localhost:4000/api/productImages/17");
						const productItem = createProduct({
							name:product.name,
							price:parseInt(product.price-(product.price*product.discount)/100),
							url:ProductImageResponse.data.url,
						});
						productsContainer.appendChild(productItem);
					}
					const receptionImgDiv = document.getElementById("reception-img")
						const receptionImgResponse = await axios.get("http://localhost:4000/api/receptionImages/display");
						console.log('response:',receptionImgResponse.data);
						const receptionImg = document.createElement('img');
						receptionImg.src=`https://diet-partner-images.s3.amazonaws.com/${receptionImgResponse.data[0].url}`;
						receptionImgDiv.appendChild(receptionImg);
				} catch (error) {
					console.log(error)
			}
		}
		window.addEventListener("load",loadPage)