import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { IoIosClose } from "react-icons/io";
import { MdClose } from 'react-icons/md';
function Seachbar({value,onChange,handlesearch,onclearsearch}) {
  return (
    <div className="flex   gap-3 items-center space-x-1  ">

        <div className='flex items-center '>       
          <input type='text' value={value} onChange={(e)=>onChange(e.target.value)} className='outline-none p-1 rounded-md w-40 md:w-44  ' placeholder=""/>
          {
          
            value && <button onClick={()=>onclearsearch()} className='' ><MdClose className='h-6 relative right-6'/></button>
          }       
       </div>
       <button onClick={()=>handlesearch()} className='bg-cyan-300 hover:bg-cyan-700 p-1 rounded-xl' type="submit">Search</button>
          
    </div>
  )
}

export default Seachbar