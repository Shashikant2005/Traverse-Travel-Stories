import React, { useEffect, useRef, useState } from 'react'
import {FaRegFileImage} from "react-icons/fa"
import { MdDeleteOutline } from 'react-icons/md'
function Imageselector({image,setimage,handleDeleteImg}) {

    const inputRef = useRef(null)
    const [previewurl , setpreviewurl] = useState()

    const handleimagechange =(event)=>{
       const file = event.target.files[0];
       if(file){
        setimage(file)
       }
    }

  const  handleRemoveImage =()=>{
      setimage(null)
      handleDeleteImg()
  }

    const onChooseFile =()=>{
         inputRef.current.click()
    }

    useEffect(() => {
      if(typeof image ==='string'){
          setpreviewurl(image)
      }
      else if(image){
         setpreviewurl(URL.createObjectURL(image))
      }
      else{
         setpreviewurl(null)
      }

      return ()=>{
         if(previewurl  && typeof previewurl === 'string' && !image){
          URL.revokeObjectURL(previewurl)
         }
      }
    
    }, [image])
    

  return (
    <div>
        <input type='file'
          accept='image/*'
          ref={inputRef}
          onChange={handleimagechange}
          className='hidden'
        />

     {  !image ? <button className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 roun border border-slate-200/50' onClick={()=>{onChooseFile()}}>
             <div className='w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100'>
                <FaRegFileImage className='text-xl text-cyan-500'/>
             </div>
             <p className='text-sm text-slate-500'>Browse Image file to Upload</p>
        </button>
         : 
         
         <div className='w-full relative'>
           <img src={previewurl} alt='selected' className='w-full h-[300px] object-cover rounded-lg'/>
           <button className='btn-small btn-delete absolute top-2 right-2' onClick={()=>handleRemoveImage()}>
              <MdDeleteOutline className='text-lg'/>
           </button>
         </div>
        
    }
    </div>
  )
}

export default Imageselector