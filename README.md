# ZUULA – UCU Campus Lost and Found System

ZUULA is a web-based Lost and Found System developed for the Uganda Christian University community. It provides a central platform where students can report lost belongings, report items they have found, search through existing reports and make claims when they identify an item that belongs to them.

The idea came from a common problem in university environments. When someone loses an item, finding it often depends on asking around, checking different WhatsApp groups or making announcements. Someone who finds an item may also struggle to locate its owner. ZUULA brings these activities together in one system.

The application has two main user roles: students and administrators. Students use the platform to report and search for items, while administrators manage reports and review ownership claims.

## Project Information

| Item | Details |
|---|---|
| Project | ZUULA – UCU Campus Lost and Found System |
| Institution | Uganda Christian University |
| Faculty | Faculty of Engineering, Design and Technology |
| Department | Computing and Technology |
| Course | CSC1202 – Web and Mobile Applications Development |
| Semester | Advent 2026 |

## Main Features

### Student Account

A student can create an account, log in and access the student section of the application. From there, the student can:

- Report an item as lost or found.
- Provide information about an item, including its title, category, location, date and description.
- Upload an image of an item where applicable.
- Browse reports submitted by other users.
- Search for items they may have lost.
- Submit an ownership claim for a found item.
- View their own reports and claims.
- Receive notifications relating to their activities.

### Administrator Account

The administrator section is separate from the ordinary student section. Administrators can access management functions that are not available to normal student accounts.

These include:

- Viewing and managing item reports.
- Reviewing submitted ownership claims.
- Approving or rejecting claims.
- Providing a reason when making a claim decision.
- Monitoring activity within the system.

Administrator access is controlled by the backend, not simply by hiding administrator pages on the frontend.

## Technologies Used

The project uses JavaScript on both the frontend and backend.

| Technology | Purpose |
|---|---|
| React | Used to build the pages and interactive parts of the application. |
| Vite | Runs the frontend during development and builds it for deployment. |
| JavaScript | Handles application logic. |
| CSS | Controls the appearance and layout of the application. |
| Node.js | Provides the backend runtime. |
| Express.js | Handles API routes and server requests. |
| MySQL | Stores users, reports, claims and notifications. |
| mysql2 | Connects the backend to the MySQL database. |
| bcryptjs | Hashes user passwords before they are stored. |
| JSON Web Tokens (JWT) | Handles authentication and identifies logged-in users. |
| React Router | Handles navigation between application pages. |

Other packages are used for validation, cookies, file uploads and security. Their dependencies can be viewed in the `package.json` files.

## How ZUULA Works

The application is divided into three main parts.

**Frontend:** This is the part users see when they open ZUULA. It contains the login and registration pages, dashboards, forms and item listings. We used React and Vite to develop it.

**Backend:** This handles the requests coming from the frontend. It checks user authentication, validates information, applies application rules and communicates with the database. We used Node.js and Express.

**Database:** This stores the information used by the application. MySQL keeps records of registered users, lost and found reports, claims and notifications.

The frontend does not connect directly to MySQL. All database operations go through the backend.

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
          ---------------------------
          |            |            |
        USERS        REPORTS       CLAIMS
                       |
                  NOTIFICATIONS
```

## Database Structure

ZUULA uses a MySQL database named `zuula_db`.

The database has four main tables:

| Table | What it stores |
|---|---|
| `users` | Registered users, their account details and roles. |
| `reports` | Information about lost and found items. |
| `claims` | Ownership claims submitted by students. |
| `notifications` | Messages and updates associated with user accounts. |

The tables are related. For example, one student can submit several reports and claims. A found item can also receive more than one ownership claim.

The database setup script is located at:

```text
database/schema.sql
```

Running this script creates the database and the tables required by the application.

## Password Security and Authentication

We did not store users' original passwords in the database. Instead, ZUULA uses **bcryptjs to hash passwords before saving them**.

The password hashing configuration uses a cost factor of 12. Hashing is one-way, meaning the original password cannot simply be recovered from the stored hash.

When a user logs in, the password they enter is checked against the stored hash. If the credentials are correct, the server creates a signed JWT containing the user's ID and role. The token is stored in an HTTP-only cookie and verified when the user accesses protected parts of the system.

The application also checks user roles on the backend. For example, a student cannot gain administrator permissions simply by changing a page address or modifying the frontend.

## Project Folder Structure

The project is organised into the following main folders:

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

The `client` folder contains the React application. The `server` folder contains the backend, including the routes, controllers, database configuration and middleware. The `database` folder contains the SQL file used to set up the database.

## Installation and Setup

The following instructions explain how to run ZUULA on a local computer. You need to set up the database and backend before opening the application in your browser.

### Requirements

Install the following software first:

1. **Node.js and npm** – used to install dependencies and run the application.
2. **MySQL Server** – used to store the application's data.
3. **Visual Studio Code** – recommended for opening the project and editing its files.
4. **Git** – useful for downloading the repository and managing changes.

Official download pages:

- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/mysql/
- Visual Studio Code: https://code.visualstudio.com/
- Git: https://git-scm.com/

### Step 1: Download the Project

Clone the project repository from GitHub:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Enter the project folder:

```bash
cd ZUULA
```

If the downloaded folder has a different name, use that name in the command.

You can also download the repository as a ZIP file from GitHub and extract it.

### Step 2: Set Up the Database

Start your MySQL server.

Open MySQL Workbench or another MySQL client and locate the following file in the project:

```text
database/schema.sql
```

Run the SQL script. It creates the `zuula_db` database and the four main tables used by the application.

Alternatively, if MySQL is available in your terminal, run this command from the main project folder:

```bash
mysql -u root -p < database/schema.sql
```

Enter your MySQL password when prompted.

After executing the script, check that the `zuula_db` database has been created successfully.

### Step 3: Configure the Backend

Open a terminal in the main project folder and move into the backend directory:

```bash
cd server
```

Install the backend packages:

```bash
npm install
```

The backend uses environment variables to store settings such as database credentials, the JWT secret and the administrator registration code.

Create a local `.env` file by copying the example file:

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

Open `server/.env` in Visual Studio Code and enter the appropriate values.

The database settings should point to your local MySQL installation. For example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=zuula_db
DB_PORT=3306
JWT_SECRET=your_long_random_secret
```

These are example database and JWT settings. Keep the exact variable names used in your `.env.example` file and configure any other required values there.

#### Administrator Registration Code

ZUULA has an additional check when someone registers an administrator account.

The administrator registration code is stored in the backend's `.env` file. For our current project setup, the code is:

```text
2580
```

When someone selects the administrator registration option, they must provide this code. The backend checks the submitted code against the value stored in `.env`.

- If the code is correct, the administrator registration can proceed.
- If the code is incorrect, the registration is rejected.
- If the administrator code has not been configured, administrator registration is disabled.

This means that someone cannot simply select the administrator role and create an administrator account without the correct code.

The code is checked on the server, not just in the registration form. The backend also uses a safe comparison and limits repeated registration attempts.

**Important:** The code `2580` is the code used for our current academic demonstration. It should be changed to a longer, private code before any public or production deployment. Keep the actual `.env` file out of GitHub.

### Step 4: Start the Backend

Make sure you are still inside the `server` folder.

Run:

```bash
npm run dev
```

The backend first checks whether it can connect to MySQL. If the connection succeeds, the server starts on:

```text
http://localhost:5000
```

You should see messages similar to:

```text
MySQL database connected successfully.
ZUULA server running on http://localhost:5000
```

You can also check whether the API is responding by opening:

```text
http://localhost:5000/api/health
```

### Step 5: Set Up the Frontend

Open a second terminal window. From the main project directory, enter the frontend folder:

```bash
cd client
```

Install the frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Vite will display the local address where the application is running. With the default configuration, open:

```text
http://localhost:5173
```

ZUULA should now load in your browser.

**Keep both terminal windows open while using the application.** The backend handles the requests and database operations, while the frontend displays the website.

## Local Application Addresses

| Service | Address |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:5000` |
| Backend health check | `http://localhost:5000/api/health` |

These addresses are for local development. They are not public deployment links.

## Main Backend Routes

The backend separates its operations into different route groups.

| Route | Function |
|---|---|
| `/api/auth` | Registration, login and authentication. |
| `/api/reports` | Creating and managing lost and found reports. |
| `/api/claims` | Submitting and managing ownership claims. |
| `/api/notifications` | Handling notifications. |
| `/api/admin` | Administrator operations. |

Each route connects to the relevant backend controller, where the actual application logic is handled.

## Security Measures

Some of the security measures included in ZUULA are:

- **Password hashing:** bcryptjs hashes passwords using a cost factor of 12 before they are stored.
- **JWT authentication:** Signed tokens identify logged-in users.
- **HTTP-only cookies:** Authentication tokens are stored in cookies that cannot be read directly by frontend JavaScript.
- **Role-based access:** Backend middleware checks whether a user is authorised to perform an operation.
- **Administrator registration code:** A code stored in `.env` is required to register an administrator account.
- **Rate limiting:** Limits repeated login and registration attempts.
- **Input validation:** Checks submitted information before it is processed.
- **SQL injection protection:** Database queries use placeholders rather than inserting user input directly into SQL statements.
- **File upload restrictions:** Uploaded images are restricted by file type and size.

The system also separates public item information from private information used during ownership claims. Public listings should not expose private identifying details or users' email addresses.

## Current Limitations and Possible Improvements

There are still areas that can be improved as development continues.

Some of the outstanding tasks identified during code review include:

- Completing and testing the item return-confirmation endpoint.
- Protecting claim photographs behind an authenticated route.
- Adding more filtering options for item locations and dates.
- Expanding automated tests.
- Strengthening administrator registration or introducing an administrator invitation process.

These are areas for further development and should not be confused with features that have already been completed.

## Basic Testing

After starting the application, the following activities can be used to check whether the main functions are working:

1. Register a student account.
2. Log in using the new account.
3. Submit a lost-item report.
4. Submit a found-item report.
5. Browse and search the available reports.
6. Submit an ownership claim.
7. Check the status of the claim.
8. Register an administrator using the correct administrator code.
9. Log in to the administrator account.
10. Review a submitted claim and make a decision.
11. Check that a student cannot access administrator-only functions.
12. Check that users cannot edit or manage reports belonging to other users.

Use test accounts and fictional item information when demonstrating the system.

## GitHub Repository

The repository contains the source code and documentation needed to understand and run the project.

Before uploading changes, check the files that are going to be committed:

```bash
git status
```

Add the README:

```bash
git add README.md
```

Commit the changes:

```bash
git commit -m "Add project README and setup instructions"
```

Push the changes to GitHub:

```bash
git push
```

Make sure the `.env` file is excluded through `.gitignore`. It contains private configuration information, including database credentials, the JWT secret and the administrator registration code. The `.env.example` file can be included because it provides the configuration structure without real secrets.

## Acknowledgement

ZUULA was developed as part of the CSC1202 – Web and Mobile Applications Development course at Uganda Christian University.

The project applies the web development concepts covered in the course to a practical challenge within the university community. It brings together frontend development, backend programming, database management and application security in one working system.

