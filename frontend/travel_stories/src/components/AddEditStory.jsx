import React, { useState } from 'react'
import { MdAdd, MdClose, MdDelete, MdUpdate } from 'react-icons/md'
import Dateselector from './Dateselector'
import Imageselector from './Imageselector'
import TagInput from './TagInput'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../utils/axiosInstance"
import moment from 'moment'
import uploadImage from '../utils/uloadImage'

function AddEditStory({
  storyInfo,
  type,
  onClose,
  getallstories
}) {

  const[visitdate,setvisitdate] = useState(storyInfo?.visitondate)
  const[storyimg ,setstoryimg] = useState(storyInfo?.imageurl || "")
  const [visitlocation, setvisitlocation] = useState( storyInfo?.visitedlocation ||[])
  const [story, setstory] = useState(storyInfo?.story || "")
  const [title, settitle] = useState(storyInfo?.title || "")


// Update Travel story

const updateTravelstory =async ()=>{
       console.log("Update hit")
       const storyid = storyInfo._id;
      try {
        let imgurl = "";

        let postdata ={
          title:title,
          story:story,
          visitedlocation:visitlocation,
          visitondate:visitdate ? moment(visitdate).valueOf() : moment().valueOf(),
          imageurl:storyInfo?.imageurl || ""
        }

       console.log("Start")

        if(typeof storyimg === "object"){
           const imgUploades = await uploadImage(storyimg)
          imgurl = imgUploades.imageUrl || ""
        }
         console.log("end")
  
        // postdata={
        //   ...postdata,
        //   imageurl:imgurl
        // }
        
        postdata ={
          title:title,
          story:story,
          visitedlocation:visitlocation,
          visitondate:visitdate ? moment(visitdate).valueOf() : moment().valueOf(),
          imageurl:imgurl || ""
        }

        
        console.log(imgurl)
        

        const response = await axiosInstance.put("/edit-story/" +storyid,postdata)
    
        if(response?.data?.story){  
        toast("Story Updated Successfully");
        onClose()
        }
      
        setTimeout(()=>{
          getallstories()
        },2000)

    } catch (error) {
      toast("Failed to Update Story")
    }

}


// Add new Travel story

const addnewTravelstory = async ()=>{
     
  try {
       let imgurl = "";
       
       // Upload img if it is present
       if(storyimg){
        const imgUploades = await uploadImage(storyimg)
        imgurl = imgUploades.imageUrl || ""
       }

       const response = await axiosInstance.post("/add-travel-story",{
        title:title,
        story:story,
        visitedlocation:visitlocation,
        visitondate:visitdate ? moment(visitdate).valueOf() : moment().valueOf(),
        imageurl:imgurl || ""
       })
       
    
       if(response?.data?.story){  
        toast("Story added Successfully");
        onClose()
       }
     
       setTimeout(()=>{
          getallstories()
       },2000)

  } catch (error) {
      toast("Failed to Add Story")
  }

}



// Handle submit event

   const handleAddOrUpdateClick=()=>{
    console.log("input data",{story,title,visitdate,visitlocation,storyimg})
     
      if(!visitdate || !story || !storyimg || !title  || !visitlocation){
        toast("add all Fields")
        // onClose()
        return
      }


      if(type==="edit"){
        updateTravelstory()
      }
      else{
          addnewTravelstory()
      }
   }

 const handleDeleteImg = async()=>{
     
      // const deletedImages = await axiosInstance.delete("/delete-image",{
      //   params:{
      //     imageurl:storyInfo.imageurl,
      //   },
      // });

      // if(deletedImages.data){
      //   const storyId = storyInfo._id

      //   const postdata = {
      //     title,
      //     story,
      //     visitedlocation:visitlocation,
      //     visitondate:moment().valueOf(),
      //     imageurl:""
      //   }
      //   const response = await axiosInstance.put("/edit-story/"+storyId,postdata)
      //   setstoryimg(null)
      // }

   }

  return (
    <div className='relative'>
      <ToastContainer/>
         {/* <button className='btn-small btn-delete ' onClick={onClose}>
                        <MdDelete className='text-lg'/> DELETE
                     </button> */}
        <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-700'>
                {type==="add" ? "Add Story":"Update Story"}
            </h5>

            <div >
               <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg'>
                { type==='add'? (<button className='btn-small' onClick={()=>{handleAddOrUpdateClick()}}>
                    <MdAdd className='text-lg' /> Add Story
                  </button> ): (<>

                     <button className='btn-small' onClick={()=>handleAddOrUpdateClick()}>
                       <MdUpdate className='text-lg'/> UPDATE STORY
                     </button>


                   </>)}

                  <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400'/>
                  </button>
             </div>
          </div>

        </div>
       

       <div>
             <div className='flex-1 flex flex-col gap-2 pt-4'>
                <label  className='input-label'>TITLE</label>
                <input value={title} onChange={(e)=>settitle(e.target.value)} placeholder='A day at Grat Wall'  type='text' className='text-2xl text-slate-950 outline-none'/>
                
                <div className='my-3'>
                    <Dateselector date={visitdate} setdate={setvisitdate}/>
                </div>

                <Imageselector
                   image={storyimg} setimage={setstoryimg} handleDeleteImg={handleDeleteImg}
                />

                <div className='flex flex-col gap-2 mt-4'>
                     <label className='input-label'>STORY</label>
                     <textarea type='text' className='text-sm border-none text-slate-950 bg-slate-50 rounded'
                        placeholder='Your Story'
                        rows={10}
                        value={story}
                        onChange={(e)=>setstory(e.target.value)}
                     />
                </div>

                <div className='pt-3'>
                  <label htmlFor="" className='input-label'>VISITED LOCATION</label>
                  <TagInput tags={visitlocation} settags={setvisitlocation} />
                </div>
             </div>
       </div>
    </div>
  )
}

export default AddEditStory