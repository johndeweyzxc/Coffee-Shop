# About

Coffee Shop App is a web application designed for coffee shop owners and administrators. The app allows them to create, manage, and customize their products with various addons. Administrators can perform CRUD (Create, Read, Update, Delete) operations on these products to ensure the menu is always up-to-date. Customers can browse the product offerings, add items to their cart, and place orders. Once an order is placed, shop owners and admins can track and update the order status, informing customers whether their order is being processed, packaged, delivered, or has already been delivered.

#### This project is part of my university course. I managed the entire system, including the code, documentation, and the setup and administration of databases and authentication.

## Use case diagram

<img src="architecture and use case/Coffee Shop App Use Case diagram.png">

### Client use cases

- <b>View products</b> - View all products as well as available addons created by admin in menu page
- <b>Add to cart</b> - Add the selected product from menu to cart
- <b>View cart</b> - View all products added to cart, the client can also edit or delete them
- <b>Checkout cart</b> - Place an order, this will create an order
- <b>View order</b> - Once the order has been place, user can now see the order and its status

### Admin use cases

- <b>Create product - Create a product and its available addons
- <b>View order - View orders placed by all clients, admin can delete them
- <b>Update order status - Updates the status of the order

#### \*An admin can also be the owner of the shop

## Web app architecture

<img src="architecture and use case/Coffee Shop App Architecture.png">

### Components

- <b>User Interface</b> - This is where the buttons, input fields, and other UI components resides
- <b>Controller</b> - Handles the state of the UI components such as the text on input fields
- <b>View Model</b> - Validates state of the UI components, the component manages different uses cases
- <b>Model</b> - Assembles raw data from API source into structured objects that the view model can consume
- <b>API</b> - This are endpoints that allow the application to fetch data from different sources such as local or online databases
- <b>Data Sources</b> - The local or online databases that the API uses to perform Create, Read, Update and Delete (CRUD) operations

### Connector types

- <b>Method / API invocation</b> - A function or method call on that component
- <b>State change</b> - When new data has change, the controller refreshes the UI to reflect the new state
- <b>Callback</b> - Non-blocking architecture is use to allow the execution of multiple IO task without blocking the main thread. Data is passed on different components via callbacks, each components filters and assembles the data into structured information
- <b>Data</b> - This are data received as a result of performing queries to a database or API endpoints

## Preview

### Menu page (View products)

<img src="web preview/Menu.png" width=900>

### Admin page (Update product)

<img src="web preview/Update product.png" width=900>

## Admin authentication and user accounts

#### The admin can log in to the system using an email and password while the user can authenticate using Google Sign-In

<img src="database structure/Auth.png" width=900>

## Database structure

#### Coffee shop app uses Firebase Firestore for its database which is a NoSQL document oriented database. Each document is stored inside of a collection and each document contains a set of key-value pairs. The images is stored using Firebase storage.

### Products

#### Products collection -> product document -> key-value pairs

<img src="database structure/Products.png" width=900>

### Carts

#### Users collection -> user document -> carts collection -> cart document -> key-value pairs

<img src="database structure/Carts.png" width=900>

### Orders

#### Orders collection -> order document -> key-value pairs

<img src="database structure/Orders.png" width=900>

#### Each documents in the database is secured using security rules that are applied to each document when performing create, read, update or delete

## Technologies used

<img src="https://skillicons.dev/icons?i=html,css,ts,react,tailwind,materialui,firebase" width=700 />

#### Technologies that I have used to accomplish this project are:

- HTML, CSS, TypeScript and React - For dynamic content and design
- Tailwind CSS and Material UI - For using pre-built UI components
- Firebase - For authentication, database and hosting of web application
