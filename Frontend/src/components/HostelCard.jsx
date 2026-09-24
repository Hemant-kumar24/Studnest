import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import api from '../utils/axiosInstance';

const HostelCard = ({ hostel }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const ensureAuth = () => {
    const token = localStorage.getItem('token'); // unified key
    if (!token) {
      alert('Please login first');
      navigate('/user/login');
      return false;
    }
    return true;
  };

  const handleBookNow = () => {
    if (!ensureAuth()) return;
    navigate(`/user/book/${hostel._id}`);
  };

  const addToFavorites = async () => {
    if (!ensureAuth()) return;
    try {
      setSaving(true);
      await api.post('/user/favorites', { hostelId: hostel._id });
      alert('Added to favorites');
    } catch (e) {
      console.error('Failed to add favorite', e);
      alert('Failed to add favorite');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={hostel.image || '/placeholder-image.jpg'}
        alt={hostel.propertyTitle}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-semibold flex items-center justify-between">
        {hostel.propertyTitle}
        <button
          onClick={addToFavorites}
          disabled={saving}
          title="Save to favorites"
          className="text-red-500 hover:text-red-600 disabled:opacity-60"
        >
          <FaHeart />
        </button>
      </h3>
      <p className="text-sm text-gray-600">
        {hostel.city} - {hostel.nearbyCollege}
      </p>
      <p className="font-medium mt-1">₹{hostel.monthlyRent}/month</p>

      <button
        onClick={handleBookNow}
        className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Book Now
      </button>
    </div>
  );
};

export default HostelCard;
