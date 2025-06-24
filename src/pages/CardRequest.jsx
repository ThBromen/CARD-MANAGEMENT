import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { cardRequestAPI, apiErrorHandler } from '../services/api';
import 'react-toastify/dist/ReactToastify.css';

function CardRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    school: '',
    yearOfStudy: '',
    department: '',
    photo: null, // Store File object
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

    if (name === 'photo' && files.length) {
      const file = files[0];
      if (!validateImage(file)) return;

      // Store the actual File object for FormData
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
      registrationNumber: '',
      school: '',
      yearOfStudy: '',
      department: '',
      photo: null,
    });
    setPhotoPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'name',
      'email',
      'registrationNumber',
      'school',
      'yearOfStudy',
      'department',
    ];

    // Check if required text fields are filled
    const hasEmpty = requiredFields.some(field => !formData[field]);
    if (hasEmpty) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if photo is uploaded
    if (!formData.photo) {
      toast.error('Please upload a photo');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare card request data according to API schema
      const cardRequestData = {
        Date: new Date().toISOString(),
        name: formData.name,
        department: formData.department,
        school: formData.school,
        program: formData.department, // Using department as program
        yearOfStudy: formData.yearOfStudy,
        regNumber: formData.registrationNumber,
        photo: formData.photo, // This will be the File object
        email: formData.email,
        status: 'pending' // Default status
      };

      console.log('Submitting card request:', cardRequestData);
      await cardRequestAPI.createCardRequest(cardRequestData);
      toast.success('Card request submitted successfully!');
      resetForm();
      
      // Redirect to a confirmation page or dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Card request error:', error);
      const errorMessage = apiErrorHandler(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate('/');

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Student Card Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'registrationNumber', 'school', 'department'].map((field) => (
          <input
            key={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())}
            required
            type={field === 'email' ? 'email' : 'text'}
            className="w-full border p-2 rounded"
          />
        ))}

        <input
          name="yearOfStudy"
          value={formData.yearOfStudy}
          onChange={handleChange}
          type="number"
          placeholder="Year of Study"
          min="1"
          max="6"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {photoPreview && (
          <img
            src={photoPreview}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover mx-auto mt-2"
          />
        )}

        <div className="flex justify-between flex-wrap gap-2 mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
          >
            Back to Home
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded flex-1 text-white ${
              isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default CardRequest;
