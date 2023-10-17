

export default function Navbar(){

    return(
      <header className="">
    <div className="mx-auto flex justify-between p-3 items-center">
      <a className="mb-0 cursor-pointer">
        <span className="ml-3 text-2xl md:text-4xl font-bold text-gray-100">Taskmaster</span>
      </a>
      <nav className="ml-auto text-base">
        <a className="mr-3 md:mr-5 text-white font-medium text-sm md:text-lg cursor-pointer">Home</a>
        <a className="mr-3 md:mr-5 text-white font-medium text-sm md:text-lg cursor-pointer">Log In</a>
        <a className="mr-3 md:mr-5 text-white font-medium text-sm md:text-lg cursor-pointer">Sign Up</a>
      </nav>
      {/* <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-sm md:text-base ">Get Started
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </button> */}
    </div>
  </header>
    )
  }
  