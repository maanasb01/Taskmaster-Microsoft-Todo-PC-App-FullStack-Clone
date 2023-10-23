import React from 'react'
import TodoApp from './TodoApp'
import Profile from '../components/profile/Profile'
import { Outlet,Navigate } from 'react-router-dom'
import { AuthProvider,useAuth } from '../contexts/AuthContext'
import Navbar from '../components/No Auth Components/Navbar'



function AppPage() {
    const {user} = useAuth();
    if(!user){
        return <Navigate to={"/login"} replace={true}/>
    }
    return (
        <>
        <Outlet />
        </>
    )
}

export default AppPage
