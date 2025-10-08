
import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username:
    {
        name: String,
        required: true,
        unique: true
    },
    email:
    {
        email: String,
        required: true,
    },
    password:
    {
        password: String,
        required: true,
    },
    role:
    {
        role: String,
        enum: ["admin", "user"],
        default: "user",
    }
},
    {
        timestamps: true,
    }

)

export default mongoose.model("User", UserSchema)