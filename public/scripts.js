document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("container");

  function clearContainer() {
    container.innerHTML = '';
  }

  function displayWelcomeMessage() {
    container.innerHTML = `
      <h1>Welcome to Pinggu World!</h1>
      <button id="showRegisterButton">Register</button>
      <button id="showLoginButton">Login</button>
    `;

    document.getElementById("showRegisterButton").addEventListener("click", showRegistrationForm);
    document.getElementById("showLoginButton").addEventListener("click", showLoginForm);
  }

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
        <button type="button" id="backButton">Back</button>
      </form>
    `;

    document.getElementById("backButton").addEventListener("click", displayWelcomeMessage);

    const registrationForm = document.getElementById("registrationForm");

    registrationForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      const formData = new FormData(registrationForm);
      const username = formData.get("username");
      const password = formData.get("password");
      const name = formData.get("name");
      const email = formData.get("email");

      try {
        const response = await fetch("http://localhost:5500/user", {
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
          showLoginForm();
        } else {
          const errorText = await response.text();
          console.error("Registration failed:", errorText);
          alert(`Registration failed: ${errorText}`);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert(`An error occurred during registration: ${error.message}`);
      }
    });
  }

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
        <button type="button" id="backButton">Back</button>
      </form>
    `;

    document.getElementById("backButton").addEventListener("click", displayWelcomeMessage);

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function(event) {
      event.preventDefault();

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
          const data = await response.json();
          localStorage.setItem("authToken", data.token);
          alert("Login successful!");

          showInterface(username, data.role);
        } else {
          const errorText = await response.text();
          console.error("Login failed:", errorText);
          alert(`Login failed: ${errorText}`);
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert(`An error occurred during login: ${error.message}`);
      }
    });
  }

  function showInterface(username, role) {
    clearContainer();
    container.innerHTML = `
      <h2>Welcome, ${username}!</h2>
      <button id="playButton">Play</button>
      <button id="settingButton">Setting</button>
    `;

    document.getElementById("settingButton").addEventListener("click", function() {
      showSettings(username, role);
    });
  }

  function showSettings(username, role) {
    clearContainer();
    container.innerHTML = `
      <h2>Settings</h2>
      <button id="updateInfoButton">Update Info</button>
      ${role === 'admin' ? '<button id="deleteAccountButton">Delete Account</button>' : ''}
      <button id="backButton">Back</button>
    `;

    document.getElementById("backButton").addEventListener("click", function() {
      showInterface(username, role);
    });

    document.getElementById("updateInfoButton").addEventListener("click", function() {
      showUpdateForm(username, role);
    });

    if (role === 'admin') {
      document.getElementById("deleteAccountButton").addEventListener("click", function() {
        showPasskeyForm(username, role);
      });
    }
  }

  function showUpdateForm(currentUsername, role) {
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
        <button type="button" id="backButton">Back</button>
      </form>
    `;

    document.getElementById("backButton").addEventListener("click", function() {
      showSettings(currentUsername, role);
    });

    const updateForm = document.getElementById("updateForm");

    updateForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      const formData = new FormData(updateForm);
      const updatedInfo = {
        username: formData.get("newUsername") || currentUsername,
        password: formData.get("newPassword")
      };

      try {
        const response = await fetch(`http://localhost:5500/updateUser`, {
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
          showSettings(updatedInfo.username || currentUsername, role);
        } else {
          const errorText = await response.text();
          console.error('Failed to update user information:', errorText);
          alert(`Failed to update user information: ${errorText}`);
        }
      } catch (error) {
        console.error('Error updating user information:', error);
        alert(`An error occurred while updating user information: ${error.message}`);
      }
    });
  }

  function showPasskeyForm(username, role) {
    clearContainer();
    container.innerHTML = `
      <h2>Enter Passkey</h2>
      <form id="passkeyForm">
        <div class="form-group">
          <label for="passkey">Passkey:</label>
          <input type="text" id="passkey" name="passkey" required>
        </div>
        <button type="submit">Submit</button>
        <button type="button" id="backButton">Back</button>
      </form>
    `;

    document.getElementById("backButton").addEventListener("click", function() {
      showSettings(username, role);
    });

    const passkeyForm = document.getElementById("passkeyForm");

    passkeyForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      const formData = new FormData(passkeyForm);
      const passkey = formData.get("passkey");

      try {
        const response = await fetch(`http://localhost:5500/requestDeleteToken`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ passkey })
        });

        if (response.ok) {
          const data = await response.json();
          showDeleteForm(username, role, data.token);
        } else {
          const errorText = await response.text();
          console.error("Passkey verification failed:", errorText);
          alert(`Passkey verification failed: ${errorText}`);
        }
      } catch (error) {
        console.error("Error verifying passkey:", error);
        alert(`An error occurred while verifying passkey: ${error.message}`);
      }
    });
  }

  function showDeleteForm(username, role, deleteToken) {
    clearContainer();
    container.innerHTML = `
      <h2>Delete Account</h2>
      <form id="deleteForm">
        <div class="form-group">
          <label for="deleteUsername">Enter Username to Delete:</label>
          <input type="text" id="deleteUsername" name="deleteUsername" required>
        </div>
        <div class="form-group">
          <label for="deleteToken">Enter Token:</label>
          <input type="text" id="deleteToken" name="deleteToken" required>
        </div>
        <button type="submit">Delete</button>
        <button type="button" id="backButton">Back</button>
      </form>
    `;

    document.getElementById("backButton").addEventListener("click", function() {
      showSettings(username, role);
    });

    const deleteForm = document.getElementById("deleteForm");

    deleteForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      const formData = new FormData(deleteForm);
      const deleteUsername = formData.get("deleteUsername");
      const token = formData.get("deleteToken");

      if (token !== deleteToken) {
        alert("Invalid token");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5500/deleteUser/${deleteUsername}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          console.log("User account deleted successfully");
          alert("User account deleted successfully");
          showSettings(username, role);
        } else {
          const errorText = await response.text();
          console.error("Failed to delete user account:", errorText);
          alert(`Failed to delete user account: ${errorText}`);
        }
      } catch (error) {
        console.error("Error deleting user account:", error);
        alert(`An error occurred while deleting user account: ${error.message}`);
      }
    });
  }

  displayWelcomeMessage();
});
