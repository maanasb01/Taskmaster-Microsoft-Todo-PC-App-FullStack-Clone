import LandingPage from "./pages/LandingPage";
import TodoApp from "./pages/TodoApp";
import Layout from "./Layout";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  BrowserRouter,
  Router
} from "react-router-dom";
import Login from "./components/No Auth Components/Login";
import Signup from "./components/No Auth Components/Signup";
import ErrorPage from "./components/ErrorPage";
import Home from "./components/No Auth Components/Home";
import { AuthProvider, useAuth } from "./contexts/AuthContext";





function App() {


  return (
    
      <AuthProvider>
        <Layout />
      </AuthProvider>

  );
}

export default App;
