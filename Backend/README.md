# Zenora

A full stack property listing platform where users can explore, create, manage, and review rental properties with secure authentication and authorization.

---

## Features

-  Secure User Authentication & Authorization
-  Create, Edit & Delete Property Listings
-  Add & Manage Reviews
-  Ownership based access control
-  MongoDB Relationships with Cascading deletes
-  RESTful Routing Architecture
-  Responsive UI
-  Error Handling and Validation middlewares

---

# 🛠 Tech Stack

## Frontend
- EJS
- Bootstrap

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- Passport.js
- Express Session

---

# Project Structure

```bash
Zenora/
│
├── models/
├── routes/
├── controllers/
├── utils/
├── public/
├── views/
├── middleware.js
├── app.js
├── package.json
└── README.md
```
---

# Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
CLOUD_NAME=your_cloudinary_cloud_name

CLOUD_API_KEY=your_cloudinary_api_key

CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_token

ATLASDB_URL=your_mongodb_connection_string

SECRET=your_session_secret
```
---

While building this project, I learned:

- RESTful API design
- Authentication & authorization
- MongoDB data relationships
- Middleware handling in Express
- Session management
- MVC architecture
- Error handling and validation
- CRUD operations
