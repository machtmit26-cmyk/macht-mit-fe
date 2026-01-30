import { useEffect, useState } from "react";
import AboutCard from "../about/AboutCard";
import Hero from "./hero/Hero";
import Hprice from "./Hprice";
import Loader from "./Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate page loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // 2 seconds loader

    return () => clearTimeout(timer);
  }, []);

  // 🔹 SHOW LOADER FIRST
  if (loading) {
    return <Loader />;
  }

  // 🔹 SHOW PAGE CONTENT AFTER LOADING
  return (
    <>
      <Hero />
      
      <AboutCard />
      <Hprice />
    </>
  );
};

export default Home;
