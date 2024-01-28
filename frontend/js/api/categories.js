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
  const createCategoryForm = document.getElementById("createCategoryForm");

  createCategoryForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const categoryName = document.getElementById("categoryName").value;
      const imageFileInput = document.getElementById("imageFile");
      const imageType = document.getElementById("imgType").value;
      const formData = new FormData();
      formData.append("image", imageFileInput.files[0]);
      if (!imageFileInput || !imageFileInput.files[0]) return alert('No file selected!');

      try {
          // Create the category without the image first
          const categoryResponse = await axios.post("http://localhost:4000/api/categories", {
              name: categoryName,
          });

          // Extract the category ID from the response
          const categoryId = categoryResponse.data.id;

          // Generate the image key
          const imgKey = `category-image-${categoryId}.${imageType}`;

          // Upload the image to Amazon S3
          const imageResponse = await axios.post(`http://localhost:4000/api/s3/upload/${imgKey}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });

          // Create a record for the image in your database
          const categoryImageResponse = await axios.post("http://localhost:4000/api/categoryImages/category-images", {
              category_id: categoryId,
              url: imgKey,
          });

          console.log("Category and image created successfully:", categoryResponse.data, imageResponse.data, categoryImageResponse.data);
          alert("Category created successfully");
      } catch (error) {
          console.error("Error creating category or image:", error.response);
          alert("Error creating category");
      }
  });
});
