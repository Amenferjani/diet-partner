window.addEventListener('load',()=>{
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "login.html";
      return;
    }
    axios
      .get("http://localhost:4000/admin/authenticate", {
        responseType: "json",
        headers: {
          Authorization: `${token}`,
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
      const container = document.getElementById("container");
      axios.get("http://localhost:4000/api/receptionImages/")
      .then((response)=> {
        const images = response.data;
        images.forEach(image => {
            const item =loadImages({
              key:image.url,
              display:image.display
            });
            container.appendChild(item);
        });
      })
      .catch((error) => {
        console.log(error)
      })
  });
  
  const loadImages = (image) => {
    const imgContainer=document.createElement("div");
    imgContainer.classList="card col-sm-4 mt-3 ";
    imgContainer.innerHTML=`
        <div class:"card-body ">
            <img src="https://diet-partner-images.s3.amazonaws.com/${image.key}" 
              alt="" padding="0px" width='450px' height='300px'>
            <h5>${image.key}</h5>
            <h1 class="text-success">status: ${image.display}</h1>
            <button onclick="deleteImage('${image.key}')"
              class="btn btn-outline-danger mb-2">Delete</button>
        </div>
    `;
    return imgContainer;
  };

  const  deleteImage = (key) =>  {
    // Make an HTTP request to delete the image using Axios
    axios.delete(`http://localhost:4000/api/receptionImages/delete/${key}`)
            .then((response) => {
                alert(`Image deleted successfully`);
                location.reload();
            })
            .catch((error) => {
                alert(`Error deleting image `);
            });
}

  const displayImageByKey = (key) => {
    if (key === "") {
        return;
    } else {
        axios.put(`http://localhost:4000/api/receptionImages/${key}`)
            .then((response) => {
                alert("reception image updated successfully");
                location.reload();
            })
            .catch((error) => {
                console.log(error);
                alert("error while updating the reception image");
            });
    }
};
document.addEventListener("DOMContentLoaded", function () {
    const uploadImageForm = document.getElementById("uploadImageForm");
  
    uploadImageForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const imageFileInput = document.getElementById("imageFile");
      const imageType = document.getElementById("imgType").value;
      const formData = new FormData();
      formData.append("image", imageFileInput.files[0]);
      if (!imageFileInput || !imageFileInput.files[0]) return alert('No file selected!');
  
      try {
        // Generate a unique image key based on a timestamp
        const timestamp = Date.now(); // You can use a more sophisticated method for uniqueness
        const imgKey = `reception-image-${timestamp}.${imageType}`;
        console.log(imgKey)        // Upload the image to Amazon S3
        const imageResponse = await axios.post(`http://localhost:4000/api/s3/upload/${imgKey}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        // Store the image key in your database (receptionImages)
        const receptionImageResponse = await axios.post("http://localhost:4000/api/receptionImages", {
          url: imgKey,
        });
  
        console.log("Reception image created successfully:", imageResponse.data, receptionImageResponse.data);
        alert("Reception image created successfully");
        location.reload();
      } catch (error) {
        console.error("Error creating reception image:", error.response);
        alert("Error creating reception image");
      }
    });
    const imageKeyInput = document.getElementById("imageUrlInput");
    const changeDisplay = document.getElementById("change-display");

    changeDisplay.addEventListener("click", function () {
        displayImageByKey(imageKeyInput.value);
      });
});