# ZUULA – UCU Campus Lost and Found System

## About the Project

ZUULA is a Lost and Found System developed for the Uganda Christian University (UCU) community. It was built to make it easier for students to report belongings they have lost, report items they have found and identify items that may belong to them.

Before having a central platform, finding a lost item could involve asking around campus, posting in WhatsApp groups or making announcements. The same challenge applied to people who found items but did not know how to get them back to their owners.

We developed ZUULA to bring these activities into one place. Students can submit and search for reports, while administrators help manage the reports and handle ownership claims.

The system has two user roles: **Students and Administrators**, each with different levels of access.

## Project Information

| Item | Details |
|---|---|
| Project Name | ZUULA : UCU Campus Lost and Found System |
| Institution | Uganda Christian University |
| Faculty | Faculty of Engineering, Design and Technology |
| Department | Computing and Technology |
| Course | CSC1202 – Web and Mobile Applications Development |
| Semester | Advent 2026 |

## Features

### Student Account

Students can register for an account and log in to access the platform.

Once logged in, they can:

- Submit reports for items they have lost or found.
- Enter details such as the item name, category, location, date and description.
- Attach an image to an item report where applicable.
- View reports submitted by other users.
- Search for items they are trying to locate.
- Submit a claim when they identify an item that belongs to them.
- View their submitted reports and ownership claims.
- Receive notifications about activities relating to their accounts.

### Administrator Account

ZUULA has a separate administrator section for managing activities within the system.

Administrators can:

- View and manage lost and found reports.
- Access ownership claims submitted by students.
- Review claims and approve or reject them.
- Provide a reason when making a decision on a claim.
- Monitor activities taking place on the platform.

Administrator permissions are checked by the backend. Access is not controlled simply by hiding administrator pages from ordinary users.

## Technologies Used

We used JavaScript technologies to develop both the frontend and backend of the system.

| Technology | How We Used It |
|---|---|
| React | Building the user interface and application components. |
| Vite | Running the frontend during development and building it for deployment. |
| JavaScript | Writing the application logic. |
| CSS | Styling the pages and arranging the interface. |
| Node.js | Running the backend. |
| Express.js | Creating API routes and handling server requests. |
| MySQL | Storing user accounts, reports, claims and notifications. |
| mysql2 | Connecting the backend to MySQL. |
| bcryptjs | Hashing passwords before storing them. |
| JSON Web Tokens (JWT) | Handling user authentication. |
| React Router | Managing navigation between frontend pages. |

We also use additional packages for tasks such as validation, cookies, file uploads and security. The individual dependencies are listed in the respective `package.json` files.

## How the System Works

ZUULA is made up of three main parts: the frontend, backend and database.

**Frontend (React and Vite)**

This is the part of the system that students and administrators interact with. It contains the registration and login pages, dashboards, forms, item listings and other interface elements.

**Backend (Node.js and Express.js)**

The backend receives requests from the frontend and processes them. It handles authentication, checks permissions, validates submitted information and communicates with the database.

**Database (MySQL)**

MySQL stores the information used by the system, including registered users, lost and found reports, ownership claims and notifications.

The frontend does not communicate directly with MySQL. Requests first go through the Express backend, which handles the necessary operations.

The general flow is:

```text
        STUDENT / ADMINISTRATOR
                  |
                  v
            REACT FRONTEND
                  |
                  v
           EXPRESS BACKEND
              (Node.js)
                  |
                  v
            MYSQL DATABASE
                  |
        ---------------------
        |         |         |
      USERS    REPORTS    CLAIMS
                  |
             NOTIFICATIONS
```

## Database Structure

The project uses a MySQL database named `zuula_db`.

It currently has four main tables:

| Table | Purpose |
|---|---|
| `users` | Stores registered users, account details and assigned roles. |
| `reports` | Stores information about lost and found items. |
| `claims` | Stores ownership claims submitted by students. |
| `notifications` | Stores notifications associated with user accounts. |

These tables are connected through their relationships. For example, a student can submit multiple reports and claims, while a found item can receive claims from different users.

The SQL file used to create the database is located at:

```text
database/schema.sql
```

Run this script before starting the application for the first time.

## Password Security and Authentication

Passwords are not stored as plain text in the database. We use **bcryptjs** to hash passwords before saving them.

The hashing configuration uses a cost factor of 12. When a user logs in, the password entered is compared with the stored hash rather than retrieving the original password.

After successful authentication, the backend generates a signed JSON Web Token (JWT) containing the user's ID and role. This token is stored in an HTTP-only cookie and checked when the user accesses protected parts of the application.

We also implemented role-based access control. This ensures that student accounts cannot perform administrator-only operations simply by changing a URL or modifying something on the frontend.

## Project Folder Structure

The project is divided into separate folders for the frontend, backend and database.

```text
ZUULA/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── uploads/
│   ├── .env.example
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── README.md
└── .gitignore
```

The `client` folder contains the React frontend, including its pages, reusable components, styles and services.

The `server` folder contains the backend code. The routes handle incoming API requests, controllers contain the application logic, middleware handles checks such as authentication and authorisation, and the configuration folder contains backend settings.

The `database` folder contains the SQL script used to create the database tables.

## Installation and Setup

To run ZUULA on your computer, you need to set up the database, install the backend dependencies and start both the backend and frontend servers.

### Requirements

Make sure the following software is installed:

1. **Node.js and npm** – for installing packages and running the application.
2. **MySQL Server** – for creating and managing the database.
3. **Visual Studio Code** – recommended for opening and working on the project.
4. **Git** – for cloning the repository and managing source code.

Download links:

- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/mysql/
- Visual Studio Code: https://code.visualstudio.com/
- Git: https://git-scm.com/

### Step 1: Download the Project

Clone the repository from GitHub:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Move into the project directory:

```bash
cd ZUULA
```

If the downloaded folder has a different name, use that folder name instead.

You can also download the project as a ZIP file directly from GitHub and extract it.

### Step 2: Set Up the Database

Start your MySQL server.

Open MySQL Workbench or another MySQL client and locate:

```text
database/schema.sql
```

Run the SQL script. It creates the `zuula_db` database together with the four main tables required by the application.

Alternatively, you can execute the script from the project directory using the terminal:

```bash
mysql -u root -p < database/schema.sql
```

Enter your MySQL password when prompted.

Once the script has finished running, check that `zuula_db` has been created successfully.

### Step 3: Configure the Backend

Open a terminal in the main project directory and enter the server folder:

```bash
cd server
```

Install the backend dependencies:

```bash
npm install
```

The backend uses environment variables for database credentials, the JWT secret and the administrator registration code.

Create your local `.env` file by copying `.env.example`.

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

Open `server/.env` and enter the appropriate configuration values.

For example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=zuula_db
DB_PORT=3306
JWT_SECRET=your_long_random_secret
```

These are example settings. Use the exact variable names provided in your `.env.example` file and configure any additional variables required by the backend.

#### Administrator Registration Code

ZUULA includes an additional verification step for anyone registering an administrator account.

The administrator registration code is configured in the backend `.env` file. For our current academic demonstration, the code is:

```text
2580
```

When registering, anyone selecting the administrator option must enter this code.

The backend checks the submitted code against the value stored in the environment configuration.

- A correct code allows administrator registration to proceed.
- An incorrect code causes the registration to be rejected.
- If the code has not been configured, administrator registration is disabled.

This check happens on the server, rather than relying only on the registration form. The backend also uses a safe comparison and limits repeated registration attempts.

**Important:** `2580` is the code used for the current academic demonstration. It should be replaced with a longer private code before any public deployment. Never upload your actual `.env` file to GitHub.

### Step 4: Start the Backend

Make sure your terminal is still inside the `server` directory.

Run:

```bash
npm run dev
```

The backend checks its MySQL connection before starting.

If everything is configured correctly, the server should run at:

```text
http://localhost:5000
```

You should see messages similar to:

```text
MySQL database connected successfully.
ZUULA server running on http://localhost:5000
```

To check whether the API is responding, open the following address in your browser:

http://localhost:5000/api/health

### Step 5: Set Up the Frontend

Open another terminal window. From the main project directory, move into the client folder:

```bash
cd client
```

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local address for the application. With the default configuration, it should be:

http://localhost:5173

Open this address in your browser to access ZUULA.

**Keep both terminal windows running while using the application.** The frontend handles what appears in the browser, while the backend processes requests and communicates with MySQL.

## Local Application Addresses

| Service | Address |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:5000` |
| Backend health check | `http://localhost:5000/api/health` |

These addresses are for local development and testing.

## Main Backend Routes

The backend API is divided into route groups according to the operations they handle.

| Route | Purpose |
|---|---|
| `/api/auth` | Registration, login and authentication. |
| `/api/reports` | Creating and managing lost and found reports. |
| `/api/claims` | Submitting and managing ownership claims. |
| `/api/notifications` | Handling user notifications. |
| `/api/admin` | Administrator operations. |

Each route connects to its corresponding controller, where the actual request processing and application logic take place.

## Security Measures

Security was considered during the development of ZUULA, particularly because the system handles user accounts and ownership claims.

The measures implemented include:

- **Password hashing:** bcryptjs hashes passwords using a cost factor of 12 before they are stored.
- **JWT authentication:** Signed tokens are used to identify authenticated users.
- **HTTP-only cookies:** Authentication tokens are stored in cookies that cannot be accessed directly through frontend JavaScript.
- **Role-based access control:** Backend middleware checks whether a user has permission to perform a particular operation.
- **Administrator registration code:** A code stored in the `.env` file is required when registering an administrator account.
- **Rate limiting:** Helps restrict repeated login and registration attempts.
- **Input validation:** Checks submitted information before it is processed.
- **SQL injection protection:** Database queries use placeholders instead of directly inserting user input into SQL statements.
- **File upload restrictions:** Uploaded images are restricted according to file type and size.

The system also separates publicly displayed item information from private information used during ownership claims. Personal information such as users' email addresses and private identifying details should not be exposed in public listings.

## Current Limitations and Areas for Improvement

There are still a few areas that need further attention as the project develops.

The outstanding tasks identified during code review include:

- Completing and testing the item return-confirmation endpoint.
- Protecting claim photographs behind an authenticated route.
- Adding more filtering options for item locations and dates.
- Expanding automated tests.
- Strengthening administrator registration or introducing an administrator invitation process.

These are areas we identified for further development. They should not be mistaken for features that have already been completed.

## Testing the Application

After setting up and starting the application, the following steps can be used to check the main functions:

1. Register a student account.
2. Log in using the newly created account.
3. Submit a lost-item report.
4. Submit a found-item report.
5. Browse and search through the available reports.
6. Submit an ownership claim.
7. Check the status of the submitted claim.
8. Register an administrator account using the correct registration code.
9. Log in using the administrator account.
10. Open a submitted claim and approve or reject it.
11. Check that a student cannot access administrator-only functions.
12. Check that users cannot edit or manage reports belonging to other users.

Use test accounts and fictional item information when demonstrating the system.

## GitHub Repository

The GitHub repository contains the source code and documentation for ZUULA.

Before committing changes, check the files that Git has detected:

```bash
git status
```

To add the README file:

```bash
git add README.md
```

Commit the changes:

```bash
git commit -m "Update project documentation"
```

Push the changes to GitHub:

```bash
git push
```

If you are working on a separate branch, make sure you push to the correct branch.

Also check that `.env` is included in `.gitignore`. This file contains private configuration details such as database credentials, the JWT secret and the administrator registration code.

The `.env.example` file can be included in the repository because it provides the required configuration structure without containing actual private credentials.

## Acknowledgement

ZUULA was developed as part of the CSC1202 – Web and Mobile Applications Development course at Uganda Christian University.

Through this project, we applied the web development concepts covered during the course to a problem that can occur within our university community. Working on ZUULA involved frontend development, backend programming, database design, authentication and application security.