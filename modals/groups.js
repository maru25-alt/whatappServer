import mongoose from '../config/mongodb.js';

const instance = mongoose.Schema({
    groupName: String,
    createdAt:  { type: Date, default: Date.now },
    createdBy: String,
    photoUrl: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJDKsTk6Agd2U9vLQFMw162oFoHVuLPE-ixg&usqp=CAU"},
    description: String,
    messages: [
        {
            SenderUserId: String,
            message: String,
            timestamp: { type: Date, default: Date.now },
            username: String
        }
    ]
  

    
})

export default mongoose.model('groups', instance);