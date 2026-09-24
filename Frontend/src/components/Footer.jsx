import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white px-6 py-12 mt-20 rounded-t-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
      {/* Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo + Description */}
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <h1 className="text-4xl font-extrabold tracking-wide mb-2">
            <span className="text-pink-300">Stud</span>
            <span className="text-yellow-300">Nest</span>
          </h1>
          <p className="text-sm text-gray-300 max-w-xs">
            Helping students find the best PGs and hostels near colleges with comfort, affordability, and trust.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 text-sm text-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-pink-200">Quick Links</h2>
          <div className="flex flex-col gap-1">
            <button onClick={() => navigate('/')} className="hover:text-yellow-300 transition">Home</button>
            <button onClick={() => navigate('/about')} className="hover:text-yellow-300 transition">About</button>
            <button onClick={() => navigate('/contact')} className="hover:text-yellow-300 transition">Contact</button>
          </div>
        </div>

        {/* Newsletter */}
        <div className="text-sm text-gray-200 w-full md:w-auto">
          <h2 className="text-lg font-semibold mb-2 text-pink-200">Stay Updated</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Subscribed!');
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-full text-gray-800 focus:outline-none w-full sm:w-auto"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-2 rounded-full text-white font-medium hover:from-indigo-600 hover:to-pink-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="text-white text-xl flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition"><FaInstagram /></a>
          <a href="mailto:info@studnest.com" className="hover:text-pink-300 transition"><FaEnvelope /></a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 text-center text-sm text-gray-400 border-t border-white/20 pt-4 relative">
        © {new Date().getFullYear()} <span className="text-yellow-300 font-semibold">StudNest</span>. All rights reserved.

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white text-purple-800 p-2 rounded-full shadow hover:bg-gray-100 transition"
          title="Back to top"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
