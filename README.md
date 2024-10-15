# Matcha - Dating App

**Version**: 1.0  
**Summary**: Because love too can be industrialized.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Database Schema](#database-schema)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Introduction
**Matcha** is a web-based dating application that helps potential lovers meet based on user-defined preferences and matching algorithms. This app facilitates user registration, profile management, searching for matches, and real-time chatting between users who have mutually shown interest in each other.

## Features
- **User Registration & Authentication**: Secure user registration with email verification, login, and password reset functionality.
- **User Profile Management**: Users can create and update their profiles with personal details, gender, sexual preferences, biography, and interests.
- **GPS-based Matching**: Users are matched with others based on their geographical location, interests, and fame rating.
- **Real-time Chat**: Matched users can chat in real-time with minimal delay.
- **Notifications**: Real-time notifications for likes, views, and messages.
- **Advanced Search**: Users can filter matches by age, location, fame rating, and tags.
- **Blocking and Reporting**: Users can block or report fake accounts to improve user safety.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/rakhsas/matcha.git
    cd matcha

2. Install dependencies (assuming you are using Node.js):
    ```bash
    make

3. Set up environment variables:
    
    `Create a .env file at the root of the project and include necessary keys, e.g., database credentials and API keys.`

    ```bash
    DB_HOST=your_db_host
    DB_USER=your_db_user
    DB_PASS=your_db_pass
    ```

## Usage

**1.** Access the app in your browser by navigating to `http://localhost:3000`.

**2.** Register a new account, verify via email, and log in.

**3.** Complete your profile with preferences, upload photos, and start browsing.

**4.** Use the search and filtering options to find potential matches.

**5.** Like a profile to express interest, and if the interest is mutual, start chatting!

## Technologies

**Frontend**: Angular, Tailwind

**Backend**: Node.js, Express

**Database**: PostgreSQL

**Real-time Communication**: Socket.io for real-time chat and notifications

**Geolocation**: GPS-based positioning for match suggestions

**Authentication**: JWT-based authentication and secure password hashing

## Security

- Passwords are hashed using bcrypt.
- Forms are validated to prevent SQL injection.
- HTTPS is enforced for secure communication.
- All sensitive data is stored in environment variables (.env file).



### How to Use This Code
```txt
1. Copy the above code.
2. Open your `README.md` file in a text editor or your code editor.
3. Paste the code and save the file.
Once you've saved the file, it should display correctly formatted text on GitHub or any other platform that supports Markdown.
```
