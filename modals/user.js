import mongoose from '../config/mongodb.js';

const instance = mongoose.Schema({
    telephone:String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    username: String,
    status: {type : String, default: 'New to Whatsapp'},
    photoUrl: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS4keE4qLaVynZj3DWaXDTfnFR3CgPiz-n_9w&usqp=CAU"} 
    
})

export default mongoose.model('users', instance);