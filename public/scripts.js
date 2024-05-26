document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("container");

  // Function to clear the container
  function clearContainer() {
    container.innerHTML = '';
  }

  // Function to display welcome message with Register and Login buttons
  function displayWelcomeMessage() {
    container.innerHTML = `
      <h1>Welcome to Pinggu World!</h1>
      <button id="showRegisterButton">Register</button>
      <button id="showLoginButton">Login</button>
    `;

    document.getElementById("showRegisterButton").addEventListener("click", showRegistrationForm);
    document.getElementById("showLoginButton").addEventListener("click", showLoginForm);
  }

  // Function to show registration form
  function showRegistrationForm() {
    clearContainer();
    container.innerHTML = `
      <h2>Registration Form</h2>
      <form id="registrationForm">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <button type="submit">Register</button>
      </form>
    `;

    const registrationForm = document.getElementById("registrationForm");

    registrationForm.addEventListener("submit", async function(event) {
      event.preventDefault(); // Prevent form submission

      const formData = new FormData(registrationForm);
      const username = formData.get("username");
      const password = formData.get("password");
      const name = formData.get("name");
      const email = formData.get("email");

      try {
        const response = await fetch("http://localhost:5500/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: password,
            name: name,
            email: email
          })
        });
        if (response.ok) {
          // Registration successful, redirect to login form
          showLoginForm();
        } else {
          console.error("Registration failed");
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration. Please try again later.");
      }
    });
  }

  // Function to show login form
  function showLoginForm() {
    clearContainer();
    container.innerHTML = `
      <h2>Login Form</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="loginUsername" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="loginPassword" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
    `;

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function(event) {
      event.preventDefault(); // Prevent form submission

      const formData = new FormData(loginForm);
      const username = formData.get("username");
      const password = formData.get("password");

      try {
        const response = await fetch("http://localhost:5500/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });
        if (response.ok) {
          // Login successful, show interface with play and setting buttons
          showInterface(username);
        } else {
          const errorText = await response.text();
          console.error("Login failed:", errorText);
          alert(errorText);
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again later.");
      }
    });
  }

  // Function to show interface with play and setting buttons
  function showInterface(username) {
    clearContainer();
    container.innerHTML = `
      <h2>Welcome, ${username}!</h2>
      <button id="playButton">Play</button>
      <button id="settingButton">Setting</button>
    `;

    document.getElementById("settingButton").addEventListener("click", function() {
      clearContainer();
      container.innerHTML = `
        <h2>Settings</h2>
        <button id="updateInfoButton">Update Info</button>
        <button id="deleteAccountButton">Delete Account</button>
      `;

      document.getElementById("updateInfoButton").addEventListener("click", function() {
        showUpdateForm(username);
      });

      document.getElementById("deleteAccountButton").addEventListener("click", function() {
        deleteAccount(username);
      });
    });
  }

  // Function to show update form
  function showUpdateForm(currentUsername) {
    clearContainer();
    container.innerHTML = `
      <h2>Update Info</h2>
      <form id="updateForm">
        <div class="form-group">
          <label for="newUsername">New Username:</label>
          <input type="text" id="newUsername" name="newUsername">
        </div>
        <div class="form-group">
          <label for="newPassword">New Password:</label>
          <input type="password" id="newPassword" name="newPassword">
        </div>
        <button type="submit">Update</button>
      </form>
    `;

    const updateForm = document.getElementById("updateForm");

    updateForm.addEventListener("submit", async function(event) {
      event.preventDefault(); // Prevent form submission

      const formData = new FormData(updateForm);
      const updatedInfo = {
        username: formData.get("newUsername") || currentUsername,
        password: formData.get("newPassword")
      };

      try {
        const response = await fetch('http://localhost:5500/updateUser', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentUsername: currentUsername,
            updatedInfo: updatedInfo
          })
        });
        if (response.ok) {
          console.log('User information updated successfully');
          alert('User information updated successfully');
          showInterface(updatedInfo.username); // Update the interface with the new username
        } else {
          const errorText = await response.text();
          console.error('Failed to update user information:', errorText);
          alert('Failed to update user information. Please try again.');
        }
      } catch (error) {
        console.error('Error updating user information:', error);
        alert('An error occurred while updating user information. Please try again later.');
      }
    });
  }

  // Function to delete account
  async function deleteAccount(username) {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5500/deleteUser/${username}`, {
        method: "DELETE"
      });
      if (response.ok) {
        console.log("User account deleted successfully");
        alert("User account deleted successfully");
        displayWelcomeMessage();
      } else {
        const errorText = await response.text();
        console.error("Failed to delete user account:", errorText);
        alert("Failed to delete user account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      alert("An error occurred while deleting user account. Please try again later.");
    }
  }

  displayWelcomeMessage();
});
