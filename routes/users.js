//import modal
import UserModel from '../modals/user.js'
import MessageModel from '../modals/message.js';
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import {UserSchema , SigninSchema, ChangePasswordSchema} from '../middleware/Validate.js';
import dotenv from 'dotenv';
import {auth} from '../middleware/PrivateRoutes.js'


dotenv.config()

let router = express.Router();


router.get('/auth',auth, (req, res) => {
  res.json({
    message: "test private routes"
  })
})

//get all users
router.get('/getAll', (req, res) => {
  UserModel.find((err , data) => {
   // console.log(data)
    if(err){
        res.status(500).send(err)
    }
    else{
        res.status(201).send(data)
    }
})
})



router.get('/user/:id', (req , res) => {
  //console.log(req.p)
  if(!req.params.id) {
    return res.status(400).send('Missing URL parameter: username')
  };
  UserModel.findOne({
    _id: req.params.id
  }).then(doc => {
     res.json(doc)
  }) 
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
})

//signup
router.post('/signup', async(req, res) => {
  let body = req.body
  const {error} = UserSchema.validate(req.body);
  if(error){
   res.json({sucess: false, message: error.details[0].message})
  }
  else{
    const userData = {
      username :body.username,
      password : body.password,
      telephone: body.telephone,
    }
    const telephoneExist = await UserModel.findOne({
      telephone: body.telephone
    })
    const usernameExist = await UserModel.findOne({
      username: body.username
    })

    if(telephoneExist){
      return res.json({sucess: false, message: "Telephone number  already in use"})
    }

    else if(usernameExist){
      return res.json({sucess: false, message: "Username already in use"})
    }

    bcrypt.hash(body.password, 10, (err, hash) => {
      userData.password = hash;
     
      UserModel.create(userData).then(user => {
        MessageModel.create({
          userId: user._id,
          messages: []
        }).catch(err => {
            res.send(err);
          //console.log(err)
        })
        let token = jwt.sign(userData, process.env.SECRET_TOKEN, {
             expiresIn: 1440
         })
         res.header("auth_token",token).json({sucess: true , userToken : token, user})
       }).catch(err => {
           res.send('error' + err)
       })
   })
  } 
})

//signin
router.post('/signin', (req, res) => {
  const {error} = SigninSchema.validate(req.body);
  if(error){
    res.status(400).send(error.details[0].message)
  }
  UserModel.findOne({ $or: [
    {telephone: req.body.username},
    {username: req.body.username}
  ]
    })
    .then(user => {
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    _id: user._id,
                    username: user.username,
                    telephone: user.telephone,
                    createdAt: user.createdAt,
                    photoUrl: user.photoUrl,
                    status: user.status
                }
                let token = jwt.sign(payload, process.env.SECRET_TOKEN)
                //    {
                //     expiresIn: 1440
                // })
                res.header("auth_token",token).send({sucess: true, token, user: payload})
            } else {
                res.json({ message: 'Wrong Credentials ! Incorrect Password or Telephone or Username' })
            }
        } else {
            res.json({ message: 'Wrong Credentials ! Incorrect Password or Telephone or Username' })
        }
    })
    .catch(err => {
        res.send( err)
    })
})


//change password
router.put('/changePassword/:id', auth, async(req, res )=> {
  const {error} = ChangePasswordSchema.validate(req.body);
  if(error) {
    return res.status(400).send('Request body is missing')
  }
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    userData.password = hash;
    UserModel.findOneAndUpdate({
      _id: req.params.id
    }, {
      password: userData.password
    },  {
      new: true
    })
    .then(() => {
      return  res.status(200).send("OK")
    })
    .catch(err => {
        res.status(500).json(err)
      })
  })
})

//confirm password

//change status, username , profile
router.put('/update/:id', (req, res) => {
  console.log(req.body)
  if(!req.params.id) {
    return res.send('Missing URL parameter: username')
  }
  UserModel.findOneAndUpdate({
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

//delete
router.delete('/delele/:id', auth,  (req, res) => {
    if(!req.params.id) {
      return res.status(400).send('Missing URL parameter: username')
    }
    UserModel.findOneAndRemove({
      _id: req.params.id
    })
    .then(doc => {
        res.status(200);
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

 export default router 