
// API configuration
const USE_MOCK_API = true;

// Demo credentials for mock testing
const MOCK_EMAIL = "demo@crowinvoice.com";
const MOCK_PASSWORD = "Demo1234!";

// Simulate API response delay
const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  let result;

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    const text = await response.text();
    result = {
      success: response.ok,
      message: text || `Request failed (${response.status})`,
    };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      ...result,
    };
  }

  return result;
};

// Login API
export const loginUser = async (loginData) => {
  const { email, password, remember } = loginData;

  // Mock login
  if (USE_MOCK_API) {
    await delay(1000);

    if (!email || !password) {
      throw {
        status: 422,
        success: false,
        message: "Please check the submitted fields.",
        errors: {
          email: !email ? ["Email is required."] : [],
          password: !password ? ["Password is required."] : [],
        },
      };
    }

    if (
      email.toLowerCase() !== MOCK_EMAIL ||
      password !== MOCK_PASSWORD
    ) {
      throw {
        status: 401,
        success: false,
        message: "The email or password you entered is incorrect.",
        errors: {
          email: [
            "The email or password you entered is incorrect.",
          ],
        },
      };
    }

    return {
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: 101,
          name: "Demo User",
          email: MOCK_EMAIL,
        },
        authenticated: true,
        redirectTo: "/dashboard",
      },
    };
  }

  // Actual login API request
  const response = await fetch("/api/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      remember,
    }),
  });

  return await handleResponse(response);
};

// Register API
export const registerUser = async (userData) => {
  const {
    name,
    email,
    password,
    password_confirmation,
  } = userData;

  // Mock registration
  if (USE_MOCK_API) {
    await delay(1000);

    // Check required fields
    if (!name || !email || !password || !password_confirmation) {
      throw {
        status: 422,
        success: false,
        message: "Please check the submitted fields.",
        errors: {
          name: !name ? ["Name is required."] : [],
          email: !email ? ["Email is required."] : [],
          password: !password ? ["Password is required."] : [],
          password_confirmation: !password_confirmation
            ? ["Password confirmation is required."]
            : [],
        },
      };
    }

    // Validate name length
    if (name.trim().length > 100) {
      throw {
        status: 422,
        success: false,
        message: "Name must not exceed 100 characters.",
        errors: {
          name: ["Name must not exceed 100 characters."],
        },
      };
    }

    // Validate email
    if (email.length > 255) {
      throw {
        status: 422,
        success: false,
        message: "Email must not exceed 255 characters.",
        errors: {
          email: ["Email must not exceed 255 characters."],
        },
      };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      throw {
        status: 422,
        success: false,
        message: "Please enter a valid email address.",
        errors: {
          email: ["Please enter a valid email address."],
        },
      };
    }

    // Check duplicate email
    if (email.toLowerCase() === MOCK_EMAIL) {
      throw {
        status: 409,
        success: false,
        message: "An account with this email already exists.",
        errors: {
          email: ["This email address is already registered."],
        },
      };
    }

    // Validate password
    if (password.length < 8) {
      throw {
        status: 422,
        success: false,
        message: "Password must contain at least 8 characters.",
        errors: {
          password: [
            "Password must contain at least 8 characters.",
          ],
        },
      };
    }

    // Confirm password
    if (password !== password_confirmation) {
      throw {
        status: 422,
        success: false,
        message: "Passwords do not match.",
        errors: {
          password_confirmation: ["Passwords do not match."],
        },
      };
    }

    return {
      success: true,
      message: "Account created successfully.",
      data: {
        user: {
          id: 102,
          name,
          email,
        },
        authenticated: true,
        redirectTo: "/dashboard",
      },
    };
  }

  // Actual registration API request
  const response = await fetch("/api/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation,
    }),
  });

  return await handleResponse(response);
};

// Logout API
export const logoutUser = async () => {

  // Mock logout
  if (USE_MOCK_API) {
    await delay(500);

    return {
      success: true,
      message: "Logged out successfully.",
      redirectTo: "/login",
    };
  }

  // Actual logout API request
  const response = await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({}),
  });

  return await handleResponse(response);
};
