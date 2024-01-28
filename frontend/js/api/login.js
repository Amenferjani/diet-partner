document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Send a POST request to your server to validate the credentials
  axios
    .post("http://localhost:4000/api/admin/login", {
      username: username,
      password: password,
    })
    .then((response) => {
      // Handle success (e.g., store the token in local storage and redirect)
      const token = response.data.token; // Extract the token from the response
      localStorage.setItem("authToken", token); 
      console.log("login")
      window.location.href = "admin.html";
    })
    .catch((error) => {
      // Handle login failure (e.g., display an error message)
      console.error("Login failed:", error);
    });
});

