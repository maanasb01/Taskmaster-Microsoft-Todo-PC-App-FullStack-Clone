
# Taskmaster: A Microsoft To-Do PC App's Fullstack Clone (MERN)

Taskmaster is a clone of the 'Microsoft To-Do' PC application, developed as a fullstack **MERN** application.

The backend leverages `MongoDB with Mongoose for the database`, `Express with the Express-Validator library for the server`, and implements `bcryptJS for secure password storage` and `json-web-token for authentication`. To enhance security, `httpOnly cookies are utilized for authentication`. Regular data updates are managed through the `node-cron library`.

On the frontend, Taskmaster is powered by `React`, `Vite`, and `Tailwind CSS`, complemented by various other libraries for a seamless user experience. 

The primary focus during development was to meticulously replicate the UI of the Microsoft To-Do app, striving for a seamless resemblance. Furthermore, Taskmaster is designed to be fully responsive, making it accessible and functional on any device seemlessly.


## Features

- **Task Creation:** Easily create and organize tasks with user-friendly input, enabling essential CRUD (Create, Read, Update, Delete) operations for comprehensive task management.
- **Task Lists:** Group tasks into customizable lists for efficient organization.
- **Subtasks and Checklists:** Break down tasks into smaller subtasks and create checklists for detailed progress tracking.
- **Promote Subtasks:** Promote subtasks to a Task.
- **Star Tasks:** Mark your Tasks as important to be shown in the "Important" task list.
- **Due Dates:** Set due dates to keep track of task deadlines.
- **Default 'Tasks' List:** Instantly add tasks without creating custom lists. When tasks are created in the 'Important' section, they will be automatically included in the 'Tasks' list while being marked as important for your convenience. Likewise, any tasks added to the 'My Day' section will also be seamlessly integrated into this default list. 
- **My Day Section:** Automatically populate the "My Day" section with tasks due for the day. Tasks from the previous day are removed, keeping your daily task list up-to-date.
- **Important Section:** Access all the marked important tasks in the "Important" section.
- **Notes:** Add notes to tasks for enhanced task details and reference.
- **Profile:** Access user details here. Edit the details by confirming your password. Delete account functionality is also accessible from here.
- **Session Expiry Alert:** When the token in the cookies expires, a modal message informs users about the session expiration and redirects them to the login page.
- **Progress Indicator:** The top loader component placed at the application's header signals ongoing tasks and activities throughout the whole app, keeping users informed of the application's progress.
- **Fully Responsive:** Access the application anywhere from various devices and screen sizes.
- **Protected Routes:** Ensuring secure routing throughout the app, including automatic redirection to appropriate pages based on authentication status, with error handling.
- **Secure Authentication:** Utilized JSON web tokens and httpOnly cookies for secure user authentication and bcryptJS for added layer of password protection.


## Setup

Setup for Client and Server has been explained in their separate README files.