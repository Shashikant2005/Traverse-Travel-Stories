import moment from 'moment'
import React from 'react'
import { GrMapLocation } from 'react-icons/gr'
import { MdAdd, MdClose, MdUpdate } from 'react-icons/md'

function ViewTravelStory({storyInfo,type,onClose,onEditClick,onDeleteClick}) {
  return (
    <div className='relative'>
        <div className='flex items-center justify-end'>

            <div >
               <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg'>

                 <button className='btn-small' onClick={()=>onEditClick()}>
                    <MdAdd className='text-lg' /> Update Story
                  </button>

                     <button className='btn-small btn-delete' onClick={()=>onDeleteClick()}>
                       <MdUpdate className='text-lg'/> DeleteStory
                     </button>


                  <button className='' onClick={()=>onClose()}>
                    <MdClose className='text-xl text-slate-400'/>
                  </button>
               </div> 
            </div>
        </div>
       

       {/* Show Story */}
        <div>
            <div className='flex-1 flex flex-col gap-2 py-4'>
                <h1 className='text-2xl text-slate-950'>
                    { storyInfo  && storyInfo.title}
                </h1>

                <div className='flex items-center justify-between gap-3 '>
                    <span className='text-xs text-slate-500'>
                        {storyInfo  && moment(storyInfo.visitondate).format("Do MMM YYYY")}
                    </span>

                    <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 border-y-cyan-200/40 rounded px-2 py-1'>
                        <GrMapLocation className='text-xs'/>
                        {storyInfo && storyInfo.visitedlocation.map((item,index)=>{
                            return (
                                
                                <div>
                                 {
                                      storyInfo.visitedlocation.length == index+1 ? `${item}` : `${item}`
                                 }
                                </div>      
                            )
                        })}
                    </div>

                </div>

                <img
                  src={storyInfo && storyInfo.imageurl}
                  alt='Selected'
                  className='w-full h-[300px] object-cover rounded-lg'
                />

                <div className='mt-4'>
                    <p className='text-xs text-slate-950 leading-6 text-justify whitespace-pre-line'>{storyInfo && storyInfo.story}</p>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default ViewTravelStory