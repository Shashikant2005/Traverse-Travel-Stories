import React, { useEffect, useState } from 'react';
import { NavLink,Link } from 'react-router-dom';
import { HiMiniUserCircle } from "react-icons/hi2";
import Logo from "../assets/CourseGenLogo.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Seachbar from './Seachbar';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';
import { useLocation } from 'react-router-dom';

const Navbar2 = ({setUserinfo, userinfo,handlesearch ,searchQuery,setsearchQuery,onSeachNote,handleclear}) => {
   
    const navigation = useNavigate()
    const[User,setUser] = useState()
    const location = useLocation();
  
    // Get the full path from the URL (e.g., '/dashboard')
    const fullPath = location.pathname;

    const getUser = async()=>{

        try {
           
            const response = await axiosInstance.get('/get-user')
            if(response.data && response.data.user){
                setUser (response?.data?.user)
            }
        } 
        catch (error) {
            if(error?.response?.status ===401){
                // localStorage.clear();
                // navigation('/login')
                console.log("Error")
            }
             

        }
    
      }

      useEffect(() => {
        if (!User) {
          getUser();
        }
      }, [User]); 
  
   

    //change

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate()
     const handleAvatarClick = () => {
       setIsDialogOpen(true);
     };
   
     const closeDialog = () => {
       setIsDialogOpen(false);
     };
   
     const isToken = localStorage.getItem("token")
     const logout = ()=>{
       localStorage.removeItem("token");
       navigate('/')
     }
   
     const onsearch = ()=>{
         if(searchQuery){
           handlesearch (searchQuery)
         }
     }
   
     const onclearsearch = ()=>{
          handleclear()
         setsearchQuery("")
     }  

    // change

   const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className=" p-3 bg-cyan-50">
            <div className="flex items-center justify-between  text-blue-400">
                <h2 className="text-cyan-600 text-3xl font-bold font-sans ml-2">Traverse</h2>
                <div className="hidden md:flex gap-3 items-center space-x-4 mx-5">
                    <div className="text-black ">
                        <Seachbar
                                value = {searchQuery}
                                onChange={setsearchQuery}
                                handlesearch={onsearch}
                                onclearsearch={onclearsearch}
                                />
                    </div>
                    <Link to="/" className={`text-black ${fullPath==="/" && 'bg-cyan-400 rounded-md p-1'}  `}>Home</Link>
                    <Link to="/dashboard" className={`text-black ${fullPath==="/dashboard" && 'bg-cyan-400 rounded-md p-1'}  `}>dashboard</Link>
                    <NavLink to="/feed" className={`text-black ${fullPath==="/feed" && 'bg-cyan-400 rounded-md p-1'}  `} >Feed</NavLink>
                    <div  className="text-black ">
                    { isToken &&  
                        <DropdownMenu className=' '  open={!isOpen && isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DropdownMenuTrigger  asChild>
                            <Avatar  onClick={handleAvatarClick}>
                                <AvatarImage src="" />
                                <AvatarFallback className='bg-cyan-300 border border-black  text-2xl' >{User?.fullname?.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className=' bg-cyan-400' align="end"> {/* Align dropdown to the right */}
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{User?.fullname}</DropdownMenuItem>
                            <DropdownMenuItem>{User?.email}</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>logout()}>Log Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}

                    </div>
                </div>


                <button    className="md:hidden text-black focus:outline-none" onClick={toggleMenu}>
                    {isOpen ? '✖' : '☰'}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden mt-2">
                    
                    <div className="block text-black py-2 hover:underline">
                        <Seachbar
                                value = {searchQuery}
                                onChange={setsearchQuery}
                                handlesearch={onsearch}
                                onclearsearch={onclearsearch}
                                />
                    
                    </div>
                    <NavLink to="/" className="block text-black py-2 hover:underline">Home</NavLink>
                    <Link to="/dashboard" className="text-black ">dashboard</Link>
                    <NavLink to="/feed" className="block text-black py-2 hover:underline">Feed</NavLink>
                    <div className="block text-black py-2 hover:underline">
                        { isToken &&  
                            <DropdownMenu className=''  open={ isOpen && isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DropdownMenuTrigger  asChild>
                                <Avatar  onClick={handleAvatarClick}>
                                    <AvatarImage src="" />
                                    <AvatarFallback className='bg-cyan-300 border border-black  text-2xl' >{User?.fullname?.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className=' bg-cyan-400' align="end"> {/* Align dropdown to the right */}
                                <DropdownMenuLabel>My Account <MdClose className='text-black' onClick={()=>closeDialog()}/> </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{User?.fullname}</DropdownMenuItem>
                                <DropdownMenuItem>{User?.email}</DropdownMenuItem>
                                <DropdownMenuItem onClick={()=>logout()}>Log Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>}
                    </div>
                    {/* <NavLink to="/contact" className="block text-black py-2 hover:underline">Contact</NavLink> */}
               
                </div>
            )}
        </nav>
    );
};

export default Navbar2;
