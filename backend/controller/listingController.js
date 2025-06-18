import listing from '../model/Listing.js';
import { success, failure } from '../utils/message.js';

export const addListing = async(req,res) => {
  const {title, company, location, type, salary, description,requirements} = req.body
  
  const list = new Listing({
  title: title,
  company: company,
  location: location,
  type: type,
  salary: salary,
  description: description,
  requirements: requirements
  
})

await list.save();
 res.status(201).json(success("Listing is added Successfully", list))
}

export const getAllListing = async(req,res) => {
  const allListing = await(Listing.find());
  // res.send({success: true, message: "All listing fetch", data: allListing});
  if(!allListing){
      return res.status(404).json(failure("singleListing  not found"));
  }
  res.status(200).json(success("All listing fetch", allListing));
}

export const getListingById = async(req, res) => {
  try {
    const {meroId} = req.params;
    const singlelListing = await(Listing.findById(meroId));
     
     res.status(200).json(success("Getting Element By Id", singlelListing));
     if(!singlelListing){
      return res.status(404).json(failure("singleListing  not found"));
     }
      res.status(200).json(success("Getting Element By Id", singlelListing));

  } catch (error) {
    res.status(400).json(failure(error));
  }
}
 

export const deleteListingById = async(req,res) => {
  try {
    const {mero_Id} = req.params;
    const deleteListing = await(Listing.findByIdAndDelete(mero_Id));
    // res.send({success: true, message: "Deleting ELement by Id", data : {}})
    if (!deleteListing){
      return res.status(404).json(failure(error));
    }
    res.status(204).json(success("Delete Element By ID"))
  } catch (error) {
    res.status(400).json(failure(error))
  }
}


export const updateLisiting = async(req, res) => {
  try{
  const {Id} = req.params;
  const {title, description, salary} = req.body;
  const updatedListing = await(Listing.findByIdAndUpdate(Id, {
    title: title,
    description: description,
    salary: salary
  }))
  if(!updateLisiting){
      return res.status(404).json(failure(error));
    }
  // res.send({success: true, message: "Update Element by Id", data: updatedListing})
  res.status(200).json(success("Update Element by Id"));
} catch(error){
  res.status(404).json(failure(error));
}
}









