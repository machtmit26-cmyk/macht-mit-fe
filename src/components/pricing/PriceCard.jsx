import { price } from "../../dummydata";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../auth";
import AppToast from "../toast/AppToast";
import { useState } from "react";

const PriceCard = () => {
  const history = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const handleEnroll = (course) => {
    if (isAuthenticated()) {
      history("/enroll", {
        state: {
          courseName: course.name,
          fullPrice: course.price?.replace(/[^\d]/g, ""),
          monthlyPrice: course.pricePer,
        },
      });
      return;
    }
    setToast({
      open: true,
      message:
        "Oops! It appears you're not logged in. Please log in to proceed further.",
      severity: "error",
    });
  };

  return (
    <>
      {price.map((val, index) => (
        <div className="items shadow" key={index}>
          <h4>{val.name}</h4>
          <h1>{val.price}</h1>

          {val.desc}

          <button className="outline-btn" onClick={() => handleEnroll(val)}>
            ENROLL NOW
          </button>
        </div>
      ))}
      <AppToast
        open={toast.open}
        setOpen={(open) => setToast({ ...toast, open })}
        message={toast.message}
        severity={toast.severity}
      />
    </>
  );
};

export default PriceCard;
