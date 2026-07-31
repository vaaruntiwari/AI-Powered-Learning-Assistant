import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please provide a username'],
        trim:true,
        unique:true,
        minlength:[3,'Username must be atleast 3 character long']
        
    },
    email:{
        type:String,
        required:[true,'Please provide an email'],
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,'Please provid a valid email']

    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:[6,'Password must be atleast 6 characters long'],
        select:false

    },
    profileImage:{
        type:String,
        default:null
    },

},
{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }

    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

userSchema.methods.matchPasswords=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const User=mongoose.model('User',userSchema)

export default User