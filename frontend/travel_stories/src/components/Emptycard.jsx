import React from 'react'
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";

function Emptycard({message}) {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
           <HiOutlineArchiveBoxXMark className='w-24 h-72'/>
        <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
           {message}
        </p>
    </div>
  )
}

export default Emptycard