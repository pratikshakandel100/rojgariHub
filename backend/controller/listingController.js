import connectDB from "../config/db.js"
export default getListing = async(req,res) => {
   const L1 = new listings({
  title: "Backend Developer",
  company: "TechVerse",
  location: "Kathmandu",
  type: "Full-time",
  salary: { min: 50000, max: 80000 },
  description: "Work with Node.js and MongoDB to build scalable APIs.",
  requirements: ["Node.js", "MongoDB", "Express", "REST APIs"],
  
})
await getListing.save();
}