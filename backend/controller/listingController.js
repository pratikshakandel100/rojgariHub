import Listing from '../model/Listing.js';

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
 res.send({success: true, message: "Listing is added Successfully", data: list});
}

export const getAllListing = async(req,res) => {
  const allListing = await(Listing.find());
  res.send({success: true, message: "All listing fetch", data: allListing});
}

export const getListingById = async(req, res) => {
  const {meroId} = req.params;
  const singlelListing = await(Listing.findById(meroId));
  res.send({success: true, message: "Getting Element By Id", data: singlelListing})
}
 

export const deleteListingById = async(req,res) => {
  const {mero_Id} = req.params;
  const deleteListing = await(Listing.findByIdAndDelete(mero_Id));
  res.send({success: true, message: "Deleting ELement by Id", data : {}})
}

export const updateLisiting = async(req, res) => {
  const {Id} = req.params;
  const {title, description, salary} = req.body;
  const updatedListing = await(Listing.findByIdAndUpdate(Id, {
    title: title,
    description: description,
    salary: salary
  }));
  res.send({success: true, message: "Update Element by Id", data: updatedListing})
}

