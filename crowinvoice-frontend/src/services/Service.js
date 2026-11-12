

const API_BASE_URL = "/backend";

// ======================================
// COMMON ERROR HANDLER
// ======================================

const createError = (status, message, errors = {}) => ({
  status,
  message,
  errors,
});

// ======================================
// GET XSRF COOKIE
// ======================================

const getXsrfCookie = () => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="));

  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.split("=").slice(1).join("="));
  } catch {
    return cookie.split("=").slice(1).join("=");
  }
};

// ======================================
// GET LARAVEL CSRF TOKEN
// ======================================

const getCsrfToken = async (pagePath = "/login") => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${pagePath}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "text/html",
      },
    });
  } catch {
    throw createError(0, "Unable to connect to the server.");
  }

  const html = await response.text();

  const doc = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  // Try hidden input token
  const hiddenToken = doc.querySelector(
    'input[name="_token"]'
  )?.value;

  // Try Laravel CSRF meta tag
  const metaToken = doc.querySelector(
    'meta[name="csrf-token"]'
  )?.content;

  // Try XSRF cookie
  const cookieToken = getXsrfCookie();

  const token = hiddenToken || metaToken || cookieToken;

  console.log("CSRF Debug:", {
    status: response.status,
    url: response.url,
    redirected: response.redirected,
    hiddenTokenFound: Boolean(hiddenToken),
    metaTokenFound: Boolean(metaToken),
    cookieTokenFound: Boolean(cookieToken),
    tokenFound: Boolean(token),
  });

  if (!response.ok) {
    throw createError(
      response.status,
      "Unable to load authentication page."
    );
  }

  if (!token) {
    throw createError(
      419,
      "CSRF token not found. Please check the Laravel session."
    );
  }

  return token;
};

// ======================================
// SEND LARAVEL FORM REQUEST
// ======================================

const sendFormRequest = async (path, formData) => {
  let response;

  const cookieToken = getXsrfCookie();
  const formToken = formData.get("_token");

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html",

        ...(formToken
          ? { "X-CSRF-TOKEN": formToken }
          : {}),

        ...(cookieToken
          ? { "X-XSRF-TOKEN": cookieToken }
          : {}),
      },

      body: formData.toString(),
    });
  } catch {
    throw createError(0, "Unable to connect to the server.");
  }

  const responseText = await response.text();

  const finalUrl = new URL(response.url);

  const finalPath =
    finalUrl.pathname.replace(/\/$/, "") || "/";

  console.log("Authentication Response:", {
    status: response.status,
    redirected: response.redirected,
    finalPath,
    contentType: response.headers.get("content-type"),
  });

  return {
    response,
    responseText,
    finalPath,
  };
};

// ======================================
// LOGIN USER
// ======================================

export const loginUser = async (loginData) => {
  const { email, password, remember } = loginData;

  if (!email?.trim() || !password) {
    throw createError(
      422,
      "Email and password are required."
    );
  }

  try {
    // Get CSRF token
    const token = await getCsrfToken("/login");

    // Prepare form data
    const formData = new URLSearchParams();

    formData.append("_token", token);
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append("remember", remember ? "1" : "0");

    // Send login request
    const result = await sendFormRequest("/login", formData);

    const { response, finalPath } = result;

    if (!response.ok) {
      throw createError(
        response.status,
        `Login request failed (${response.status}).`
      );
    }

    // Redirect to home may indicate successful authentication.
    // This must be confirmed against the actual session.
    if (response.redirected && finalPath === "/") {
      return {
        success: true,
        message: "Login request completed.",
        data: {
          redirectTo: "/dashboard",
        },
      };
    }

    if (finalPath === "/login") {
      throw createError(
        401,
        "Login unsuccessful. Please check your credentials."
      );
    }

    throw createError(
      0,
      "Unexpected authentication response."
    );

  } catch (error) {
    console.error("Login Error:", {
      status: error.status,
      message: error.message,
    });

    throw error;
  }
};

// ======================================
// REGISTER USER
// ======================================

export const registerUser = async (registerData) => {
  const {
    name,
    email,
    password,
    password_confirmation,
  } = registerData;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !password ||
    !password_confirmation
  ) {
    throw createError(
      422,
      "Please complete all required fields."
    );
  }

  if (password !== password_confirmation) {
    throw createError(
      422,
      "Passwords do not match."
    );
  }

  try {
    const token = await getCsrfToken("/register");

    const formData = new URLSearchParams();

    formData.append("_token", token);
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append(
      "password_confirmation",
      password_confirmation
    );

    const result = await sendFormRequest(
      "/register",
      formData
    );

    const { response, finalPath } = result;

    if (!response.ok) {
      throw createError(
        response.status,
        `Registration failed (${response.status}).`
      );
    }

    if (finalPath === "/register") {
      throw createError(
        422,
        "Registration unsuccessful. Please check your details."
      );
    }

    if (response.redirected && finalPath === "/") {
      return {
        success: true,
        message: "Registration completed.",
        data: {
          redirectTo: "/login",
        },
      };
    }

    throw createError(
      0,
      "Registration response received, but success could not be verified."
    );

  } catch (error) {
    console.error("Registration Error:", {
      status: error.status,
      message: error.message,
    });

    throw error;
  }
};

// ======================================
// LOGOUT USER
// ======================================

export const logoutUser = async () => {
  try {
    // Get CSRF token from authenticated home page
    const token = await getCsrfToken("/");

    const formData = new URLSearchParams();

    formData.append("_token", token);

    // Send logout POST request
    const result = await sendFormRequest(
      "/logout",
      formData
    );

    const { response, finalPath } = result;

    if (!response.ok) {
      throw createError(
        response.status,
        `Logout failed (${response.status}).`
      );
    }

    // A redirect to login is expected after logout.
    if (
      response.redirected &&
      finalPath === "/login"
    ) {
      return {
        success: true,
        message: "Logout successful.",
      };
    }

    return {
      success: true,
      message: "Logout request completed.",
    };

  } catch (error) {
    console.error("Logout Error:", {
      status: error.status,
      message: error.message,
    });

    throw error;
  }
};
