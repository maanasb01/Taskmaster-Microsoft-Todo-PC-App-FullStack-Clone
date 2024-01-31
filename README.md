
# Taskmaster: A Microsoft To-Do PC App's Fullstack Clone (MERN)

Taskmaster is a clone of the 'Microsoft To-Do' PC application, developed as a fullstack **MERN** application.

The backend leverages `MongoDB with Mongoose for the database`, `Express with the Express-Validator library for the server`, and implements `bcryptJS for secure password storage` and `json-web-token for authentication`. To enhance security, `httpOnly cookies are utilized for authentication`. Regular data updates are managed through the `node-cron library`.

On the frontend, Taskmaster is powered by `React`, `Vite`, and `Tailwind CSS`, complemented by various other libraries for a seamless user experience. 

The primary focus during development was to meticulously replicate the UI of the Microsoft To-Do app, striving for a seamless resemblance. Furthermore, Taskmaster is designed to be fully responsive, making it accessible and functional on any device seamlessly.


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
- **Secure Authentication:** Utilized JSON web tokens and httpOnly cookies for secure user authentication and bcryptJS for an added layer of password protection.

## Setup

The setup for the Client and Server has been explained in their separate README files.

## Demo Video

https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/aa67c135-651d-4b78-b132-8ffa071cc8b4

## Application Screenshots

#### Home
![Taskamster_home](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/b804c3d6-7a56-4ec5-892c-3e9c504c2e84)
#### Make Custom Task Lists and select any of them to display their Tasks.
![Taskmaster-1](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/f8dc59f9-8799-4705-8e4f-a7c7fc940c66)
#### Add Tasks to the custom list.
![Taskmaster-2](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/6df4b677-d0a3-4373-a9e1-89b51b90a4cf)
#### Select a Task to add properties like steps (sub-tasks), note, due date, or to add the Task in "My Day"
![Taskmaster-3](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/3c3ca0ee-7c37-43f5-99c0-89e2d6e91107)
#### Access all the Tasks which are in your day directly in "My Day". Tasks which are added to "My Day" and the Tasks with the current day's due date will appear here. Similarly access Tasks on Planned and Important sections. 
![Taskmaster-4_ My Day](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/cd08ee86-ca07-4a59-ae9d-04762b60bc76)
#### Session Timeout modal when the access token is expired.
![Taskmaster-8-Session Expired](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/e3749522-0958-4c46-a571-d094953098d5)
#### Edit User Details
![Taskmaster-5_Edit](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/c7a1f53d-f630-48be-b253-f5511d97718c)

![Taskmaster-6_Edit](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/1f836fe5-6b31-4d93-95eb-be2499099cca)
#### Error page whenever something wrong happens or the user tries to access a page which does not access.
![Taskmaster-7_Error](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/703d92e3-04d7-41f2-8aaf-c6a8f03e2340)
#### Secured Login and Signup
![Taskmaster-9-Login](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/cf9d168e-7ce4-4998-8b5e-10c05c6b4dad)

![Taskmaster-10_Signup](https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/ff067067-911f-49a6-b921-eac7fc4f1f7f)

## In Phone
<img src="https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/ccdb4130-8a20-43bf-bf25-5807f222c00f" alt="drawing" style="width:250px;"/>
<img src="https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/b4bc3c25-c83b-458b-a666-570612ef642a" alt="drawing" style="width:250px;"/>
<img src="https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/7555aa27-5f15-4e45-9b6a-d295dae5ee82" alt="drawing" style="width:250px;"/>

## In Medium Sized Screens (Tablets)
<img src="https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/657c9db5-80e9-4c77-ae4b-49ecfcdb4190" alt="drawing" style="width:400px;"/>
<img src="https://github.com/maanasb01/Taskmaster-Microsoft-Todo-PC-App-FullStack-Clone/assets/94924895/56afdb0f-ff7e-4795-b32f-27f52b1f500d" alt="drawing" style="width:400px;"/>




