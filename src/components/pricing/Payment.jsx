import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./Payment.css";

const PRICE_URL =
  "https://raw.githubusercontent.com/Kaustubh200429/macht-mit-Price/main/Price.json";

const Payment = () => {
  const location = useLocation();
  const history = useHistory();

  const selectedPlanName = location.state?.planName || "";

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("UPI");

  useEffect(() => {
    fetch(PRICE_URL)
      .then((res) => res.json())
      .then((data) => {
        const matchedPlan = data.find(
          (p) => p.name === selectedPlanName
        );
        setPlan(matchedPlan);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Price fetch failed", err);
        setLoading(false);
      });
  }, [selectedPlanName]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading payment…</p>;

  if (!plan)
    return (
      <p style={{ textAlign: "center" }}>
        Invalid plan selected
      </p>
    );

  const amount = Number(plan.price.replace(/[₹,]/g, ""));

  return (
    <div className="payment-page">
      <h1 className="payment-title">Complete Your Payment</h1>
      <p className="payment-subtitle">
        Select a payment method to proceed
      </p>

      <div className="payment-wrapper">
        {/* LEFT STEP CARD */}
        <div className="payment-steps">
          <div className="step active">
            <span className="circle">✓</span>
            <div>
              <h3>{plan.name}</h3>
              <span className="amount-tag">
                Amount: ₹{amount} All Course
              </span>
              <p className="timezone">Time Zone: IST</p>
            </div>
          </div>

          <div className="step">
            <span className="circle">2</span>
            <div>
              <h4>Processing</h4>
              <span className="status processing">In Progress</span>
            </div>
          </div>

          <div className="step disabled">
            <span className="circle">3</span>
            <div>
              <h4>Payment Successful</h4>
              <span className="status pending">Pending</span>
            </div>
          </div>

          <button
            className="cancel-btn"
            onClick={() => history.goBack()}
          >
            Cancel Payment
          </button>
        </div>

        {/* MIDDLE PAYMENT METHOD */}
        <div className="payment-methods">
          {["UPI", "Card", "Net Banking", "Wallet"].map((m) => (
            <button
              key={m}
              className={method === m ? "method active" : "method"}
              onClick={() => setMethod(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* RIGHT PAYMENT VIEW */}
        <div className="payment-panel">
          {method === "UPI" && (
            <>
              <h2>UPI Payment</h2>
              <p>Scan using any UPI app</p>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=9148526550@ybl&pn=MACHTMIT&am=${amount}&cu=INR`}
                alt="UPI QR"
              />

              <p>
                <b>UPI ID:</b> 9148526550@ybl
              </p>
              <p>
                <b>Amount:</b> ₹{amount} All Course
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
