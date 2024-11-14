

 async function cloudinary_upload(file){


const data =  new FormData()
data.append("file",file)
data.append("upload_preset","mypreset")

const res = await fetch(
  `https://api.cloudinary.com/v1_1/dg30nx8hr/image/upload`,
  {
    method:"POST",
    body:data
  }
)

if (!res.ok) {
  throw new Error(`Upload failed: ${res.statusText}`);
}

const responseData = await res.json();
// console.log("File upload successful:", responseData);
const downloadUrl = responseData.secure_url;

return downloadUrl
}

module.exports=cloudinary_upload