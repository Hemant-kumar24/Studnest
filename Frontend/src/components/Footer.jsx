
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaArrowUp,
  FaArrowRight,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    // No newsletter backend is connected yet.
    setMessage(
      "Newsletter subscriptions are not available yet. Please check back later."
    );
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Explore Hostels", path: "/explore" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden rounded-t-[2rem] border-t border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 text-slate-900 shadow-[0_-8px_40px_rgba(49,46,129,0.08)] transition-colors duration-300 dark:border-slate-800 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 dark:text-white dark:shadow-[0_-8px_40px_rgba(49,46,129,0.15)]">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-600/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-pink-400/10 blur-3xl dark:bg-pink-600/10"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 lg:px-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              to="/"
              onClick={scrollToTop}
              aria-label="StudNest home"
              className="inline-flex items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <span className="text-3xl font-black tracking-tight text-pink-600 sm:text-4xl dark:text-pink-300">
                Stud
              </span>
              <span className="text-3xl font-black tracking-tight text-amber-600 sm:text-4xl dark:text-yellow-300">
                Nest
              </span>
              <span className="ml-1.5 mt-2 h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_12px_rgba(249,168,212,0.4)] dark:bg-pink-300 dark:shadow-[0_0_12px_rgba(249,168,212,0.8)]" />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-indigo-100/75">
              Your journey to a better student stay starts here. Explore PGs
              and hostels near your college and find accommodation that suits
              your needs and budget.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-indigo-100/80">
              <FaMapMarkerAlt className="shrink-0 text-pink-300" />
              <span>Find accommodation near your college</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Links
            </h2>

            <div className="mt-5 flex flex-col items-start gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group inline-flex items-center gap-2 text-sm text-slate-600 dark:text-indigo-100/75 transition hover:translate-x-1 hover:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <FaArrowRight
                    size={10}
                    className="text-pink-300 opacity-0 transition group-hover:opacity-100"
                  />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Student support */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Student Support
            </h2>

            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-indigo-100/75">
              Need help exploring StudNest or have a question about the
              platform?
            </p>

            <Link
              to="/contact"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:border-white/15 dark:bg-white/5 dark:text-white transition hover:border-pink-300/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Contact Us
              <FaArrowRight size={12} />
            </Link>

            <div className="mt-5 flex items-start gap-3 text-sm text-slate-600 dark:text-indigo-100/75">
              <FaShieldAlt className="mt-1 shrink-0 text-green-300" />
              <p>
                Review listing details carefully before choosing your
                accommodation.
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Stay Connected
            </h2>

            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-indigo-100/75">
              Get in touch with us for updates and information about StudNest.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-5">
              <label
                htmlFor="footer-email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-indigo-100"
              >
                Your email address
              </label>

              <div className="flex min-w-0 flex-col gap-3">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 dark:border-white/15 dark:bg-white/10 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-indigo-100/50 focus:border-pink-300 focus:ring-2 focus:ring-pink-300/20"
                />

                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/20 transition hover:from-pink-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-indigo-950"
                >
                  Stay Updated
                  <FaArrowRight size={12} />
                </button>
              </div>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-xs leading-5 text-amber-700 dark:text-yellow-200"
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Social links */}
        <div className="mt-12 flex flex-col gap-5 border-t border-slate-200 pt-7 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Follow StudNest
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-indigo-100/60">
              Stay connected with our community.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-indigo-100 transition hover:-translate-y-1 hover:border-blue-300/40 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-indigo-100 transition hover:-translate-y-1 hover:border-pink-300/40 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <FaInstagram size={17} />
            </a>

            <a
              href="mailto:info@studnest.com"
              aria-label="Email StudNest"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-indigo-100 transition hover:-translate-y-1 hover:border-purple-300/40 hover:bg-purple-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <FaEnvelope size={16} />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-white/10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs leading-6 text-slate-500 dark:text-indigo-100/60 sm:text-sm">
            © {currentYear}{" "}
            <span className="font-bold text-amber-600 dark:text-yellow-300">StudNest</span>.
            All rights reserved.
          </p>

          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-indigo-100/60 sm:text-sm">
            Made for students, with
            <FaHeart className="text-pink-600 dark:text-pink-400" />
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Back to top"
            className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-indigo-200 bg-gradient-to-br from-indigo-600 to-purple-600 dark:border-white/20 text-white shadow-xl shadow-indigo-950/30 transition hover:-translate-y-1 hover:from-indigo-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300 sm:static sm:h-10 sm:w-10 sm:shrink-0"
          >
            <FaArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
