import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaArrowRight,
  FaBed,
  FaCheckCircle,
  FaCompass,
  FaHeart,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
  FaSlidersH,
  FaTimes,
  FaUserGraduate,
  FaUserShield,
  FaWallet,
} from "react-icons/fa";

const features = [
  {
    number: "01",
    title: "Search around your campus",
    description:
      "Explore accommodation options near your college and spend less time searching across different places.",
    icon: FaMapMarkerAlt,
    accent: "from-indigo-500 to-blue-500",
    glow: "group-hover:shadow-indigo-500/10",
  },
  {
    number: "02",
    title: "Compare your options",
    description:
      "Review room types, rent, amenities, and listing details before deciding what suits you.",
    icon: FaSlidersH,
    accent: "from-fuchsia-500 to-pink-500",
    glow: "group-hover:shadow-pink-500/10",
  },
  {
    number: "03",
    title: "Make a confident choice",
    description:
      "Use clear information to shortlist stays that fit your preferences and student budget.",
    icon: FaShieldAlt,
    accent: "from-violet-500 to-purple-500",
    glow: "group-hover:shadow-purple-500/10",
  },
];

const roomTypes = [
  {
    title: "Single Seater",
    subtitle: "More personal space",
    image: "/1seaterAC.webp",
    tag: "Privacy first",
    icon: FaBed,
  },
  {
    title: "Double Seater",
    subtitle: "A shared room option",
    image: "/2seaterAc.jpg",
    tag: "Balanced choice",
    icon: FaUserGraduate,
  },
  {
    title: "Triple Seater",
    subtitle: "Explore budget-friendly stays",
    image: "/3seaterAC.webp",
    tag: "Budget friendly",
    icon: FaWallet,
  },
  {
    title: "Explore All Stays",
    subtitle: "Find a stay that fits you",
    image: "/dummy4.jpg",
    tag: "More choices",
    icon: FaCompass,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (!showModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  const handleExplore = () => {
    const query = searchText.trim();
    navigate(query ? `/explore?search=${encodeURIComponent(query)}` : "/explore");
  };

  const handleContinue = (path) => {
    closeModal();
    navigate(path);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate min-h-[700px] overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center"
          style={{ backgroundImage: "url('/hostel_background_image.jpeg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950/95 via-indigo-950/85 to-purple-950/75" />
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(129,140,248,.35), transparent 30%), radial-gradient(circle at 85% 65%, rgba(236,72,153,.28), transparent 30%)",
          }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -left-12 top-44 h-48 w-48 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:pb-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="relative z-10 max-w-2xl text-center lg:text-left"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold tracking-wide text-purple-100 shadow-lg backdrop-blur-xl sm:text-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
              A smarter way to find your student stay
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Your college life.
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Your kind of place.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 lg:mx-0"
            >
              Find hostels and PGs near your college. Compare room options,
              monthly rent, and amenities—all in one student-friendly place.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.09] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row lg:mx-0"
            >
              <label className="flex min-h-12 flex-1 items-center gap-3 px-3">
                <FaSearch className="shrink-0 text-purple-200" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleExplore();
                  }}
                  type="search"
                  placeholder="Search by city, college, or area"
                  aria-label="Search hostels by city, college, or area"
                  className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-300"
                />
              </label>
              <button
                type="button"
                onClick={handleExplore}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Find a stay
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-200 sm:text-sm lg:justify-start"
            >
              <span className="inline-flex items-center gap-2"><FaCheckCircle className="text-emerald-300" /> Student-focused search</span>
              <span className="inline-flex items-center gap-2"><FaMapMarkerAlt className="text-pink-300" /> Near your campus</span>
              <span className="inline-flex items-center gap-2"><FaWallet className="text-purple-300" /> Budget-aware choices</span>
            </motion.div>
          </motion.div>

          {/* Floating visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative mx-auto w-full max-w-lg lg:ml-auto"
          >
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img
                  src="/hostel_background_image.jpeg"
                  alt="Student accommodation building"
                  className="h-[300px] w-full object-cover sm:h-[370px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  <FaShieldAlt className="text-emerald-300" />
                  Explore with clarity
                </div>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">Made for student life</p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">A place to focus, rest & grow.</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">
                    Browse accommodation details and shortlist options that feel right for you.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2 pt-4 text-center">
                <div className="rounded-xl border border-white/10 bg-white/[0.07] px-2 py-3">
                  <FaMapMarkerAlt className="mx-auto text-lg text-indigo-200" />
                  <p className="mt-2 text-xs font-semibold text-white">College nearby</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.07] px-2 py-3">
                  <FaBed className="mx-auto text-lg text-pink-200" />
                  <p className="mt-2 text-xs font-semibold text-white">Room options</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.07] px-2 py-3">
                  <FaHeart className="mx-auto text-lg text-purple-200" />
                  <p className="mt-2 text-xs font-semibold text-white">Your shortlist</p>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-1/3 hidden items-center gap-3 rounded-2xl border border-white/20 bg-slate-900/80 p-3 text-white shadow-xl backdrop-blur-xl sm:flex"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600"><FaCompass /></span>
              <span><strong className="block text-sm">Explore nearby</strong><small className="text-slate-300">Your next stay starts here</small></span>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-white to-transparent dark:from-slate-950" />
      </section>

      {/* Intro strip */}
      <section className="relative z-10 -mt-1 bg-white px-4 py-8 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: FaSearch, title: "Discover", detail: "Explore available listings" },
            { icon: FaSlidersH, title: "Compare", detail: "Review the details that matter" },
            { icon: FaHeart, title: "Choose", detail: "Shortlist your preferred stays" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-pink-100 text-xl text-indigo-700 dark:from-indigo-950 dark:to-pink-950 dark:text-purple-300"><Icon /></span>
                <span><strong className="block text-sm font-bold">{item.title}</strong><span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{item.detail}</span></span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-4 py-20 dark:bg-slate-950 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <motion.p variants={fadeUp} className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-purple-600 dark:text-purple-400">The StudNest difference</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Finding a stay,{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">made simpler.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
              A student-friendly starting point for exploring accommodation without making the process feel overwhelming.
            </motion.p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${feature.glow}`}
                >
                  <span className="absolute right-5 top-2 text-6xl font-black text-slate-100 dark:text-slate-800">{feature.number}</span>
                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-xl text-white shadow-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}><Icon /></div>
                  <h3 className="relative mt-7 text-xl font-extrabold">{feature.title}</h3>
                  <p className="relative mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{feature.description}</p>
                  <div className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${feature.accent} transition-all duration-300 group-hover:w-20`} />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Room categories */}
      <section className="relative overflow-hidden bg-slate-50 px-4 py-20 dark:bg-slate-900 sm:px-6 md:py-28">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-700/10" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-pink-600 dark:text-pink-400">Explore your options</p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">A room that fits <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">your life.</span></h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">Start with a room type, then explore listings and details to find the right fit for your college life.</p>
            </div>
            <button type="button" onClick={handleExplore} className="group inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-purple-100 md:self-auto">
              Explore all listings <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roomTypes.map((room, index) => {
              const Icon = room.icon;
              return (
                <motion.button
                  key={room.title}
                  type="button"
                  onClick={handleExplore}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.07 }}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-950"
                  aria-label={`Explore accommodation: ${room.title}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/hostel_background_image.jpeg";
                      }}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">{room.tag}</span>
                    <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-lg text-white backdrop-blur-md"><Icon /></span>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div>
                      <h3 className="font-extrabold">{room.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{room.subtitle}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-700 transition group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-pink-500 group-hover:text-white dark:bg-slate-800 dark:text-purple-300"><FaArrowRight size={13} /></span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-20 dark:bg-slate-950 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400">Your next step</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">From searching to <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">shortlisting.</span></h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-600 dark:text-slate-400">StudNest gives you a simple place to begin your accommodation search. Browse the listings, review the information, and decide which options are worth exploring further.</p>
            <button type="button" onClick={handleExplore} className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Start exploring <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { n: "1", title: "Explore listings", text: "Open the accommodation listings and browse the available options." },
              { n: "2", title: "Check the details", text: "Compare location, room type, rent, and amenities where provided." },
              { n: "3", title: "Shortlist your favourites", text: "Keep track of the stays you like and revisit your choices." },
            ].map((step, index) => (
              <motion.div key={step.n} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.1 }} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 text-lg font-black text-white shadow-lg">{step.n}</span>
                <div><h3 className="font-extrabold">{step.title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.text}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 pb-20 dark:bg-slate-950 sm:px-6 md:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-6 py-14 text-center text-white shadow-2xl shadow-purple-900/20 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl backdrop-blur"><FaMapMarkerAlt /></span>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-purple-100">Your next chapter starts here</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">Find a place that feels like yours.</h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-purple-100">Explore student accommodation around your college and take the next step with StudNest.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={handleExplore} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 font-extrabold text-purple-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700">Explore hostels <FaArrowRight className="transition-transform group-hover:translate-x-1" /></button>
              <button type="button" onClick={() => setShowModal(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-7 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">Create an account</button>
            </div>
          </div>
        </div>
      </section>

      {/* Account type modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="continue-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-8"
          >
            <button type="button" onClick={closeModal} aria-label="Close dialog" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:hover:bg-slate-800 dark:hover:text-white"><FaTimes /></button>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 text-white shadow-lg"><FaUserGraduate size={28} /></div>
            <h2 id="continue-title" className="text-center text-2xl font-black">Welcome to StudNest</h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">Choose how you would like to continue.</p>
            <div className="mt-7 space-y-3">
              <button type="button" onClick={() => handleContinue("/user/register")} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:hover:bg-slate-800">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><FaUserGraduate size={21} /></span>
                <span className="min-w-0 flex-1"><span className="block font-extrabold">Continue as Student</span><span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">Explore stays and manage your account.</span></span>
                <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
              </button>
              <button type="button" onClick={() => handleContinue("/admin/login")} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-pink-400 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-slate-700 dark:hover:bg-slate-800">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"><FaUserShield size={21} /></span>
                <span className="min-w-0 flex-1"><span className="block font-extrabold">Admin login</span><span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">Open the administrator sign-in page.</span></span>
                <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-pink-600" />
              </button>
            </div>
            <button type="button" onClick={closeModal} className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-slate-300 dark:hover:bg-slate-800">Maybe later</button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}