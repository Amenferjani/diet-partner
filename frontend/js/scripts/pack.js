function createPackElement(pack, productNames, imageUrl) {
    const packElement = document.createElement('div');
    packElement.classList.add('collectipn_section_3', 'layuot_padding');
    packElement.dataset.packId = pack.id; // Set the pack ID as a dataset

    // Create elements for the pack structure
    const container = document.createElement('div');
    container.classList.add('container');
    const racingShoes = document.createElement('div');
    racingShoes.classList.add('racing_shoes');
    const row = document.createElement('div');
    row.classList.add('row');
    const colMd8 = document.createElement('div');
    colMd8.classList.add('col-md-8');
    const shoesImg = document.createElement('div');
    shoesImg.classList.add('shoes-img3');
    const img = document.createElement('img');
    img.src = `https://diet-partner-images.s3.amazonaws.com/${imageUrl}`;
    const colMd4 = document.createElement('div');
    colMd4.classList.add('col-md-4');
    const saleText = document.createElement('div');
    saleText.classList.add('sale_text');
    const strong = document.createElement('strong');
    strong.textContent = `${pack.name}\n`;
    const span = document.createElement('span');
    span.style.color = '#0a0506';
    span.textContent = 'Pack !!';
    const p = document.createElement('p');
    p.textContent = productNames;
    const numberText = document.createElement('div');
    numberText.classList.add('number_text');
    const button = document.createElement('button');
    button.classList.add('seemore');
    button.dataset.packId = pack.id;
    button.dataset.isPack = '1';
    button.textContent = 'View Details';

    // Build the structure
    numberText.appendChild(strong);
    strong.appendChild(span);
    strong.appendChild(document.createElement('br'));
    strong.appendChild(p);

    shoesImg.appendChild(img);
    colMd8.appendChild(shoesImg);

    colMd4.appendChild(saleText);
    colMd4.appendChild(numberText);
    colMd4.appendChild(button);

    row.appendChild(colMd8);
    row.appendChild(colMd4);

    racingShoes.appendChild(row);
    container.appendChild(racingShoes);

    packElement.appendChild(container);

    return packElement;
  }

  // Function to fetch and display packs
  async function displayPacks() {
    try {
      // Fetch packs from the API
      const packsResponse = await axios.get('http://localhost:4000/api/packs');

      // Filter packs with status "active"
      const activePacks = packsResponse.data.filter((pack) => pack.status === 'active');

      // Get the container element where packs will be displayed
      const packContainer = document.getElementById('pack-container');

      // Iterate through active packs and display them
      for (const pack of activePacks) {
        // Fetch products for the current pack
        const productsResponse = await axios.get(`http://localhost:4000/api/products/get-by-pack/${pack.id}`);

        // Fetch pack images for the current pack
        const packImagesResponse = await axios.get(`http://localhost:4000/api/packImages/13`);

        // Extract the product names from the productsResponse
        const productNames = productsResponse.data.map((product) => product.name).join(', ');

        // Create a new pack element and append it to the container
        const packElement = createPackElement(pack, productNames, packImagesResponse.data.url);
        packContainer.appendChild(packElement);
      }

      // Add event listeners to the "View Details" buttons
      const viewDetailsButtons = document.querySelectorAll('.seemore');
      viewDetailsButtons.forEach((button) => {
        button.addEventListener('click', redirectToDetailsPage);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Function to redirect to the details page
  function redirectToDetailsPage(event) {
    const packId = event.target.dataset.packId;
    const isPack = event.target.dataset.isPack;

    // Construct the URL for the details page with pack ID and isPack flag
    const url = `details.html?id=${packId}&isPack=${isPack}`;

    // Redirect to the details page
    window.location.href = url;
  }

  // Call the displayPacks function to fetch and display packs
  displayPacks();