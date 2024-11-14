import moment from 'moment'
import React from 'react'
import { MdOutlineClose } from 'react-icons/md'

function FilterInfoTitle({filtertype,filterdates,onClear}) {

  const DateRangeChip = ({date})=>{
     const startdate = date?.from ? moment(date?.from).format("Do MMM YYYY") : "N/A"
     const enddate = date?.to ?  moment(date?.to).format("Do MMM YYYY") : "N/A"
     return (
        <div className='flex items-center gap-2 bg-slate-100 px-3 py-2 rounded'>
            <p className='text-xs font-medium'>
                {startdate} - {enddate}
            </p>
            <button onClick={onClear}>
                <MdOutlineClose/>
            </button>
        </div>
     )
  }
  return (
  filtertype &&  <div className='mt-5 mx-2'>
        {
            filtertype ==="search" ? 
            (
              <h3 className='text-lg font-medium'>Search Results</h3>
            ):
            (
              <div className='flex items-center gap-2'>
                 <h3 className='text-lg font-medium'>Travel Story From</h3>
                 <DateRangeChip date={filterdates}/>
              </div>
            )
        }
    </div>
  )
}

export default FilterInfoTitle