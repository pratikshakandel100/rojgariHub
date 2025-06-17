import connectDB from "../config/db.js";



const Schema = mongoose.Schema;

import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    set: (v) => V === "" ? "https://images.unsplash.com/photo-1519389950473-47ba0277781c": V,
  },
  location: {
    type: String,
    default: 'Remote',
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
    default: 'Full-time',
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    required: false
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
//   postedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   deadline: {
//     type: Date,
//   },
  
//   applicants: [
//     {
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//       appliedAt: {
//         type: Date,
//         default: Date.now,
//       }
//     }
//   ]
});

const listing = mongoose.model('listing', listingSchema);

export default listing;
