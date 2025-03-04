
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TEInput, TERipple } from "tw-elements-react";
import { HiEyeSlash } from "react-icons/hi2";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {

    const[passwordshow,setpasswordshow] = useState(true)
    const [email, setemail] = useState();
    const [password,setpassword]= useState()
    const[error,setError] = useState()
    const[newalert,setnewalert] = useState()
    const navigate = useNavigate()
    
    const isValidEmail=(email) =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
        function handleshow(){
            if(passwordshow==true) setpasswordshow(false)
            else setpasswordshow(true)   
        }

       const handleForm=async(e)=>{
           e.preventDefault()
           if(!isValidEmail(email)){
              setemail("")
              setError("Enter valid email")
              return
           }

           if(!password){
            setError("Enter password")
            return
          }
          console.log(email,password)
          setError("")

          //Login Api Call
        
          try {
                const response = await axiosInstance.post("/login",{
                    email:email,
                    password:password
                })

                if(response.data  && response.data.accessToken){
                    localStorage.setItem("token",response.data.accessToken)
                    // toast("Login Succesfull")
                    navigate("/dashboard")
                }
                else{
                    toast(response.data && response.data.message)
                }
          }
           catch (error) {
              
            if(error.response && error.response.data  && error.response.data.message){
                toast(error.response.data.message)
            }
            else{
                toast("Unexpected thing happend")
            }
          }
    
           
           
        }
  return (
    <section class="bg-gray-100 dark:bg-gray-900">
       
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <ToastContainer />
        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
            Flowbite    
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login to your account
                </h1>
                <form class="space-y-4 md:space-y-6" action="#" onSubmit={handleForm} >
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input onChange={(event)=>setemail(event.target.value)} type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                        <div className="text-red-600 mt-2">{error ?"enter valid email":""}</div>
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                         <input onChange={(event)=>setpassword(event.target.value)} type={passwordshow ?"text":"password"} name="password" id="password" placeholder={passwordshow ? "password":"••••••••"} class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                        <div className='text-red-600 mt-2'>{!password?"Enter Password":""}</div>  
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                            <HiEyeSlash onClick={()=>handleshow()} className=""/>

                            </div>
                            <div class="ml-3 text-sm">
                              <label for="remember" class="text-gray-500 dark:text-gray-300">{passwordshow?"hide password":"Show password"}</label>
                            </div>
                        </div>
                        <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 hidden">Forgot password?</a>
                    </div>
                    <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet? <Link to={'/signup'} class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                    </p>
                </form>

                {/* <div>{email}</div>
                <div>{password}</div> */}

               
            </div>
        </div>
    </div>
  </section>
  );
}