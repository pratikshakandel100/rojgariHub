import { USER_MODEL } from "../utils/constant.js";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  profilePicture: {
    type: String, // You can store URL or file path
    default: "default-avatar.png", // or null
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  role: {
    type: String,
    // enum: ["jobseeker", "employer", "admin"],
    default: "jobseeker",
  }
}, {
  timestamps: true,
});

const User = mongoose.model(USER_MODEL, userSchema);
// export default mongoose.model("User", userSchema);
export default User;