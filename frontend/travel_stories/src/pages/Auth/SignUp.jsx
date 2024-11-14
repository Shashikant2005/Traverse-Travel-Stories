import React, { useState } from 'react'
import { HiEyeSlash } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../utils/axiosInstance';

function SignUp() {
    const navigation = useNavigate()
    const[passwordshow,setpasswordshow] = useState(true)
   const [email, setemail] = useState();
    const [password,setpassword]= useState()
    const [fullname,setfullname] = useState()
    const[error,setError] = useState()
    
    const isValidEmail=(email) =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

 
    const handleshow=()=>{
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
          setError("")

          try {
            const response = await axiosInstance.post("/create-account",{
              fullname:fullname,
              email:email,
              password:password
            })

            if(response.data && response.data.user && response.data.user.token){
                localStorage.setItem("token",response.data.user.token)
                toast("Account creaetd Succesfull")
                navigation("/login")
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
    
    <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <ToastContainer/>
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          Flowbite    
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>
              <form onSubmit={handleForm} class="space-y-4 md:space-y-6" action="#">
              <div>
                      <label for="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Fullname</label>
                      <input onChange={(e)=>setfullname(e.target.value)}  type="text" name="fullname" id="fullname" placeholder="abc xyz lmn" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
                  <div>
                      <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input onChange={(e)=>setemail(e.target.value)} type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                      <div className='text-red-600'>{error?"Enter valid Email":""}</div>
                  </div>
                  <div>
                      <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input onChange={(e)=>setpassword(e.target.value)} type={passwordshow ?"text":"password"} name="password" id="password" placeholder={passwordshow ? "password":"••••••••"} class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                      <div className='text-red-600'>{!password?"Enter Password":""}</div>
                  </div>
                 
                  <div class="flex items-start">
                      <div className="flex items-center h-5">
                      <HiEyeSlash onClick={()=>handleshow()} className=""/>
                        </div>
                      <div class="ml-3 text-sm">
                        <label for="terms" class="font-light text-gray-500 dark:text-gray-300">{passwordshow?"hide password":"show password"} </label>
                      </div>
                  </div>
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <div onClick={()=>navigation("/login")} class="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">Login here</div>
                  </p>
{/* 
                  {fullname}
                  {email}
                  {password} */}
                
              </form>
          </div>
      </div>
  </div>
</section>
  )
}

export default SignUp