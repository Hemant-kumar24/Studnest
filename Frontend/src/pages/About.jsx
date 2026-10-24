
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
  FaHeart,
  FaCalendarCheck,
  FaUserShield,
  FaGraduationCap,
  FaLaptopCode,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaCode,
  FaCheckCircle,
  FaLightbulb,
  FaRocket,
  FaHome,
} from "react-icons/fa";
import {
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiJavascript,
} from "react-icons/si";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
  {
    icon: FaSearch,
    title: "Smart Hostel Discovery",
    description:
      "Explore hostels and PGs and use available search and filter options to find accommodation that matches your needs.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Location-Based Search",
    description:
      "Discover accommodation options around your college and explore nearby listings using available location features.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: FaShieldAlt,
    title: "Listing Management",
    description:
      "Help students make informed choices with detailed accommodation information and administrator-managed listings.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: FaHeart,
    title: "Favorite Hostels",
    description:
      "Save interesting accommodation options so you can revisit and compare your preferred listings.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: FaCalendarCheck,
    title: "Booking Management",
    description:
      "Use the available booking workflow to manage accommodation requests and review booking information.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: FaUserShield,
    title: "Separate User Roles",
    description:
      "Dedicated student and administrator experiences help organize platform access and accommodation management.",
    color: "from-orange-500 to-amber-500",
  },
];

const technologies = [
  {
    name: "React.js",
    icon: FaReact,
    description: "Frontend interface",
    color: "text-cyan-500",
  },
  {
    name: "Node.js",
    icon: FaNodeJs,
    description: "Backend runtime",
    color: "text-green-600",
  },
  {
    name: "Express.js",
    icon: SiExpress,
    description: "REST API development",
    color: "text-gray-800 dark:text-gray-200",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    description: "Database",
    color: "text-green-500",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    description: "Responsive styling",
    color: "text-cyan-500",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    description: "Application logic",
    color: "text-yellow-500",
  },
];

const developmentGoals = [
  "Improve hostel discovery and location accuracy",
  "Enhance the mobile experience and accessibility",
  "Strengthen authentication and platform security",
  "Improve listing quality and administrative controls",
  "Add useful student-focused features based on feedback",
];

const About = () => {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-5 py-20 text-white sm:px-8 sm:py-28">
          <div
            aria-hidden="true"
            className="absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 -right-20 -z-10 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl"
          />

          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-purple-100 backdrop-blur">
                <FaGraduationCap className="text-pink-300" />
                Built for student accommodation
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                About{" "}
                <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  StudNest
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-indigo-100/85 sm:text-lg">
                Finding a suitable place to stay should not be complicated.
                StudNest is a full-stack web platform designed to help students
                discover hostels and PGs near their colleges and manage their
                accommodation journey in one place.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/explore"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:-translate-y-1 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  Explore Hostels
                  <FaArrowRight />
                </Link>

                <Link
                  to="/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <FaHome />
                  Back to Home
                </Link>
              </div>
            </motion.div>

            {/* Project introduction visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative mx-auto w-full max-w-lg"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-pink-500/20 blur-2xl" />

              <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600">
                      <FaHome size={23} />
                    </div>

                    <div>
                      <h2 className="font-bold">StudNest</h2>
                      <p className="text-sm text-indigo-100/65">
                        Student accommodation platform
                      </p>
                    </div>
                  </div>

                  <FaCheckCircle className="text-xl text-emerald-300" />
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200">
                      <FaSearch size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Discover</p>
                      <p className="mt-1 text-sm text-indigo-100/65">
                        Explore accommodation listings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 text-pink-200">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Find Nearby Options</p>
                      <p className="mt-1 text-sm text-indigo-100/65">
                        Search around your college
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                      <FaCalendarCheck size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Manage Your Stay</p>
                      <p className="mt-1 text-sm text-indigo-100/65">
                        Access available booking features
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-pink-500/20 p-4">
                  <p className="text-sm leading-6 text-purple-100">
                    One platform to make the student accommodation search
                    easier and more organized.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project overview */}
        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                The idea behind the platform
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                Making student accommodation easier to find
              </h2>

              <p className="mt-5 leading-8 text-gray-600 dark:text-gray-300">
                Students moving to a new city or college often need to compare
                different hostels and paying guest accommodations. Finding
                useful information across different sources can take time.
              </p>

              <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
                StudNest brings accommodation listings, search tools, user
                accounts, favorites, and booking-related features together in
                a single web application. The goal is to make the discovery
                process clearer and easier to manage.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-purple-100 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-8 dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/40"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <FaLightbulb size={25} />
              </div>

              <h3 className="mt-6 text-2xl font-bold">The main objective</h3>

              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                Create a practical, user-friendly platform that connects
                students with accommodation options while providing
                administrators with tools to manage listings and platform
                activity.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Student-focused design",
                  "Organized accommodation listings",
                  "Separate student and admin experiences",
                  "A scalable full-stack architecture",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <FaCheckCircle className="mt-1 shrink-0 text-emerald-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 px-5 py-20 sm:px-8 sm:py-24 dark:bg-gray-900/60">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400">
                Platform capabilities
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                What StudNest Offers
              </h2>

              <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
                Features designed to organize the search, comparison, and
                management of student accommodation.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    whileHover={{ y: -5 }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-purple-500/10 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                    >
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology stack */}
        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                Behind the application
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Technology Stack
              </h2>

              <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
                StudNest is built using modern web technologies for its
                frontend, backend, API layer, and database.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {technologies.map((tech, index) => {
                const Icon = tech.icon;

                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-700"
                  >
                    <Icon
                      className={`mx-auto text-3xl ${tech.color}`}
                      aria-hidden="true"
                    />

                    <h3 className="mt-4 text-sm font-bold">{tech.name}</h3>

                    <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {tech.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                "REST APIs",
                "JWT Authentication",
                "React Router",
                "Framer Motion",
                "Git & GitHub",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Individual project */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-5 py-20 sm:px-8 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950/30">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                Project development
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                From an idea to a full-stack application
              </h2>

              <p className="mt-5 leading-8 text-gray-600 dark:text-gray-300">
                StudNest is an individual full-stack development project
                focused on solving a practical student problem. It brings
                together frontend development, backend APIs, database
                operations, authentication, and responsive interface design.
              </p>

              <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
                Developing the platform provides hands-on experience with
                application architecture, API integration, data management,
                debugging, and improving a web product through testing and
                iteration.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg">
                <FaLaptopCode size={25} />
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Development Focus
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <FaCode className="mt-1 shrink-0 text-indigo-500" />
                  <div>
                    <h4 className="font-semibold">Full-Stack Development</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      Connecting the React interface with backend services
                      and MongoDB data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaShieldAlt className="mt-1 shrink-0 text-purple-500" />
                  <div>
                    <h4 className="font-semibold">Authentication & Access</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      Organizing student and administrator access to
                      application features.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaRocket className="mt-1 shrink-0 text-pink-500" />
                  <div>
                    <h4 className="font-semibold">Continuous Improvement</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      Improving usability, responsiveness, reliability,
                      and maintainability.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaDatabase className="mt-1 shrink-0 text-emerald-500" />
                  <div>
                    <h4 className="font-semibold">Data Management</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      Working with structured application data and API
                      responses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future development */}
        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400">
                What's next?
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                The Road Ahead
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">
                StudNest can continue evolving with improvements focused on
                accuracy, usability, and the needs of students and
                accommodation providers.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-9 dark:border-gray-800 dark:bg-gray-900">
              <div className="space-y-5">
                {developmentGoals.map((goal, index) => (
                  <div key={goal} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>

                    <p className="pt-1 leading-6 text-gray-700 dark:text-gray-300">
                      {goal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-20 sm:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-white/10"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full border-[35px] border-white/10"
            />

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Find Your Next Stay with StudNest
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-purple-100">
                Explore accommodation listings and discover options that
                could make your college journey easier.
              </p>

              <Link
                to="/explore"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 font-bold text-purple-700 shadow-lg transition hover:-translate-y-1 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700"
              >
                Explore StudNest
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
