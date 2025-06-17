import mongoose from 'mongoose';
import { LISTING_MODEL } from '../utils/constant.js';

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

const listing = mongoose.model(LISTING_MODEL, listingSchema);

export default listing;
