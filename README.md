# CrowInvoice – Authentication Interface

A responsive authentication interface developed using React.js for CrowInvoice. This project includes Login and Registration pages with form validation, API integration, error handling, and a clean user interface.

## Project Overview

The CrowInvoice Authentication Interface allows users to sign in to their accounts or create new accounts through a simple and user-friendly interface.

The application was developed as a frontend development assignment using React.js and Vite.

## Features

### Login
- Email and password input fields.
- Email format validation.
- Required field validation.
- Remember Me checkbox.
- API-based login functionality.
- Error handling for different HTTP status codes.
- Loading state during login requests.
- Redirect to dashboard after successful login.

### Registration
- Full name, email, password, and confirm password fields.
- Required field validation.
- Email format validation.
- Name and email length validation.
- Password length validation.
- Password confirmation validation.
- Duplicate email error handling.
- Redirect after successful registration.

### Additional Features
- Responsive user interface.
- Reusable API service functions.
- Mock API support for testing.
- Login, Registration, and Logout service functions.
- API response handling.

## Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript | Application logic |
| Vite | Development server and build tool |
| React Router DOM | Page navigation |
| CSS3 | User interface styling |
| Fetch API | Backend API communication |

## Project Structure

```text
CrowInvoice/
│
├── public/
│
├── src/
│   ├── assets/
│   │   └── Logo.jpg
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │   └── Service.js
│   │
│   ├── styles/
│   │   ├── Login.css
│   │   └── Register.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd CrowInvoice
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Mock API Testing

The application includes a mock API mode to test authentication functionality when the actual backend API is unavailable.

In `Service.js`:

```javascript
const USE_MOCK_API = true;
```

### Demo Login Credentials

| Field | Value |
|---|---|
| Email | demo@crowinvoice.com |
| Password | Demo1234! |

Mock mode simulates API responses for successful login, invalid credentials, validation errors, and registration.

**Note:** Mock authentication does not connect to a real database or create actual user sessions.

## API Integration

The application includes the following API service functions:

| Function | Endpoint | Method |
|---|---|---|
| loginUser() | /api/login | POST |
| registerUser() | /api/register | POST |
| logoutUser() | /api/logout | POST |

The Fetch API is used to send requests with JSON data. Cookie credentials are included for session-based authentication.

The actual API integration requires the appropriate backend server and Vite proxy configuration.

## Error Handling

The application handles different HTTP response status codes:

| Status Code | Description |
|---|---|
| 401 | Unauthorized |
| 409 | Duplicate email |
| 422 | Validation error |
| 500 | Internal server error |

## Testing

The following scenarios can be tested:

- Login with valid credentials.
- Login with invalid credentials.
- Login with empty fields.
- Invalid email format.
- Registration with valid details.
- Registration with empty fields.
- Password mismatch.
- Password shorter than 8 characters.
- Duplicate email registration.
- Loading state during API requests.
- Navigation between Login and Registration pages.

## Future Improvements

- Connect to the live authentication API.
- Implement secure session management.
- Add password visibility toggle.
- Add forgot password functionality.
- Implement protected dashboard routes.

## Developer

**Developed as a Frontend Development Assignment**

Technologies: React.js, JavaScript, CSS3, Vite and REST API Integration.

---

© 2026 Crow.lk. All rights reserved.
