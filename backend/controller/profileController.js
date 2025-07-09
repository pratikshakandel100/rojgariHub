import { validationResult } from 'express-validator';
import { Employee, JobSeeker, Admin } from '../models/index.js';

export const getUserProfile = async (req, res) => {
  try {
    const { userType } = req;
    let user;

    switch (userType) {
      case 'admin':
        user = await Admin.findByPk(req.user.id, {
          attributes: { exclude: ['password'] }
        });
        break;
      case 'employee':
        user = await Employee.findByPk(req.user.id, {
          attributes: { exclude: ['password'] }
        });
        break;
      case 'jobseeker':
        user = await JobSeeker.findByPk(req.user.id, {
          attributes: { exclude: ['password'] }
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a display name
    const displayName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.companyName || user.email || 'User';

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        displayName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      phone,
      companyName,
      companyEmail,
      companyPhone,
      companyLocation,
      companyWebsite,
      companyDescription,
      companyFounded,
      companyEmployees
    } = req.body;

    const employee = await Employee.findByPk(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (companyEmail !== undefined) updateData.companyEmail = companyEmail;
    if (companyPhone !== undefined) updateData.companyPhone = companyPhone;
    if (companyLocation !== undefined) updateData.companyLocation = companyLocation;
    if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite;
    if (companyDescription !== undefined) updateData.companyDescription = companyDescription;
    if (companyFounded !== undefined) updateData.companyFounded = companyFounded;
    if (companyEmployees !== undefined) updateData.companyEmployees = companyEmployees;

    await employee.update(updateData);

    const updatedEmployee = await Employee.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

export const updateJobSeekerProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      location,
      bio,
      experience,
      skills,
      education,
      workExperience,
      portfolio,
      linkedin,
      github,
      instagram,
      facebook,
      hobbies,
      expectedSalary,
      jobPreferences
    } = req.body;

    const jobSeeker = await JobSeeker.findByPk(req.user.id);
    if (!jobSeeker) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (experience !== undefined) updateData.experience = experience;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (github !== undefined) updateData.github = github;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (expectedSalary !== undefined) updateData.expectedSalary = expectedSalary;
    
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : []);
    }
    if (education !== undefined) {
      updateData.education = Array.isArray(education) ? education : [];
    }
    if (workExperience !== undefined) {
      updateData.workExperience = Array.isArray(workExperience) ? workExperience : [];
    }
    if (hobbies !== undefined) {
      updateData.hobbies = Array.isArray(hobbies) ? hobbies : [];
    }
    if (jobPreferences !== undefined) {
      updateData.jobPreferences = Array.isArray(jobPreferences) ? jobPreferences : [];
    }

    await jobSeeker.update(updateData);

    const updatedJobSeeker = await JobSeeker.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedJobSeeker
    });
  } catch (error) {
    console.error('Error updating job seeker profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phone, permissions } = req.body;

    const admin = await Admin.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await admin.update({
      firstName,
      lastName,
      phone,
      permissions: Array.isArray(permissions) ? permissions : []
    });

    res.json({
      success: true,
      user: admin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unified profile update endpoint
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userType = req.userType;
    const { id } = req.user;
    let user, updateData = {};

    switch (userType) {
      case 'employee':
        user = await Employee.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'Employee not found' });
        }

        const {
          firstName: empFirstName,
          lastName: empLastName,
          phone: empPhone,
          companyName,
          companyEmail,
          companyPhone,
          companyLocation,
          companyWebsite,
          companyDescription,
          companyFounded,
          companyEmployees
        } = req.body;

        if (empFirstName !== undefined) updateData.firstName = empFirstName;
        if (empLastName !== undefined) updateData.lastName = empLastName;
        if (empPhone !== undefined) updateData.phone = empPhone;
        if (companyName !== undefined) updateData.companyName = companyName;
        if (companyEmail !== undefined) updateData.companyEmail = companyEmail;
        if (companyPhone !== undefined) updateData.companyPhone = companyPhone;
        if (companyLocation !== undefined) updateData.companyLocation = companyLocation;
        if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite;
        if (companyDescription !== undefined) updateData.companyDescription = companyDescription;
        if (companyFounded !== undefined) updateData.companyFounded = companyFounded;
        if (companyEmployees !== undefined) updateData.companyEmployees = companyEmployees;
        break;

      case 'jobseeker':
        user = await JobSeeker.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'Job seeker not found' });
        }

        const {
          firstName,
          lastName,
          phone,
          dateOfBirth,
          location,
          bio,
          experience,
          skills,
          education,
          workExperience,
          portfolio,
          linkedin,
          github,
          instagram,
          facebook,
          hobbies,
          expectedSalary,
          jobPreferences
        } = req.body;

        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (phone !== undefined) updateData.phone = phone;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (location !== undefined) updateData.location = location;
        if (bio !== undefined) updateData.bio = bio;
        if (experience !== undefined) updateData.experience = experience;
        if (portfolio !== undefined) updateData.portfolio = portfolio;
        if (linkedin !== undefined) updateData.linkedin = linkedin;
        if (github !== undefined) updateData.github = github;
        if (instagram !== undefined) updateData.instagram = instagram;
        if (facebook !== undefined) updateData.facebook = facebook;
        if (expectedSalary !== undefined) updateData.expectedSalary = expectedSalary;
        
        if (skills !== undefined) {
          updateData.skills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : []);
        }
        if (education !== undefined) {
          updateData.education = Array.isArray(education) ? education : [];
        }
        if (workExperience !== undefined) {
          updateData.workExperience = Array.isArray(workExperience) ? workExperience : [];
        }
        if (hobbies !== undefined) {
          updateData.hobbies = Array.isArray(hobbies) ? hobbies : [];
        }
        if (jobPreferences !== undefined) {
          updateData.jobPreferences = Array.isArray(jobPreferences) ? jobPreferences : [];
        }
        break;

      case 'admin':
        user = await Admin.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'Admin not found' });
        }

        const {
          firstName: adminFirstName,
          lastName: adminLastName,
          phone: adminPhone
        } = req.body;

        if (adminFirstName !== undefined) updateData.firstName = adminFirstName;
        if (adminLastName !== undefined) updateData.lastName = adminLastName;
        if (adminPhone !== undefined) updateData.phone = adminPhone;
        break;

      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    await user.update(updateData);

    const updatedUser = await user.constructor.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userType = req.userType;
    const { id } = req.user;

    let user;
    switch (userType) {
      case 'employee':
        user = await Employee.findByPk(id);
        break;
      case 'jobseeker':
        user = await JobSeeker.findByPk(id);
        break;
      case 'admin':
        user = await Admin.findByPk(id);
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};