import { useNavigate } from "react-router-dom";

const PriceCard = ({ item }) => {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate("/payments", {
      state: {
        // 🔹 REQUIRED by Payments.jsx
        courseName: item.name,          // used in stepper + QR
        fullPrice: item.price,          // e.g. ₹28,000
        monthlyPrice: item.monthly || "₹0", // fallback if not present

        // 🔹 keep your existing data (no harm)
        planName: item.name,
        price: item.price,
        source: "pricing",
      },
    });
  };

  return (
    <div className="price-card">
      <h3>{item.name}</h3>
      <h1>{item.price}</h1>
      {item.desc}

      <button onClick={handleEnroll}>
        ENROLL NOW
      </button>
    </div>
  );
};

export default PriceCard;
