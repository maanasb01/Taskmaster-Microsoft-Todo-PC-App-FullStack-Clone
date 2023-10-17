import { Input,Button } from "@material-tailwind/react";

export default function Login() {


    return(
      <>
      <div className="h-full flex flex-col items-center justify-center">
        <p className="font-popins text-4xl md:text-5xl font-semibold text-gray-200 mb-14 mt-20">LogIn</p>
        {/* <p className="text-red-500 ">*Error: Email Not Found</p> */}
        <form action="">
          
          <div className="flex flex-col space-y-8 items-center">
            <Input variant="standard" label="Email" color="white" className="w-96 " />
            <Input type="password" variant="standard" label="Password" color="white" className="w-96 " />
            <a href="#buttons-with-link">
          <Button variant="gradient" color="white">Login</Button>
        </a>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-gray-200">New User?</p>
          <Button variant="gradient" color="" className="bg-gray-300">Register Here</Button>
        </div>
          </div>
        </form>
      </div>
      </>
    )
  }