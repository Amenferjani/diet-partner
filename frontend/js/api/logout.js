window.addEventListener("load", () => {
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

document.getElementById("logout-button").addEventListener("click", () => {
  // Remove the token from local storage
  localStorage.removeItem("authToken");

  // Redirect to the login page or perform other actions upon successful logout
  window.location.href = "login.html";
});
