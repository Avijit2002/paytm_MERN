import mongoose from "mongoose"
import 'dotenv/config'

const URI = process.env.MONGODB_URI
if(!URI){
    console.log("DB URI problem")
    throw new Error("DB URI problem")
}

mongoose.connect(URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err))

interface user {
    firstName: string,
    lastName: string,
    password: string,
    userName: string
}

const userSchema = new mongoose.Schema<user>({
    firstName: {
        type: String,
        required: true,
        trim:true,
        maxLength:50
    },
    lastName: {
        type: String,
        required: true,
        trim:true,
        maxLength:50
    },
    userName: {
        type: String,
        required: true,
        trim:true,
        maxLength:10,
        minLength:3,
        unique:true,
        lowercase:true
    },
    password: {
        type:String,
        minLength:6,
        required:true
    },
}, { timestamps: true })

const User = mongoose.model('user', userSchema);
const Admin = mongoose.model('user', userSchema);

export {
    User,
    Admin
}

