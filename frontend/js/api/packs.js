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
    // Create Pack Form
    const createPackForm = document.getElementById("createPackForm");

    createPackForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const newPackName = document.getElementById("newPackName").value;
        const newPackPrice = document.getElementById("newPackPrice").value;
        const newPackDiscount = document.getElementById("newPackDiscount").value;
        const imageType = document.getElementById("img-type").value;
        const imageFileInput = document.getElementById("img-file");
        const formData = new FormData();
        formData.append("name", newPackName);
        formData.append("price", newPackPrice);
        formData.append("discount", newPackDiscount);
        formData.append("imageType", imageType);
        formData.append("image", imageFileInput.files[0]);

        try {
            const packResponse = await axios.post("http://localhost:4000/api/packs",{
                name:newPackName,
                price:newPackPrice,
                discount:newPackDiscount
            });
            const packId = packResponse.data.packId;
            const imgKey = `pack-image-${packId}.${imageType}`;

            const imageResponse = await axios.post(`http://localhost:4000/api/s3/upload/${imgKey}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });
        
            const imageUrl = `https://diet-partner-images.s3.amazonaws.com/${imgKey}`;
        
            const packImageResponse = await axios.post("http://localhost:4000/api/packImages", {
            pack_id: packId,
            imageUrl: imgKey,
            });
        
            console.log("Pack and image created successfully:", packResponse.data, imageResponse.data, packImageResponse.data);
            alert("Pack created successfully");
        } catch (error) {
            console.error("Error creating pack or image:", error);
            alert("Error creating pack");
        }
    });
    
});

const getPackByNameForm = document.getElementById("getPackByNameForm");
const packList = document.getElementById("packList"); // Add this to your HTML where you want to display the pack data

getPackByNameForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const packName = document.getElementById("packName").value;
    axios.get(`http://localhost:4000/api/packs/${packName}`)
        .then((response) => {
            console.log("Pack by name:", response.data);

            displayPackData(response.data); // Call the function to display the pack data
        })
        .catch((error) => {
            console.error("Error getting pack by name:", error);
            alert("Error getting pack by name")
        });
});

// Function to display pack data in <li> elements
function displayPackData(pack) {
    const packListItem = document.createElement("li");
    packListItem.dataset.packId = pack.id; // Store the pack's ID as a data attribute
    axios.get(`http://localhost:4000/api/packImages/${pack.id}`)
    .then((response) =>{
        
        packListItem.innerHTML = `<hr>
            <div class="card pack-card justify-content-center mt-4">
                <img class="card-img"src="https://diet-partner-images.s3.amazonaws.com/${response.data.url} ">
                <div class="card-body">
                    ${pack.name}<br> ${pack.price}DT<br> ${pack.discount}%<br>${pack.status}
                    <br>
                    <button class="updatePackBtn btn btn-success">Update</button>
                </div>
            </div>
        `;
        packList.appendChild(packListItem);
    })
    .catch((error)=>{
        console.error('Error displaying pack:', error);
    })
}


packList.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("updatePackBtn")) {
        const listItem = target.closest("li");
        const packId = listItem.dataset.packId;

        const updateNameForm = document.createElement("form");
        updateNameForm.innerHTML = `
        <br>
            
            <label for="newPackName">New Pack Name:</label>
            <input type="text" id="newPackName" name="newPackName" required>
            <button class="btn btn-success"  type="submit">Update Name</button>
            
            <br>
        `;

        updateNameForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const newPackName = updateNameForm.querySelector("#newPackName").value;

            axios.put(`http://localhost:4000/api/packs/update-name/${packId}`, {
                name: newPackName
            })
            .then((response) => {
                console.log("Pack name updated successfully:", response.data);
                alert("Pack name updated successfully")
            })
            .catch((error) => {
                console.error("Error updating pack name:", error);
                alert("Error updating pack name")
            });
        });

        const updateDiscountForm = document.createElement("form");
        updateDiscountForm.innerHTML = `
        <br>
            <label for="newPackDiscount">New Pack Discount:</label>
            <input type="number" id="newPackDiscount" name="newPackDiscount" required>
            <button  class= "btn btn-success"type="submit">Update Discount</button>
        `;

        updateDiscountForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const newPackDiscount = updateDiscountForm.querySelector("#newPackDiscount").value;

            axios.put(`http://localhost:4000/api/packs/update-discount/${packId}`, {
                discount: newPackDiscount
            })
            .then((response) => {
                console.log("Pack discount updated successfully:", response.data);
                alert("Pack discount updated successfully")
            })
            .catch((error) => {
                console.error("Error updating pack discount:", error);
                alert("Error updating pack discount")
            });
        });
        const updateStatusForm = document.createElement("form");
        updateStatusForm.innerHTML = `
        <br>
        <label for="newPackStatus">New Pack Status:</label>
        <select id="newPackStatus" name="newPackStatus">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
        <button class="btn btn-success" type="submit">Update Status</button>
        `;

        updateStatusForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const newPackStatus = updateStatusForm.querySelector("#newPackStatus").value;

            axios.put(`http://localhost:4000/api/packs/update-status/${packId}`, {
                status: newPackStatus
            })
            .then((response) => {
                console.log("Pack status updated successfully:", response.data);
                alert("Pack status updated successfully");
            })
            .catch((error) => {
                console.error("Error updating pack status:", error);
                alert("Error updating pack status");
            });
        });

        listItem.appendChild(updateStatusForm);
        listItem.appendChild(updateNameForm);
        listItem.appendChild(updateDiscountForm);
    // }  else if (target.classList.contains("deletePackBtn")) {
    //     const listItem = target.closest("li");
    //     const packId = listItem.dataset.packId;

    //     axios.delete(`http://localhost:4000/api/packs/${packId}`)
    //         .then((response) => {
    //             console.log("Pack deleted successfully:", response.data);
    //             alert("Pack deleted successfully")
    //             packList.removeChild(listItem);
    //         })
    //         .catch((error) => {
    //             console.error("Error deleting pack:", error);
    //             alert("Error while deleting pack")
    //         });
    }
});


