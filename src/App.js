import "./App.css";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";

import About from "./components/about/About";
import CourseHome from "./components/allcourses/CourseHome";
import Team from "./components/team/Team";
import Pricing from "./components/pricing/Pricing";
import Contact from "./components/contact/Contact";
import Home from "./components/home/Home";

import Payments from "./components/payment/Payments";
import AdminLogin from "./components/admin/AdminLogin";

import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/login/Login";
import AdminDashBoard from "./components/admin-dashboard/AdminDashboard";
import EnRollToCourse from "./components/enrollToCourse/EnrollToCourse";
import SignupPage from "./components/signup/Signup";

function App() {
  // const location = useLocation();
  // const hideLayoutRoutes = ["/login"];
  // const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      <Header />
        <Routes>
          {/* PUBLIC */}
          <Route  path="/" element={<Home/>} />
          <Route  path="/about" element={<About/>} />
          <Route  path="/courses" element={<CourseHome/>} />
          <Route  path="/team" element={<Team/>} />
          <Route  path="/pricing" element={<Pricing/>} />
          <Route  path="/payments" element={<Payments/>} />
          <Route  path="/contact" element={<Contact/>} />
          <Route  path="/login" element={<LoginPage/>} />
          <Route  path="/admin-dashboard" element={<AdminDashBoard/>} />
          <Route  path="/enroll" element={<EnRollToCourse/>} />
          <Route  path="/signup" element={<SignupPage/>} />
          {/* ADMIN */}
          <Route  path="/admin" element={<AdminLogin/>} />
        </Routes>
      <Footer />
    </>
  );
}

export default App;
