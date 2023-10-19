import { createContext, useContext, useEffect, useState} from "react";
import { AUTH_TKN } from "../authToken";
import { redirect } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
const host = "http://localhost:3000";


const AuthContext =  createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    // const navigate = useNavigate();
    
   async function getUser(){
        
        try {
            const res = await fetch(`${host}/user`,{
                method:"GET",
                credentials: 'include',
            });
            const data = await res.json();
            if(data.user){
                setUser(data.user);
                return;
                
            }else{
                setUser(null)
            }
            
        } catch (error) {
            console.error(error.message);
            
        }
    };
    useEffect(()=>{

        getUser();
        console.log("inside auth provider")

    },[]);


    // async function logout(){

    //     try {
    //         const response = await fetch(`${host}/auth/logout`,{
    //    credentials: 'include',
    // });
    //         const data = await response.json();
          
    //         if (response.ok) {
                
    //             if(data.success){

    //                 setUser(null)
    //                 navigate("/login",{replace: true});
    //             }

    //           } else {
    //             console.error(data.message);
                
    //           }
    //         } catch (error) {
    //           console.error("An error occurred while logging out:", error);
    //         }
    //       };




    return (
        <AuthContext.Provider value={{user,setUser, getUser}}>
            {children}
        </AuthContext.Provider>
    )
}