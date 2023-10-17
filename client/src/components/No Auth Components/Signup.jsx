import { Input,Button } from "@material-tailwind/react";


export default function Signup() {


    return(
      <>
      <div className="h-full flex flex-col items-center justify-center">
        <p className="font-popins text-4xl md:text-4xl font-semibold text-gray-200 mb-8 mt-2">Sign Up</p>
        {/* <p className="text-red-500 ">*Error: Email Not Found</p> */}
        <form action="">
          
          <div className="flex flex-col space-y-6 items-center">
            <Input variant="standard" label="Full Name" color="white" className="w-96 " />
            <Input variant="standard" label="Email" color="white" className="w-96 " />
            <Input type="password" variant="standard" label="Password" color="white" className="w-96 " />
            <Input type="password" variant="standard" label="Confirm Password" color="white" className="w-96 " />
            <a href="#buttons-with-link">
          <Button variant="gradient" color="white">Register</Button>
        </a>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-gray-200">Aready Registed ?</p>
          <Button variant="gradient" color="" className="bg-gray-300">Login Here</Button>
        </div>
          </div>
        </form>
      </div>
      </>
    )
  }