const express = require ("express");
const zod = require("zod")
const {User} = require("../db")
const jwt = require ("jsonwebtoken");
const JWT_SECRET = require("../confiq");

const router = express.Router();


const signupSchema = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()

})



try {
    router.post("/signup",async (req, res)=>{
        const {userName , lastName , firstName , password} = req.body
      
        const {success} = signupSchema.safeParse(req.body);
        
        if(!success){
          return res.status(411).json({
              message: "Incorrect inputs" 
          })
        }
      
        const user = await User.findOne({
          userName: userName
        })
      
        if(user){
          return res.status(411).json({
              message: "Email already taken "
          })
        }
      
        const createUser = await User.create({
          userName,
          password,
          firstName,
          lastName
        })
      
        const token = jwt.sign({
                userId  : createUser._id
        }, JWT_SECRET)
      
        res.json({
              message: "User created successfully",
          token: token
        })
          
      
      }) 
} catch (error) {
    console.log(error)
}

const signinBody = zod.object({
    userName: zod.string().email(),
	password: zod.string()
})




try {
    router.post("/signin",async(req,res)=>{
        const {userName , password} = req.body
    
    
        const {success} = signinBody.safeParse(req.body) 
    
        if(!success){
            return res.status(411).json({
                message: "Error while logging in"
            })
        }
    
        const userExists = await User.findOne({
            userName: userName,
            password: password
        })
    
        if(!userExists){
            return res.status(411).json({
                message: "Error while logging in"
            })
        }
        
    
         const token = jwt.sign({
                userId: userExists._id
            })   
            
            return res.status(200).json({
                token : token
            })
    
    })
    
} catch (error) {

   console.log(error)
   
}




module.exports =  router
