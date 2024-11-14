
import React, { useEffect, useState } from 'react'
//import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Travelstorycard from '../../components/Travelstorycard';
import {MdAdd} from "react-icons/md"


import AddEditStory from '../../components/AddEditStory';
import Modal from "react-modal"
import ViewTravelStory from '../../components/ViewTravelStory';
import Emptycard from '../../components/Emptycard';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import moment from 'moment';
import FilterInfoTitle from '../../components/FilterInfoTitle';
import Navbar2 from '../../components/Navbar2';
function Home() {

  const navigate = useNavigate()
  const [userInfo,setUserinfo] = useState(null)
  const [allstories,setallstories] = useState([])
  const[openaddstory,setopenaddstory] = useState(false)
  const [searchQuery, setsearchQuery] = useState('')
  const [filtertype, setFiltertype] = useState()
  const [daterange, setdaterange] = useState({from:null,to:null})

  const [openAddEditModal , setOpenAddEditModal] = useState({
     isShown:false,
     type:"add",
     data:null,
  })


  const [openViewModal , setOpenViewModal] = useState({
    isShown:false,
    data:null,
 })
 
  // get user
  const getuserinfo = async()=>{

    try {
       
        const response = await axiosInstance.get('/get-user')
        if(response.data && response.data.user){
          setUserinfo(response?.data?.user)
        }
    } 
    catch (error) {
        if(error.response.status ===401)
          localStorage.clear();
         navigate('/login')
    }

  }

  //get all stories
  const getallstories = async()=>{ 
   
    try {
      const response = await axiosInstance.get('/get-all-stories')
      if(response?.data  && response?.data?.stories){
        setallstories(response?.data?.stories)
      }
      
    } 
    catch (error) {
        toast("unable to featch stories")
    }
   
  }

  // Handle Edit Story Click
  const handleedit =(data)=>{
     setOpenAddEditModal({isShown:true,type:"edit",data:data})
  }

  //handle travel story click
  const handleviewstory=(item)=>{
     setOpenViewModal({isShown:true,data:item})
  }

  // hadle update
  const updateisfavorite = async (story) => {
    const id = story._id;
    try {
      // Optimistically update the UI before server response
      setallstories((prevStories) =>
        prevStories.map((item) =>
          item._id === id ? { ...item, isfavorite: !item.isfavorite } : item
        )
      );

      const response = await axiosInstance.put(`/update-is-favorite/${id}`, {
        isfavorite: !story.isfavorite,
      });

      if (!response?.data?.story) {
        // Revert the change if the server response fails
        setallstories((prevStories) =>
          prevStories.map((item) =>
            item._id === id ? { ...item, isfavorite: story.isfavorite } : item
          )
        );
        throw new Error("Server failed to update");
      }

      toast("Story Update Succesfully")

      if(filtertype==="search"  && searchQuery){
        onsearchstory(searchQuery)
      }
      else if(filtertype === 'date'){
        filetrStoriesByDate(daterange)
      }
      else{
        getallstories()
      }
    } catch (error) {
      toast("Something went wrong");
    }
  };

  const deleteTravelStory =async (data)=>{

    const storyId = data?._id;
    console.log(storyId)

      const response = await axiosInstance.delete("/delete-story/"+storyId)

      if(response?.data  && !response?.data?.error){
        toast("Story deleted")
        setOpenViewModal({isShown:false,data})
      }

      setTimeout(()=>{
        getallstories()
      },1000)
  }


  const onsearchstory =async (query)=>{
      try {
        
        const response =await axiosInstance.get('/search',{
          params:{
            query
          }
        })

        if(response?.data?.stories){
           setFiltertype("search")
           setallstories(response.data.stories)
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


  // Handle Filetr Travel  Story By Date Range

const filetrStoriesByDate =async (day)=>{

  try {
    
  const startdate = day.from ? moment(day.from).valueOf() : null;
  const enddate = day.from ? moment(day.to).valueOf() : null;

  if(startdate  && enddate){
    const response = await axiosInstance.get('/travel-stories/filter',{
      params:{
        startdate,enddate
      }
    })

    if(response?.data?.stories){
        setFiltertype("date")
        setallstories(response?.data?.stories)
    }
  }


  } catch (error) {
    
  }

}


const resetfilter =()=>{
  setdaterange({from:null,to:null})
  setFiltertype("")
  getallstories()
}

  // Handle Date Range Select
  const handleDayClick =(day)=>{
    setdaterange(day)
    filetrStoriesByDate(day)
  }

  useEffect(()=>{
      getallstories()
      getuserinfo()
  },[])

 
  

  // useEffect(() => {
  //   console.log(allstories)
  // }, [allstories])
  
  return (
    <div>
      {/* <Navbar userinfo={userInfo} searchQuery={searchQuery} setsearchQuery={setsearchQuery} handlesearch={onsearchstory} handleclear={handleclearsearch}/> */}
      <Navbar2 setUserinfo={setUserinfo}  userinfo={userInfo} searchQuery={searchQuery} setsearchQuery={setsearchQuery} handlesearch={onsearchstory} handleclear={handleclearsearch}/>
      <ToastContainer />

         <FilterInfoTitle
           filtertype={filtertype}
           filterdates={daterange}
           onClear={()=>resetfilter()}
         />
         <div className='mx-auto flex justify-center items-center'>
            <div className='  md:hidden block '>
                        <DayPicker
                            captionLayout='dropdown-buttons'
                            mode="range"
                            selected={daterange}
                            onSelect={handleDayClick}
                            pagedNavigation
                          />
              </div>
         </div>
       <div className='container mx-auto py-10'>
           <div className='flex gap-7 '>
              <div className='flex-1'>
                 {                  
                   allstories.length>0 ?
                   (
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                       {
                        allstories.map((item,ind)=>{
                          return (
                            <Travelstorycard key={ind}
                              id={item._id} 
                              imageurl={item?.imageurl}
                              title={item?.title}
                              story={item?.story }
                              date={item?.visitondate}
                              visitedlocation ={item?.visitedlocation}
                              isfavorite = {item?.isfavorite}  
                              onEdit={()=>handleedit(item)}    
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

    

    {/* Travel story Addition */}

    <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={()=>{}}
        style={
          {
            overlay:{
              backgroundColor:"rgb(0,0,0,0.2)",
              zIndex:999,
            }
          }
        }

        appElement={document.getElementById("root")}
        className="model-box"
    >  
       <AddEditStory 
       type={openAddEditModal.type}
       storyInfo={openAddEditModal.data}
       onClose={()=>setOpenAddEditModal({isShown:false,type:"add",data:null})}
       getallstories={getallstories}/> 
    </Modal>

    {/* view story model */}

    <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={()=>{}}
        style={
          {
            overlay:{
              backgroundColor:"rgb(0,0,0,0.2)",
              zIndex:999,
            }
          }
        }

        appElement={document.getElementById("root")}
        className="model-box"
    > 
      <ViewTravelStory type={openViewModal.isShown}
          storyInfo={openViewModal.data || null} 
          onClose={()=>setOpenViewModal({isShown:false,data:null})}
          onDeleteClick={()=>deleteTravelStory(openViewModal.data || null)}
          onEditClick={()=>{
             setOpenViewModal((prev)=>({...prev,isShown:false}))
             handleedit(openViewModal.data || null)
          }}

      />
     </Modal>


       <button className='h-16 w-16 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-300 fixed right-10 bottom-10' onClick={()=>setOpenAddEditModal({isShown:true,type:"add",data:null})}>
          <MdAdd/>
       </button>

      

    </div>
  )
}

export default Home