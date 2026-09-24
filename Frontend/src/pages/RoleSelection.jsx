import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = ({ redirectTo }) => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    navigate(`/${role}/${redirectTo}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Select Your Role</h1>
      <div className="flex gap-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md"
          onClick={() => handleSelection('user')}
        >
          I am a User
        </button>
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-md"
          onClick={() => handleSelection('admin')}
        >
          I am an Admin
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
