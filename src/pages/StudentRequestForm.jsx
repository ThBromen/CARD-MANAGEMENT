import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { cardRequestAPI, apiErrorHandler } from '../services/api';
import 'react-toastify/dist/ReactToastify.css';

function StudentRequestForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regNumber: '',
    school: '',
    yearOfStudy: '',
    department: '',
    program: '',
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateImage = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be under 2MB');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo' && files.length > 0) {
      const file = files[0];
      if (!validateImage(file)) return;

      // Store the actual file object
      setFormData(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      regNumber: '',
      school: '',
      yearOfStudy: '',
      department: '',
      program: '',
      photo: null
    });
    setPhotoPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'name',
      'email',
      'regNumber',
      'school',
      'yearOfStudy',
      'department',
      'photo'
    ];

    const hasEmpty = requiredFields.some(field => {
      if (field === 'photo') {
        return !formData[field];
      }
      return !formData[field];
    });

    if (hasEmpty) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('Date', new Date().toISOString());
      submitData.append('name', formData.name);
      submitData.append('department', formData.department);
      submitData.append('school', formData.school);
      submitData.append('program', formData.program || formData.department);
      submitData.append('yearOfStudy', formData.yearOfStudy);
      submitData.append('regNumber', formData.regNumber);
      submitData.append('email', formData.email);
      submitData.append('status', 'pending');
      
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      await cardRequestAPI.createCardRequest(submitData);
      toast.success('Card request submitted successfully!');
      resetForm();
      
      // Redirect to home page after successful submission
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMessage = apiErrorHandler(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate('/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Card Request</h1>
          <p className="text-gray-600">Submit your information to request a new student ID card</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                id="regNumber"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your registration number"
              />
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                School/Faculty *
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your school or faculty"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your department"
              />
            </div>

            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <input
                type="text"
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your program (optional)"
              />
            </div>

            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                Year of Study *
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
                <option value="Graduate">Graduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo * (Max 2MB)
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {photoPreview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Back to Home
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 text-white font-medium rounded-md transition duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default StudentRequestForm;
