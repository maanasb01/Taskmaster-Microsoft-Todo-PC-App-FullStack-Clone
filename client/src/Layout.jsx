import LandingPage from "./pages/LandingPage";
import TodoApp from "./pages/TodoApp";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";
import Login from "./components/No Auth Components/Login";
import Signup from "./components/No Auth Components/Signup";
import ErrorPage from "./components/ErrorPage";
import Home from "./components/No Auth Components/Home";
import {useAuth } from "./contexts/AuthContext";
const host = "http://localhost:3000";



export default function Layout() {
  const {user, setUser} = useAuth();

  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={!user?<LandingPage />: <Navigate to={"/app"} replace={true}/> }   errorElement={<ErrorPage />}>
          <Route path="" element={<Home />} />
          {/* <Route path="about" element={<About />} /> */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route path="/app" element={user?<TodoApp />: <Navigate to={"/login"} replace={true}/> } errorElement={<ErrorPage/>}>

        </Route>
        
      </>
    )
  );



  return (

    <RouterProvider router={router} />

  );
}


