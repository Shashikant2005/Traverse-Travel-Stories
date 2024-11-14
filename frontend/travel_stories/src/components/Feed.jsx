import React, { useEffect } from 'react'
import { Pagination } from "flowbite-react";
import { useState } from "react";
import axiosInstance from '../utils/axiosInstance';
import Emptycard from './Emptycard';
import { DayPicker } from 'react-day-picker';
import Travelstorycard from './Travelstorycard';
import Navbar2 from './Navbar2';
import { useNavigate } from 'react-router-dom';

function Feed() {
   
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [allFeedStories, setAllFeedStories] = useState([]);
    const [daterange, setdaterange] = useState({from:null,to:null})
    const [searchQuery, setsearchQuery] = useState('')

    const onPageChange = (page) => {
        setCurrentPage(page)
     }

     const handleDayClick =(day)=>{
        setdaterange(day)
        filetrStoriesByDate(day)
      }
   
   
    const onsearchstory =async (query)=>{
        try {
          
        const response = await axiosInstance.get(`/get-allfeed-stories?page=${page}`);
          if(response?.data?.stories){
             setFiltertype("search")
             allFeedStories(response.data.stories)
          }
          // toast("Search succesfull")
          console.log(allstories)
          
        } catch (error) {
          toast("Something went wrong")
        }
    }
  
  
    const handleclearsearch = ()=>{
      setFiltertype("")
      setallstories(getallstories())
    }
    const fetchStories = async (page) => {
        try {
            const response = await axiosInstance.get(`/get-allfeed-stories?page=${page}`);
            if (response?.data?.stories) {
                setAllFeedStories(prevStories => [...prevStories, ...response.data.stories]);
            }
        } catch (error) {
            toast("Unable to fetch stories");
        }
    };

    const handleviewstory =(story)=>{
         navigate('/view', { state: { story } })
    }

    useEffect(() => {
        fetchStories(currentPage); // Fetch stories when component mounts or when the page changes
    }, [currentPage]);


  return ( 
    <div>
       {/* <Navbar2  searchQuery={searchQuery} setsearchQuery={setsearchQuery} handlesearch={onsearchstory} handleclear={handleclearsearch}/> */}


      
                <div className='flex justify-center py-3'>
                    <h1 className='font-bold text-cyan-500 text-3xl'>
                        Search What You Want
                    </h1>
                </div>
       

             {/* <div>
                {allFeedStories.map((story, index) => (
                    <div key={index} className='p-3 border-b'>
                        <h2 className='text-lg font-semibold'>{story.title}</h2>
                        <p>{story.story}</p>
                    </div>
                ))}
            </div> */}

            {/* travelstory */}

     <div className='container mx-auto py-10'>
           <div className='flex gap-7 '>
              <div className='flex-1'>
                 {                  
                   allFeedStories.length>0 ?
                   (
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                       {
                        allFeedStories.map((item,ind)=>{
                          return (
                            <Travelstorycard key={ind}
                              id={item._id} 
                              imageurl={item?.imageurl}
                              title={item?.title}
                              story={item?.story }
                              date={item?.visitondate}
                              visitedlocation ={item?.visitedlocation}
                              isfavorite = {item?.isfavorite}  
                            //   onEdit={()=>handleedit(item)}    
                              onClick={()=>handleviewstory(item)} 
                              onFavoriteclick={()=>updateisfavorite(item)}
                            />
                          )
                        })
                       }
                   </div>
                   )
                    :
                    
                    (<div><Emptycard   message='Start Creating first travel story ! Click The ADD Button ' /></div>)
                    
                
                 }
              </div>
              <div className=' hidden md:block w-[320px]'>
                <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg '>
                   <div className='p-0'>
                    <DayPicker
                        captionLayout='dropdown-buttons'
                        mode="range"
                        selected={daterange}
                        onSelect={handleDayClick}
                        pagedNavigation
                      />
                   </div>
                </div>
              </div>
           </div>
       </div>


            {/* travelstory */}

        

           <footer>
                <div className="flex overflow-x-auto sm:justify-center fixed bottom-0 left-0 w-full bg-cyan-50 py-2 border-t">
                    <Pagination className='font-medium text-black' layout="navigation" currentPage={currentPage} totalPages={100} onPageChange={onPageChange} />
                </div>
            </footer>
    </div>
  )
}

export default Feed