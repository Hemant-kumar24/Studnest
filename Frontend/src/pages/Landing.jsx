import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaShieldAlt, FaMapMarkerAlt, FaSlidersH, FaBolt } from 'react-icons/fa';

const features = [
  {
    title: 'Verified Listings',
    description: 'Each hostel is manually verified for safety and authenticity.',
    icon: <FaShieldAlt size={28} className="text-indigo-500" />,
  },
  {
    title: 'College Proximity',
    description: 'Find hostels near your college or university quickly.',
    icon: <FaMapMarkerAlt size={28} className="text-pink-500" />,
  },
  {
    title: 'Smart Search',
    description: 'Filter by amenities, price, reviews, and more.',
    icon: <FaSlidersH size={28} className="text-purple-500" />,
  },
  {
    title: 'Book Instantly',
    description: 'Reserve your room online with just a few clicks.',
    icon: <FaBolt size={28} className="text-fuchsia-500" />,
  },
];

const dummyHostelImages = [
  '/1seaterAC.webp',
  '/2seaterAc.jpg',
  '/3seaterAC.webp',
  '/dummy4.jpg',
];

const Landing = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
        style={{ backgroundImage: "url('/hostel_background_image.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-6xl text-white px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Discover Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Dream Hostel
            </span>
          </h1>
          <p className="text-lg text-gray-200 mt-4">
            Explore verified accommodations, connect with peers, and simplify your student life with StudNest.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-md font-semibold shadow-lg"
              onClick={() => setShowModal(true)}
            >
              Get Started
            </button>
            <button
              className="bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 transition px-6 py-3 rounded-md font-semibold"
              onClick={() => navigate('/explore')}
            >
              Explore Hostels
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Continue as User/Admin */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-blue-500">Continue As</h3>
            <button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded hover:from-indigo-600 hover:to-purple-700 transition"
              onClick={() => {
                navigate('/user/register');
                setShowModal(false);
              }}
            >
              User
            </button>
            <button
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded hover:from-pink-600 hover:to-purple-700 transition"
              onClick={() => {
                navigate('/admin/register');
                setShowModal(false);
              }}
            >
              Admin
            </button>
            <button
              className="text-sm text-gray-500 hover:text-gray-700 mt-2"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Why Choose StudNest Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20 px-6 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-14 text-gray-900 dark:text-white">
          Why Choose{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            StudNest?
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-gray-700 rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Hostels Gallery */}
      <section className="py-20 px-6 md:px-12 bg-white dark:bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Trending{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Hostels
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
{dummyHostelImages.map((src, idx) => (
  <div
    key={idx}
    onClick={() => navigate('/explore')}
    className="cursor-pointer rounded overflow-hidden border border-purple-300 dark:border-gray-600 shadow-md hover:shadow-xl hover:scale-105 transition"
  >
    <img src={src} alt={`Hostel ${idx + 1}`} className="w-full h-52 object-cover" />
  </div>
))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Landing;
