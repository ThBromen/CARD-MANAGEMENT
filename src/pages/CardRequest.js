import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://student-card-api.onrender.com/api/v1/cardRequest/card';

function CardRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    school: '',
    yearOfStudy: '',
    department: '',
    photo: '',
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
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
      photo: '',
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
      'photo',
    ];

    const hasEmpty = requiredFields.some(field => !formData[field]);
    if (hasEmpty) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Request submitted successfully!');
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      toast.error('Network or server error');
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
