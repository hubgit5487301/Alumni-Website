# IET Alumni Portal

to run locally follow steps

1.install nodejs use following link

  node.js: <a href="https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi">https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi</a>

2.download and exctract project zip

3.open project folder 

4.create a .env file and enter follow parameters and their values (set port to 8000 if u dont plan on using CORS)
```bash
  Port = 'your port number' (a port number on which u want to run the server eg: 5000)
  mongoURI = 'your mongodb URI' (your mongo db key eg: mongoURI=mongodb+srv://<username>:<password>@cluster0.ddh4n.mongodb.net/<databasename>?retryWrites=true&w=majority&appName=Cluster0 )
  key = 'for session' (any string preferably a random and secure one eg: sdiyc123rF*7902jsv5sdvcwq88082fnp;v)
  service = 'email service' (email service u want to save user feedback at eg: gmail)
  user = 'your email account' (email account eg: 'user@gmail.com')
  pass = 'your gmail app key' (gmail app key or a password for other sevices)
  ```
  <a href ="https://myaccount.google.com/u/1/apppasswords">get gmail app passkey here</a>

4.open terminal in project folder and run following command (this will install all required dependencies)
```bash
npm i 
```
5.type following commmand in terminal to run server
```bash
node server.js
```
6.open a browser window and type following in address bar
```bash
https://loaclhost:<your port number>/
```

## Project Structure

This project is an Alumni Portal designed to connect alumni, students, and faculty of IET Khandari Agra University. It provides features for networking, job opportunities, event management, and resource sharing.

### Overall Project Structure

The codebase is organized into several key directories:

*   **`public/`**: Contains all publicly accessible static assets. This includes HTML, CSS, client-side JavaScript, and images for the landing page, login, registration, and other public-facing sections.
*   **`protected/`**: Houses the HTML, CSS, and client-side JavaScript for features accessible only to authenticated users. This includes the user dashboard, profile management, alumni directory, event listings, job board, and resource sharing sections.
*   **`admin_console/`**: Contains the interface (HTML, CSS, JS) for administrators to manage the platform, including user accounts, events, job postings, and system-wide alerts.
*   **`config/`**: This directory holds all server-side configurations.
    *   `routes/`: Defines the API endpoints and routes for different parts of the application (e.g., authentication, user profiles, events, jobs).
    *   `mongo.js`: Handles the connection setup to the MongoDB database.
    *   `passport-config.js`: Configures Passport.js for user authentication strategies.
    *   `middlewares.js`: Contains custom middleware functions used in the request-response cycle (e.g., for authentication checks, logging).
*   **`models/`**: Defines the Mongoose schemas for the MongoDB database. Each file typically represents a collection and outlines its structure and data types (e.g., `User.js`, `Event.js`, `Job.js`).
*   **`mockdata/`**: Includes sample JSON data used for development and testing purposes, helping to populate the database with initial content.
*   **`server.js`**: The main entry point for the Node.js backend application. It initializes the Express server, sets up middleware, connects to the database, and loads the defined routes.

### Frontend Structure

The frontend is primarily built using HTML, CSS, and vanilla JavaScript.

*   The `public/`, `protected/`, and `admin_console/` directories contain the respective frontend assets for different parts of the application.
*   **Client-side JavaScript (`script/` subdirectories):**
    *   Each section (e.g., `public/script/`, `protected/script/`) has its own JavaScript files specific to its functionality.
    *   Common scripts like `nav-bar.js` are likely used across multiple pages for handling navigation bar interactions and dynamic content loading.
    *   Utility scripts, possibly named `util.js` or similar within these directories, would contain shared client-side helper functions.

### Backend Structure

The backend is powered by Node.js and Express.js.

*   **`server.js`**: This is the core file that bootstraps the application. It sets up the Express server, integrates middleware (like body-parser, session management, Passport.js), establishes the database connection via `config/mongo.js`, and mounts the various route handlers defined in `config/routes/`.
*   **`config/` Directory:**
    *   `routes/`: Organizes API endpoints. For example, `authRoutes.js` would handle login/registration, `userRoutes.js` for profile operations, `eventRoutes.js` for event management, etc.
    *   `mongo.js`: Manages the MongoDB connection string and options, using Mongoose as the ODM.
    *   `passport-config.js`: Configures Passport.js with strategies (e.g., local strategy for username/password) for authenticating users. It works in conjunction with session management to maintain user login states.
    *   `middlewares.js`: Provides custom middleware for tasks such as checking if a user is authenticated before allowing access to protected routes (`isAuthenticated`), logging requests, or handling errors.
*   **`models/` Directory:** Contains Mongoose schema definitions. For instance:
    *   `User.js`: Defines the schema for user accounts (name, email, password, role, profile details, etc.).
    *   `Event.js`: Schema for events (title, description, date, location, attendees).
    *   `Job.js`: Schema for job postings (title, company, description, requirements).
    *   Other models might exist for resources, forum posts, etc.

### Authentication

User authentication is managed server-side using Passport.js, as configured in `config/passport-config.js`.
*   It likely uses a local strategy (username/password) for standard logins.
*   Session management (e.g., using `express-session`) is employed to keep users logged in across requests.
*   Middleware in `config/middlewares.js` protects routes that require authentication.

### Key Features (deduced from file structure)

Based on the project's file and directory structure, the Alumni Portal likely supports the following key features:

*   **User Management:**
    *   User registration and login (`public/registration-form.html`, `public/login.html`, `config/routes/authRoutes.js`).
    *   Password reset functionality (`public/forgot-password.html`, `public/reset-password.html`).
    *   User profiles with view and edit capabilities (`protected/profile.html`, `protected/edit-profile.html`).
*   **Community & Networking:**
    *   Alumni Directory (`protected/alumni-directory.html`) for searching and connecting with other alumni.
*   **Events & Opportunities:**
    *   Event creation, listing, and management (`protected/events.html`, `protected/create-event.html`, `admin_console/manage-events.html`).
    *   Job board with job postings (`protected/jobs.html`, `protected/post-job.html`, `admin_console/manage-jobs.html`).
    *   Applicant tracking features might be associated with events and jobs.
*   **Resource Sharing:**
    *   Platform for sharing academic or professional resources like notes and research papers (`protected/resources.html`).
*   **Administration:**
    *   Admin console (`admin_console/`) for managing users, events, jobs, and potentially sending out alerts or notifications.
*   **Communication:**
    *   Contact forms (`public/contact-us.html`) for inquiries.
