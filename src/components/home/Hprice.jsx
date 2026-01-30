import { useEffect, useState } from "react";
import Heading from "../common/heading/Heading";
import PriceCard from "../pricing/PriceCard";

const Hprice = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Kaustubh200429/macht-mit-Price/main/Price.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setPrices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch pricing", err);
        setLoading(false);
      });
  }, []);
 
  return (
    <section className="hprice padding">
      <Heading subtitle="OUR PRICING" title="Pricing & Packages" />

      <div className="price container grid">
        {loading && <p>Loading pricing plans...</p>}

        {!loading &&
          prices.map((item, index) => (
            <PriceCard key={index} item={item} />
          ))}
      </div>
    </section>
  );
};

export default Hprice;
