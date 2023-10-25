import React from "react";

function About() {
  return (
    <section className="bg-[#4F5295] w-5/6 mx-auto mt-10 mb-5 2xl:w-4/6 2xl:mt-32 rounded-lg text-white px-7 py-6 font-popins flex flex-col space-y-6 text-center ">
      <h1 className="text-4xl text-center">About</h1>

      <div className="flex flex-col space-y-6 leading-7">
        <section>
          Taskmaster is a clone of the 'Microsoft To-Do' PC application,
          developed as a fullstack MERN application.
        </section>

        <section>
          The backend leverages MongoDB with Mongoose for the database, Express
          with the Express-Validator library for the server, and implements
          bcryptJS for secure password storage and json-web-token for
          authentication. To enhance security, httpOnly cookies are utilized for
          authentication. Regular data updates are managed through the node-cron
          library.
        </section>

        <section>
          On the frontend, Taskmaster is powered by React, Vite, and Tailwind
          CSS, complemented by various other libraries for a seamless user
          experience. The primary focus during development was to meticulously
          replicate the UI of the Microsoft To-Do app, striving for a seamless
          resemblance. Furthermore, Taskmaster is designed to be fully
          responsive, making it accessible and functional on any device
          seemlessly.
        </section>
      </div>
    </section>
  );
}

export default About;
