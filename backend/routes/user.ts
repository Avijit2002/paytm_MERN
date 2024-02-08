import { Router } from "express";
const router = Router()

router.get('/',(req,res)=>{
    res.send("userRouter")
})
router.post('/signup',(req,res)=>{
})

router.post('/signin',(req,res)=>{
})

router.post('/update',(req,res)=>{
})


export default router