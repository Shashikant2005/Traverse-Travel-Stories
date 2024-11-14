import React from 'react'
import moment from "moment/moment"
import { HiOutlineHeart } from "react-icons/hi2";
function Travelstorycard({id,imageurl,story,title,date , visitedlocation,isfavorite,onEdit,onFavoriteclick,onClick}) {
  return (
    <div className='border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer'>
        <img onClick={onClick} src={imageurl} alt={title} className='w-full h-56 object-cover rounded-lg'></img>
       
         <button className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4 ' onClick={()=>onFavoriteclick()}><HiOutlineHeart className={`icon-btn ${isfavorite ? "text-red-600":"text-white"}`}/></button>
         
        <div className='p-4' onClick={onClick}>
            <div className='flex items-center gap-3'>
                <div className='flex-1'>
                    <h6 className='text-sm font-medium mb-1'>{title}</h6>
                    <span>
                        {date ? moment(date).format("Do MM yyyy") : "_"}
                    </span>
                </div>
            </div>

            <p className='text-xs text-slate-600 mt-2'>{story?.slice(0,60)}</p>
            
            <div className='inline-flex items-center gap-2 text[13px]  text-cyan-600 bg-cyan-200 rounded-md mt-3 px-2 py-1'>

            {visitedlocation.map((item,index)=>
              visitedlocation.length == index+1 ? `${item}`:  `${item}`
            )} 
            </div>
        </div>
    </div>
  )
}

export default Travelstorycard