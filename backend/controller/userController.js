export const register = async(req,res)=>{
  const {fullName, email,  password, phone, gender} = req.body
   const user1 = new User({
    fullName: fullName,
    email: email,
   })

await newUser.save();
console.log("User inserted successfully");

};
