import React from "react";

const Support = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Support</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-700 dark:text-gray-200 mb-4">Have an issue? Reach out and we’ll help you quickly.</p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-1">
            <li>Email: support@studnest.com</li>
            <li>Phone: +91 98765 43210</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">FAQs</h3>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
            <li>How do I save a hostel to favorites?</li>
            <li>How can I update my profile information?</li>
            <li>How do I leave a review?</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Support;