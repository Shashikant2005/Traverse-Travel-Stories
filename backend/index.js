// require(".env").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const User = require("./models/user.model");
const TravelstorySchema = require("./models/travelstory.model");
const jwt = require("jsonwebtoken");
const { authenticationtoken } = require("./utilities");
const upload = require("./multer");
const path = require("path");
const fs = require("fs");
// const cloudinary_upload = require("./cloudinary");

mongoose.connect("mongodb://localhost:27017/travelstories")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB", err));

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/home", (req, res) => {
    res.status(200).json({ m: "hello" });
});


// create Account
app.post('/create-account', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        fullname,
        email,
        password: hashedPassword
    });

    await newUser.save();
    
    const accessToken = jwt.sign(
        { userId: newUser._id },
        "72657bf86a2286ed1b6038194c0af75866b6a6d4b2479ae5c3464f97957658f8987d767b10498488695eff6d579d83fc35ff52d6f965068428a528949f8aae42",
        { expiresIn: "72h" }
    );

    return res.status(201).json({
        error: false,
        user: {
            fullname: newUser.fullname,
            message: "Registration successful",
            token: accessToken
        }
    });
});


// Login 
app.post('/login', async (req, res) =>{

    const { email , password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Email and password required"})
    }

    const loggeduser = await User.findOne({email})

    if(!loggeduser){
        return res.status(400).json({message:"Please sign up first "})
    }


    const userpassword =await bcrypt.compare(password,loggeduser.password)

    if(!userpassword){
        return res.status(400).json({  error:true,message:"Wrong cradentials"})
   
    }

    const accessToken = jwt.sign(
        { userId: loggeduser._id },
        "72657bf86a2286ed1b6038194c0af75866b6a6d4b2479ae5c3464f97957658f8987d767b10498488695eff6d579d83fc35ff52d6f965068428a528949f8aae42",
        { expiresIn: "72h" }
    );

    return res.status(200).json(
        { 
            error:false,  
            message:"Login succesfull ",
            user:{fullname:loggeduser.fullname , email :loggeduser.email},
            accessToken
        }
    )
   
})


// getuser
app.get('/get-user',authenticationtoken,async (req,res)=>{
    
    const {userId} = req.user;
    const isUser = await User.findOne({_id:userId})

    if(!isUser) return res.sendStatus(401)
    
        return res.json(
            {
                user:isUser,
                message:"",            
            }
        )
})


//add travel stories

app.post('/add-travel-story',authenticationtoken,async (req,res)=>{
    
   const {title ,story ,visitedlocation,imageurl,visitondate } = req.body
   const {userId} = req.user;
    if (!title || !story || !visitedlocation || !imageurl || !visitondate ){
        return res.status(400).json({error:true,message:"add all fields"})
    }
  
    const parsevisiteddate = new Date(parseInt(visitondate))
    
    try {
        
        const travelStory = new TravelstorySchema({
            title,
            story,
            visitedlocation,
            userId,
            imageurl,
            visitondate:parsevisiteddate
        })

        await travelStory.save();
        console.log("Svaed")
        return res.status(200).json({story:travelStory,message:"story added succesfullly"})       
    } 
    catch (error) {
        return res.status(400).json({error:true,message:error.message})
    }
    
})


// get all travel stories
app.get('/get-all-stories',authenticationtoken,async(req,res)=>{
     
    const {userId} = req.user;

    try { 
        const alltarvelstories = await TravelstorySchema.find({userId:userId}).sort({isfavorite:-1})
        res.status(200).json({stories:alltarvelstories})
    } 
    catch (error) {
        res.status(500).json({error:true , message:error.message})
    }
})


//edit travel story
app.put('/edit-story/:id',authenticationtoken,async (req,res)=>{
    console.log("hitted")
    const {id} = req.params;
    const {title ,story ,visitedlocation,imageurl,visitondate } = req.body
    const {userId} = req.user
    
    // console.log(id)
    // console.log({
    //     title,
    // })
    if (!title || !story || !visitedlocation || !imageurl || !visitondate ){
        return res.status(400).json({error:true,message:"add all fields"})
    }
  
    const parsevisiteddate = new Date(parseInt(visitondate))
    console.log('parsevisiteddate')

    try {
        // find travel story by id and ensure it belog to authorised user
        const travelStory = await TravelstorySchema.findOne({_id:id,userId:userId})
        if(!travelStory){
            return res.status(400).json({error:true,message:"travel story not found"})
        }

        const placeholderimagerl =  `http://localhost:8000/assets/temp.png`

        travelStory.title=title;
        travelStory.story=story;
        travelStory.visitedlocation=visitedlocation
        travelStory.imageurl=imageurl || placeholderimagerl
        travelStory.visitondate = parsevisiteddate

        await travelStory.save()

        return res.status(200).json({story:travelStory,message:"story Update succesfullly"})       

    } 
    catch (error) {
        res.status(500).json({error:true , message:error.message})
    }
})


//delete a travel story
app.delete('/delete-story/:id',authenticationtoken,async (req,res)=>{
    const {id} = req.params;
    const {userId} = req.user

    try {
        const travelStory = await TravelstorySchema.findOne({_id:id,userId:userId})
        if(!travelStory){
            return res.status(400).json({error:true,message:"travel story not found"})
        }

        await TravelstorySchema.deleteOne({_id:id,userId:userId})

        const imageurl = travelStory.imageurl
        const filename = path.basename(imageurl).trim()
        const filepath = path.join(__dirname,"uploads",filename)
        //  console.log(filename)
        //  console.log(filepath)
        // delete image of that strory
        fs.unlink(filepath,(err)=>{
            if(err) console.log("failed to delete image")
        })

        return res.status(200).json({message:"story deleted succesfullly"})       

    } 
    catch (error) {
        res.status(500).json({error:true , message:error.message})

    }
})


// Route to handle image upload
app.post('/upload-image',upload.single("image"),async (req,res)=>{
    console.log(req.file.filename)
    console.log("route hit")
    try {
        if(!req.file){
            return res.status(400).json({error:true,message:"No image uploded"})
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}` 

        //const imageUrl = cloudinary_upload(req.file.filename)
        res.status(201).json({imageUrl})
    } 
    catch (error) {
        return res.status(500).json({error:true,message:error.message})
     
    }
})


// delete image 
app.delete("/delete-image", async (req, res) => {
    const { imageurl } = req.query;

    if (!imageurl) {
        return res.status(400).json({ error: true, message: "Image URL is required" });
    }

    try {
        // Extract filename from the image URL
        const filename = path.basename(imageurl).trim()
       console.log(filename)
        // Define the file path
        const filepath = path.join(__dirname, "uploads", filename);
        console.log(filepath)
        // Check if the file exists
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.status(200).json({ message: "Image deleted successfully" });
        } else {
            // File not found case
            res.status(404).json({ error: true, message: "File not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});


// update isfavorite
app.put('/update-is-favorite/:id',authenticationtoken,async (req,res)=>{
    const {id} = req.params;
    const {isfavorite} = req.body;
    const {userId} = req.user

    try {
          const travelStory = await TravelstorySchema.findOne({_id:id,userId:userId})
        if(!travelStory){
            return res.status(404).json({error:true,message:"travel story not found"})
        }
        travelStory.isfavorite = isfavorite;
        await travelStory.save()
        return res.status(200).json({story:travelStory,message:"isfavorite updated succesfullly"})       
    } 
    catch (error) {
        return res.status(500).json({error:true,message:error.message})
    }
})


// Search travel strories by location
app.get('/search',authenticationtoken,async (req,res)=>{

    const {query} = req.query;
    const {userId} = req.user;

    if(!query){
        return res.status(404).json({error:true,message:"Query is required"})
    }

    try {
        const searchResults = await TravelstorySchema.find({
            userId:userId,
            $or:[
                {title:{ $regex:query,$options:"i"}},
                {story:{ $regex:query,$options:"i"}},
                {visitedlocation:{ $regex:query,$options:"i"}},
            ]
        }).sort({isfavorite:-1})

        res.status(200).json({stories:searchResults})
    } 
    catch (error) {
        return res.status(500).json({error:true,message:error.message})
    }
    
})

// militime : 1731182047473
// filter travel stories by data range
app.get('/travel-stories/filter',authenticationtoken,async (req,res)=>{
    
    console.log("hitted")
    const {startdate , enddate} = req.query;
    const {userId} = req.user;

    try {
       
        // convert startdate and enddate from mileseconds to date objects
        const start = new Date(parseInt(startdate))
        const end = new Date(parseInt(enddate))
        
         //console.log(start)
        // find travel stories that belong to authenticate user and lie between start and end date 

        const filteredstories = await TravelstorySchema.find({
            userId:userId,
            visitondate:{$gte:start , $lte:end}
        }).sort({isfavorite:-1})
        // // console.log("end")
        // console.log(filteredstories)
        res.status(200).json({stories:filteredstories})
    } 
    catch (error) {
        return res.status(500).json({error:true,message:error.message})
    }
})


// getallfeddstories

app.get('/get-allfeed-stories',async(req,res)=>{
     
    const pageno = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = 2; // Number of stories per page
    const skip = (pageno - 1) * limit; // Calculate the number of documents to skip

    try {
        // Sort by `_id` to ensure unique and consistent pagination order
        const allTravelStories = await TravelstorySchema.find()
            .sort({ _id: 1 }) // Sort by _id in ascending order to ensure unique results per page
            .skip(skip)       // Skip the number of documents based on the page number
            .limit(limit);    // Limit the number of documents per page

        res.status(200).json({ stories: allTravelStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
})

// Searve Static files from the uploads ans assests directory

app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use("/assets",express.static(path.join(__dirname,"assets")))



app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});

module.exports = app;
