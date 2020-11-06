import mongoose from 'mongoose';
import Pusher from 'pusher';
import dotenv from 'dotenv';

dotenv.config()
const connection_url = process.env.DB_CONNECT;

const pusher = new Pusher({
  appId: "1099765",
  key: "7d626b38a5cc6c22c4ad",
  secret: "bd02de703dc8558ffcb0",
  cluster: "eu",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set('useFindAndModify', false);

const db = mongoose.connection;


db.once('open', ()=> {
    console.log("db connnected");
    const mgsCollection = db.collection('messages');
    const userCollection = db.collection('users');
    const groupCollection = db.collection('groups')

    const changeStream = mgsCollection.watch();
    changeStream.on('change', (change) => {
           if(change.operationType === 'update'){
            console.log('Triggering Pusher ')
            const messageDetails = change.updateDescription;
            pusher.trigger('messages', 'InsertMessage', {
                message: messageDetails.updatedFields
            })
          }
          else{
            console.log("error  pusher ")
          }
    });
    
    const changeUser = userCollection.watch();
    changeUser.on('change', (change) => {
      if(change.operationType === 'insert'){
        console.log('Triggering Pusher ')
        const userDetails = change.fullDocument;
        pusher.trigger('users', 'insertedUser', {
            user: userDetails.user
        })
      }
      else{
        console.log("error triggering pusher ")
      }
      
    })

    const changeGroup = groupCollection.watch();
    changeGroup.on('change', (change) => {
      if(change.operationType === 'update'){
        const groupDetails = change.updateDescription;
        pusher.trigger('groups', 'insertedGroupMessage', {
          updatedFields: groupDetails.updatedFields
        })
      }
      else{
        console.log("error triggering pusher ")
      }
      
    })
})

export default mongoose