const mongoose = require("mongoose")

const Schema = mongoose.Schema
const travelstoryschema = new Schema({
    title:{type :String, required:true},
    story:{type:String , required:true},
    visitedlocation:{type:[String],default:[]},
    isfavorite:{type:Boolean,default:false},
    userId:{type:Schema.Types.ObjectId, ref:"userschema",required:true},
    createdon:{type:Date , default:Date.now},
    imageurl:{type:String , required:true},
    visitondate:{type:Date,required:true}
})

module.exports = mongoose.model("travelstoryschema",travelstoryschema)