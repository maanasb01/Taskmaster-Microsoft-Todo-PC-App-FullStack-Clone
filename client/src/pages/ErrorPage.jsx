import { Link } from "react-router-dom";

function ErrorPage() {
    return (
      <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col space-y-8 items-center justify-center bg-violet-300">
        <h1 className="font-extrabold text-7xl">Oops!</h1>
        <p>
          Something went wrong or you are trying to access page which does not exists!
        </p>
        <Link to={"/"}><button className="px-4 py-2 bg-violet-900 hover:bg-violet-800 text-gray-200 rounded-lg">Return to Home</button></Link>

      </div>
    );
  }
  
  export default ErrorPage;