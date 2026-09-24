import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaPhoneAlt, 
  FaUser, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaHome,
  FaRupeeSign,
  FaBed,
  FaUsers,
  FaInfoCircle,
  FaBuilding,
  FaUniversity,
  FaTimes
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";

const Enquiry = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await axiosInstance.get(`/hostels/${id}`);
        setHostel(response.data);
      } catch (err) {
        setError("Failed to fetch hostel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner size="large" color="purple" text="Loading hostel details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-lg font-semibold">Hostel not found.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${hostel.image || 'https://via.placeholder.com/800x400'})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

      <div className="relative z-10 px-4 py-10 min-h-screen flex justify-center items-center">
        
        {/* MAIN WHITE CONTENT BOX */}
        <div className="relative max-w-6xl w-full bg-white shadow-2xl rounded-2xl p-8">

          {/* CLOSE BUTTON INSIDE BOX */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 transition p-2 rounded-full shadow-lg"
          >
            <FaTimes size={18} />
          </button>

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">{hostel.propertyTitle}</h1>
            <p className="text-gray-600 text-lg">Complete Property & Owner Details</p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* OWNER DETAILS */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
                  <FaUser className="mr-3" /> Owner Details
                </h2>

                <div className="space-y-4">

                  <InfoRow icon={<FaUser />} title="Name" value={hostel.ownerName || hostel.ownerDetails?.name} />
                  <InfoRow icon={<FaEnvelope />} title="Email" value={hostel.ownerEmail || hostel.ownerDetails?.email} />
                  <InfoRow icon={<FaPhoneAlt />} title="Phone" value={hostel.ownerPhone || hostel.ownerDetails?.phone} />
                  
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                    <FaMapMarkerAlt className="text-blue-500 text-lg mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700">Property Address:</span>
                      <p className="font-medium text-gray-900">
                        {hostel.address || "Not provided"}, {hostel.city || "Not provided"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* PROPERTY DETAILS */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
                  <FaHome className="mr-3" /> Property Details
                </h2>

                {hostel.image && (
                  <img
                    src={hostel.image}
                    alt={hostel.propertyTitle}
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                  />
                )}

                <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                  <div className="flex items-start space-x-3">
                    <FaInfoCircle className="text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Description:</h3>
                      <p className="text-gray-900">{hostel.description || "No description provided"}</p>
                    </div>
                  </div>
                </div>

                {/* INFO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                  <InfoCard icon={<FaBuilding />} title="Property Type" value={hostel.propertyType} />
                  <InfoCard icon={<FaUsers />} title="Gender Preference" value={hostel.genderPreference} />
                  <InfoCard icon={<FaRupeeSign />} title="Monthly Rent" value={`₹${hostel.monthlyRent}`} />
                  <InfoCard icon={<FaRupeeSign />} title="Security Deposit" value={`₹${hostel.securityDeposit}`} />
                  <InfoCard icon={<FaBed />} title="Total Rooms" value={hostel.totalRooms} />
                  <InfoCard icon={<FaBed />} title="Available Rooms" value={hostel.availableRooms} />

                </div>

                {/* NEARBY COLLEGE */}
                <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                  <div className="flex items-center space-x-3">
                    <FaUniversity className="text-blue-500 text-lg" />
                    <div>
                      <h4 className="font-semibold text-gray-700">Nearby College:</h4>
                      <p className="font-medium text-gray-900">{hostel.nearbyCollege || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* AMENITIES */}
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <FaHome className="mr-2 text-blue-500" /> Amenities:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {hostel.amenities?.length > 0 ? (
                      hostel.amenities.map((item, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full shadow-sm text-sm">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No amenities listed</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* CONTACT BUTTONS */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Contact?</h3>
            <p className="mb-4">Get in touch with the owner for more details.</p>

            <div className="flex flex-wrap justify-center gap-4">

              {(hostel.ownerPhone || hostel.ownerDetails?.phone) && (
                <a
                  href={`tel:${hostel.ownerPhone || hostel.ownerDetails?.phone}`}
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition flex items-center"
                >
                  <FaPhoneAlt className="mr-2" />
                  Call Now
                </a>
              )}

              {(hostel.ownerEmail || hostel.ownerDetails?.email) && (
                <a
                  href={`mailto:${hostel.ownerEmail || hostel.ownerDetails?.email}`}
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition flex items-center"
                >
                  <FaEnvelope className="mr-2" />
                  Send Email
                </a>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, title, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
    <div className="text-blue-500 text-lg">{icon}</div>
    <div>
      <span className="font-semibold text-gray-700">{title}:</span>
      <p className="font-medium text-gray-900 break-all">{value || "Not provided"}</p>
    </div>
  </div>
);

const InfoCard = ({ icon, title, value }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm flex space-x-3">
    <div className="text-blue-500 text-lg">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-700">{title}:</h4>
      <p className="font-medium text-gray-900">{value || "Not specified"}</p>
    </div>
  </div>
);

export default Enquiry;
