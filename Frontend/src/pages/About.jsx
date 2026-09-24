import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaUserGraduate, FaCity, FaMapMarkedAlt, FaRocket, FaCheckCircle } from 'react-icons/fa';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const team = [
  {
    name: 'Satyam Rajput',
    role: 'Frontend Developer',
    img: '/Satyam_Image.jpg',
    linkedin: 'https://www.linkedin.com/in/satyam-rajput-0b8a80291/',
    github: 'https://github.com/satyam-rjpt13',
  },
  {
    name: 'Hemant Kumar',
    role: 'Backend Developer',
    img: '/hemant.jpg',
    linkedin: 'https://www.linkedin.com/in/hemant-kumar-406310291/',
    github: 'https://github.com/Hemant-kumar24',
  },
  {
    name: 'Ankit verma',
    role: 'Backend Developer',
    img: 'https://randomuser.me/api/portraits/men/65.jpg',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Praveen Chaurasia',
    role: 'Frontend Developer',
    img: 'https://randomuser.me/api/portraits/men/60.jpg',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Sumit Kaushik',
    role: 'frontend Developer',
    img: 'https://randomuser.me/api/portraits/men/77.jpg',
    linkedin: '#',
    github: '#',
  },
];

const videoItems = [
  'https://www.youtube.com/embed/UZrsTqkcW4',
  'https://www.youtube.com/embed/pAJ0s5S2t0',
  'https://www.youtube.com/embed/GcsHMXbSOA',
];

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">

        {/* Welcome Header */}
        <section className="pt-20 pb-10 text-center px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold text-gray-800 dark:text-white"
          >
            Welcome to <span className="text-pink-400">StudNest</span>
          </motion.h1>

          <motion.p
            className="text-lg max-w-xl mx-auto mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your trusted platform to discover hostels and PGs near your college, built with students in mind.
          </motion.p>
        </section>

        {/* Info Cards */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                icon: <FaRocket className="text-blue-600" />,
                title: 'Our Mission',
                content: `Simplify and secure hostel discovery for students. Verified listings and powerful tools to help you find a second home.`,
              },
              {
                icon: <FaUserGraduate className="text-green-500" />,
                title: 'Who We Serve',
                content: `From students seeking comfort and convenience to parents ensuring safety — StudNest is your go-to platform.`,
              },
              {
                icon: <FaMapMarkedAlt className="text-purple-600" />,
                title: 'How It Works',
                content: (
                  <ul className="list-disc ml-5 mt-2 space-y-2">
                    <li>🔍 Search PGs/Hostels by city or college</li>
                    <li>✅ Verified listings with amenities</li>
                    <li>📆 Book directly on the platform</li>
                  </ul>
                ),
              },
              {
                icon: <FaCheckCircle className="text-yellow-500" />,
                title: 'Why Choose StudNest?',
                content: (
                  <ul className="list-disc ml-5 mt-2 space-y-2">
                    <li>✅ Clean & Responsive UI</li>
                    <li>🔐 Secure authentication</li>
                    <li>🌍 Location filters & photos</li>
                    <li>📸 Hostel ratings and more</li>
                  </ul>
                ),
              },
              {
                icon: <FaCity className="text-red-500" />,
                title: 'Our Future Plans',
                content: (
                  <ul className="list-disc ml-5 mt-2 space-y-2">
                    <li>⭐ Student reviews & ratings</li>
                    <li>📍 Google Maps integration</li>
                    <li>🧾 Rent tracking & reminders</li>
                    <li>📊 Hostel analytics dashboard</li>
                  </ul>
                ),
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                className={`bg-white/70 dark:bg-gray-900 rounded-xl p-6 shadow-lg backdrop-blur-xl ${
                  idx === 4 ? 'md:col-span-2' : ''
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  {section.icon} {section.title}
                </h2>
                <div className="mt-3 text-sm leading-relaxed">{section.content}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <section className="py-12 px-4">
          <h2 className="text-3xl font-semibold text-center mb-10">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-tr from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md p-6 text-center hover:scale-105 transition"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow"
                />
                <h3 className="text-lg font-bold mt-4">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
                <div className="flex justify-center mt-3 space-x-4">
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <FaLinkedin className="text-blue-600 hover:scale-110" />
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer">
                    <FaGithub className="text-gray-800 dark:text-white hover:scale-110" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Video Carousel */}
        <div className="py-16 px-6">
          <h2 className="text-3xl font-semibold text-center mb-6">Explore Our Journey</h2>
          <Carousel
            autoPlay
            infinite
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
              tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
            }}
            showDots
          >
            {videoItems.map((src, index) => (
              <div key={index} className="flex justify-center">
                <iframe
                  width="800"
                  height="400"
                  src={src}
                  title={`Video ${index}`}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-xl shadow-xl"
                ></iframe>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
