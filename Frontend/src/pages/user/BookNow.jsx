import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; // Unified axios instance
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BookNow = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    // paymentMethod will be handled by Razorpay
  });
  const [submissionStatus, setSubmissionStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  // Replace with your actual Razorpay Key ID
  const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'; 

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/hostels/${hostelId}`);
        setHostel(response.data);
      } catch (err) {
        setError('Failed to fetch hostel details.');
        console.error('Error fetching hostel details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [hostelId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const calculateTotalAmount = () => {
    if (!hostel || !bookingDetails.checkInDate || !bookingDetails.checkOutDate) return 0;

    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return hostel.price * diffDays * bookingDetails.numberOfGuests;
  };

  const displayRazorpay = async (amount) => {
    const options = {
      key: RAZORPAY_KEY_ID, // Your Key ID
      amount: amount * 100, // Amount is in currency subunits. Hence, 100 = 1 Rupee
      currency: 'INR', // Or your desired currency
      name: 'StudNest Bookings',
      description: `Booking for ${hostel.name}`,
      image: '/logo192.png', // Your company logo
      order_id: 'order_simulated_12345', // Replace with actual order ID from backend
      handler: async (response) => {
        // This function is called when the payment is successful
        console.log('Razorpay Response:', response);
        setSubmissionStatus({ loading: false, success: true, error: null });
        alert('Payment successful! Your booking is confirmed.');
        // In a real application, you would send response.razorpay_payment_id to your backend
        // for verification and to finalize the booking.
        navigate('/user/dashboard/my-bookings');
      },
      prefill: {
        name: 'Guest User', // Pre-fill user's name
        email: 'guest@example.com', // Pre-fill user's email
        contact: '9999999999', // Pre-fill user's phone number
      },
      notes: {
        hostel_id: hostelId,
        check_in: bookingDetails.checkInDate,
        check_out: bookingDetails.checkOutDate,
        guests: bookingDetails.numberOfGuests,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus({ loading: true, success: false, error: null });

    // Basic client-side validation
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate || !bookingDetails.numberOfGuests) {
      setSubmissionStatus({ loading: false, success: false, error: 'Please fill in all required fields.' });
      return;
    }

    if (new Date(bookingDetails.checkInDate) >= new Date(bookingDetails.checkOutDate)) {
      setSubmissionStatus({ loading: false, success: false, error: 'Check-out date must be after check-in date.' });
      return;
    }

    const totalAmount = calculateTotalAmount();
    if (totalAmount <= 0) {
      setSubmissionStatus({ loading: false, success: false, error: 'Invalid booking dates or number of guests.' });
      return;
    }

    // Simulate order creation (in a real app, this would be an API call to your backend)
    // Your backend would create a Razorpay Order and return its ID
    try {
      // Example: const response = await axiosInstance.post('/api/razorpay/order', { amount: totalAmount });
      // const orderId = response.data.orderId;
      // For now, we simulate an order ID
       

      displayRazorpay(totalAmount);

    } catch (err) {
      console.error('Error initiating payment:', err);
      setSubmissionStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to initiate payment.',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading hostel details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!hostel) {
    return <div className="text-center py-10">Hostel not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Book Your Stay at {hostel.name}</h1>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Hostel Details</h2>
          <p className="mb-2"><strong>Name:</strong> {hostel.name}</p>
          <p className="mb-2"><strong>Location:</strong> {hostel.location}</p>
          <p className="mb-2"><strong>Price per night:</strong> ${hostel.price}</p>
          {/* Add more hostel details as needed */}

          <h2 className="text-2xl font-semibold mt-8 mb-6">Booking Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-bold mb-2">
                Check-in Date:
              </label>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                value={bookingDetails.checkInDate}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-bold mb-2">
                Check-out Date:
              </label>
              <input
                type="date"
                id="checkOutDate"
                name="checkOutDate"
                value={bookingDetails.checkOutDate}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="numberOfGuests" className="block text-gray-700 text-sm font-bold mb-2">
                Number of Guests:
              </label>
              <input
                type="number"
                id="numberOfGuests"
                name="numberOfGuests"
                value={bookingDetails.numberOfGuests}
                onChange={handleInputChange}
                min="1"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-6">
              <p className="block text-gray-700 text-sm font-bold mb-2">
                Total Amount: <span className="text-lg font-semibold">₹{calculateTotalAmount().toFixed(2)}</span>
              </p>
            </div>

            {submissionStatus.loading && (
              <p className="text-blue-500 text-center mb-4">Initiating payment...</p>
            )}
            {submissionStatus.success && (
              <p className="text-green-500 text-center mb-4">Payment successful! Redirecting...</p>
            )}
            {submissionStatus.error && (
              <p className="text-red-500 text-center mb-4">{submissionStatus.error}</p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={submissionStatus.loading}
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookNow;
