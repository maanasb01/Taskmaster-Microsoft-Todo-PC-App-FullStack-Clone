# Taskmaster Server

Taskmaster Server is an Express.js backend server for the Taskmaster.

The Taskmaster backend leverages `MongoDB with Mongoose for the database`, `Express with the Express-Validator library for the server`, and implements `bcryptJS for secure password storage` and `json-web-token for authentication`. To enhance security, `httpOnly cookies are utilized for authentication`. Regular data updates are managed through the `node-cron library`.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
- [Dependencies](#dependencies)

## Getting Started

### Prerequisites

To run this project, you need to have the following dependencies installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (recommended, though you can use npm as well)

### Installation

1. Clone the main Taskmaster repository to your local machine.

2. Navigate to the server directory:

    ```bash
    cd server
    ```

3. Install the project dependencies using Yarn(Recommended):

    ```bash
    yarn install
    ```

    **OR**

    You can also use npm:

    ```bash
    npm install
    ```

## Environment Variables
Before running the server, you need to set up environment variables. Create a .env file in the root of your project and add the following variables:

    # Example .env file
    PORT=3000
    DB_CONNECTION_STRING=your-mongodb-url
    AUTH_SECRET_KEY=your-secret-key

Make sure to replace `your-mongodb-url` and `your-secret-key` with your actual MongoDB URI and secret key. For more details on how to setup environment variables in node, visit [dotenv](https://www.npmjs.com/package/dotenv) node package.

## Usage

### Development

During development, you can use `nodemon` for live-reloading. Run the following command:

    yarn dev

**OR (Using npm)**
    
    npm run dev

**OR (Using pm2)**
    
    pm2-dev index.js


The development server will be available at `http://localhost:3000`. It will automatically restart whenever you make changes to your code.

### Production

For running the server in a production environment, you can use `pm2`. To start the server, use the following command:

    yarn start


**OR (Using npm)**

    npm run start


This will start the server using `pm2`, which will keep it running and manage it for you.

## Dependencies

The project depends on the following npm packages:

- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [node-cron](https://www.npmjs.com/package/node-cron)
- [pm2](https://www.npmjs.com/package/pm2)








