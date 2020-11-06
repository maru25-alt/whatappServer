import messageModal from '../modals/message.js'
import express from 'express'

let router = express.Router();

router.get('/', (req, res) => {
    console.log("connected")
    res.send('connected')
})


//get all messages and chats
router.get('/getMessages', (req, res) => {
    messageModal.find((err , data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

//get current user chats
router.get('/userMessages/:currentID/:chatUserID', (req, res) => {
    messageModal.findOne({
        userId: req.params.currentID
    }).then(
        doc => {
                console.log(doc);
                const messages = doc.messages.filter( e => {
                    return e.chatWithId === req.params.chatUserID
                })
                res.json(messages)
            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})



//send message
router.post('/newMessage/:currentId/:chatId', (req, res) => {
    const dbMessage = req.body;
    const message ={
        message: dbMessage.message,
        chatWithId: req.params.chatId,
        senderId: dbMessage.senderId
    }
    messageModal.findOneAndUpdate({userId : req.params.currentId }, {$push: {
        messages : message
    }})
    .then(data => {
        res.status(201).send(data)
    }).catch(err => {
        res.status(500).send(err)
    });
   
})


// delete message

//clear chat



export default router


