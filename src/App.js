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

import { BrowserRouter, Route, useLocation } from "react-router-dom";
import LoginPage from "./components/login/Login";
import AdminDashBoard from "./components/admin-dashboard/AdminDashboard";
import EnRollToCourse from "./components/enrollToCourse/EnrollToCourse";
import SignupPage from "./components/signup/Signup";

function App() {
  const location = useLocation();
  const hideLayoutRoutes = ["/login"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      <Header />
      <BrowserRouter>
        {/* PUBLIC */}
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/courses" component={CourseHome} />
        <Route exact path="/team" component={Team} />
        <Route exact path="/pricing" component={Pricing} />
        <Route exact path="/payments" component={Payments} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/admin-dashboard" component={AdminDashBoard} />
        <Route exact path="/enroll" component={EnRollToCourse} />
        <Route exact path="/signup" component={SignupPage} />
        {/* ADMIN */}
        <Route exact path="/admin" component={AdminLogin} />
      </BrowserRouter>
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default App;
