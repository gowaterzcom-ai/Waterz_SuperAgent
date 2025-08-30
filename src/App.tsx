import './App.css';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MainLayout from './components/Layouts/MainLayout';
import Home from './components/Home/Home';
import Booking from './components/Booking/Booking';
import Details from './components/YachtDetails/YachtDetails';
// import BookingDetails from './components/Booking/BookingDetails';
import Review from './components/YachtDetails/YatchReview';
import SignUp from './components/LoginSignup/SignUp';
import Login from './components/LoginSignup/Login';
import AgentsPage from './components/Choose/Choose';
import Earnigs from './components/Earning/Earning';
import Account from './components/Account/Account';
import AgentDetails from './components/Agent/AgentDetails';
import BookingData from './components/Booking/BookingData';
import BookingDetail from './components/YachtDetails/BookingDetails';
import { useAppSelector, useAppDispatch } from './redux/store/hook';
import { setUserDetails } from './redux/slices/userSlice';
import { authAPI } from './api/auth';
import GoogleCallback from './components/LoginSignup/GoogleCallback';
import CompleteProfile from './components/LoginSignup/CompleteProfile';

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  console.log("user id", userDetails.id )

  // On app load, if token exists but user details are not loaded, fetch the profile.
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Check using userDetails.id so that the effect is not re-triggered unnecessarily.
    if (token && userDetails.id) {
      const fetchUserProfile = async () => {
        try {
          const response = await authAPI.getUserProfile();
          // @ts-ignore
          const profile = response.user;
          console.log("profile", profile)
          // Map API response to our store's userDetails structure.
          dispatch(setUserDetails({
            id: profile._id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
            age: profile.age,
            address: profile.address,
            experience: profile.experience,
            accountHolderName: profile.accountHolderName,
            accountNumber: profile.accountNumber,
            bankName: profile.bankName,
            ifscCode: profile.ifscCode,
            imgUrl: profile.imgUrl,
            isVerified: profile.isVerified,
            isVerifiedByAdmin: profile.isVerifiedByAdmin,
          }));
        } catch (error) {
          console.error('Error fetching user profile', error);
        }
      };

      fetchUserProfile();
    }
  }, [dispatch, userDetails.id]);

  return (
    <>
      <Routes>
        <Route path="/auth-callback" element={<GoogleCallback />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout><Home/></MainLayout>} />
        <Route path="/bookings" element={<MainLayout><Booking/></MainLayout>} />
        <Route path="/booking/:id" element={<MainLayout><BookingData /></MainLayout>} />
        <Route path="/agent/:id" element={<MainLayout><AgentDetails/></MainLayout>} />
        <Route path="/yatch-details/:id" element={<MainLayout><Details/></MainLayout>} />
        <Route path="/booking-details" element={<MainLayout><BookingDetail/></MainLayout>} />
        {/* <Route path="/agent-form" element={<MainLayout><AgentForm/></MainLayout>} /> */}
        <Route path="/yatch-review" element={<MainLayout><Review/></MainLayout>} />
        <Route path="/agents" element={<MainLayout><AgentsPage/></MainLayout>} />
        <Route path="/earnings" element={<MainLayout><Earnigs/></MainLayout>} />
        <Route path="/account" element={<MainLayout><Account/></MainLayout>} />

      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;