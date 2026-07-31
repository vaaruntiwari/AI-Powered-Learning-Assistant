import mongoose from "mongoose";
import dns from 'dns'

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])

const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Failed to connect MONGODB:${error.message}`)
        process.exit(1)
    }
}
export default connectDB