import axiosInstance from "./axiosInstance"

async function uploadimage(file){
        
    const formdata = new FormData()
    formdata.append("image",file)

    const response = await axiosInstance.post("/image-upload",formdata,{
    headers:{
        'Content-Type':"multipart/form-data"
    },
    })

    return response.data
}

export default {uploadimage}