import moment from 'moment'
import React, { useState } from 'react'
import { MdClose, MdOutlineDateRange } from 'react-icons/md'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function Dateselector({date , setdate}) {

    const [openDatePicker, setOpenDatePicker] = useState(false)
  return (
    <div>
        <button className=' inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/20 rounded px-2 py-1 cursor-pointer' 
        onClick={()=>setOpenDatePicker(true)}>
           <MdOutlineDateRange/>
            {
                date? moment(date).format("Do MMM YYYY"):moment().format("Do MMM YYYY")
            }
        </button>

       
       { openDatePicker && <div className='overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9 mt-2'>
            <button className='w-10 h-10 rounded-full  flex justify-center items-center bg-sky-100 hover:bg-sky-400 absolute top-2 right-2' onClick={()=>setOpenDatePicker(false)}>
               <MdClose className='text-xl text-sky-600 '/>
            </button>
            <DayPicker 
              captionLayout='dropdown-buttons'
              mode='single'
              selected={date}
              onSelect={setdate}
              pagedNavigation
              />
         </div>}
           
       
    </div>
  )
}

export default Dateselector