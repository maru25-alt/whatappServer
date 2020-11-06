import mongoose from '../config/mongodb.js';

const instance = mongoose.Schema({
    userId: String,
    messages: [{
                message: String,
                timestamp: { type: Date, default: Date.now },
                chatWithId: String,
                senderId: String
            }]
    
})

export default mongoose.model('messages', instance);