import axiosInstance from "./axiosInstance"


const uploadImage=async(imagefile)=>{
   const formdata = new FormData()
   formdata.append("image",imagefile)

   try {
    
    const response = await axiosInstance.post("/upload-image",formdata,{
        headers:{
            "Content-Type":"multipart/form-data"
        },
    })
    // console.log(response.data)
    return response.data
   } catch (error) {
      console.log("Error uploading image")
   }
}

export default uploadImage