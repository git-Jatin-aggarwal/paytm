const express = require("express")
const User = require("../db")
const zod = require("zod")
const jwt = require("jsonwebtoken")
const JWT_TOKEN = require("../config")
const router =express.Router
const  { authMiddleware } = require("../middleware");



const signupSchema= zod.object({
    username : zod.string().email,
    password : zod.string(),
    firstName : zod.string(),
    lastName :zod.string
})
router.post("/signup",async (req,res)=>{

    const {success} = signupSchema.safeParse(req.body)

    if(!success){
        return res.json({
            message:"Incoorect Inputs"
        })
    }
       
    const {username , firstName, lastName, password}= req.body

  const isMatch = User.find({username: username})

  

  if(isMatch._id){
    return res.json({
        message: "Email already taken / Incorrect inputs"

    })
  }

  const userSaved = await User.create({
    username,
    password,
    firstName,
    lastName
  })

  const token = jwt.sign({
    userId : userSaved._id
  },JWT_TOKEN)
  res.json(
    {
        message:"user created successfully",
        token : token
    }
  )

})

const signInSchema = zod.object({
  username : zod.string().email(),
  password: zod.string()
})

router.post("/signin",async (req,res)=>{

    const {success} = signInSchema.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            message:"Incorrect Inputs"
        })
    }

    const {username , password} = req.body

    const userSaved = await User.findOne({
        username: username,
        password: password

    })

    if(!userSaved){
        return res.json({
            message:"Wrong Inputs"
        })
    }

    const token = jwt.sign({
        userId : userSaved._id
    })

    return res.json({
        message:"you Sign in",
        token : token
    })
})





// other auth routes

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router