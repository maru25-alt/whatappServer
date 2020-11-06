import groupModal from '../modals/groups.js'
import express from 'express'

let router = express.Router();

router.get('/', (req, res) => {
    console.log("connected")
    res.send('connected')
})


//get all messages and grps
router.get('/getGroups', (req, res) => {
    groupModal.find((err , data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

//create grp 
router.post('/createGroup/:id', (req, res) => {
    console.log('creating....')
    groupModal.create({
        messages: [],
        groupName:req.body.name,
        createdBy: req.params.id,
        description: req.body.description
    }).then( (data) => {
       res.status(200).send(data)
    }).catch(err => {
        res.status(500).json(err);
    })
})

//get  grp chats
router.get('/groupMessages/:id', (req, res) => {
   groupModal.findOne({
        _id: req.params.id
    }).then(
        doc => {
           res.json(doc)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})


//send message
router.post('/newGroupMessage/:id', (req, res) => {
    const dbMessage = req.body;
    const message = {
        SenderUserId: dbMessage.senderId,
        message: dbMessage.message,
        username: dbMessage.username
    }
    groupModal.findOneAndUpdate({_id : req.params.id }, {$push: {
        messages:  message 
    }})
    .then(data => {
        res.status(201).send(data)
    }).catch(err => {
        res.status(500).send(err)
    });
   
})


// delete message

//clear chat

//edit info
router.put('/update/:id', (req, res) => {
    console.log(req.body)
    if(!req.params.id) {
      return res.send('Missing URL parameter: username')
    }
    groupModal.findOneAndUpdate({
      _id: req.params.id
    }, req.body,  {
      new: true
    })
    .then(() => {
      return  res.status(200).send("OK")
    })
    .catch(err => {
        res.status(500).json(err)
      })
  })



export default router


