import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Payments.css";
import { SiPhonepe } from 'react-icons/si'
import { FaGooglePay } from "react-icons/fa";
import { SiPaytm } from "react-icons/si";
const Payments = () => {
  // 🔹 ALWAYS call hooks at top (no conditional hooks)
  const location = useLocation();

  const [method, setMethod] = useState("upi");
  const [paymentType, setPaymentType] = useState("full");

  // 🔹 SAFE fallback state
  const state = location.state || {};

  // 🔹 SOURCE (pricing / courses)
  const source = state.source || "pricing";

  // 🔹 COURSE / PLAN NAME
  const courseName =
    state.courseName || state.planName || "Selected Plan";

  // 🔹 PRICES (raw)
  const fullPriceRaw = state.fullPrice || state.price || "₹0";
  const monthlyPriceRaw = state.monthlyPrice || "₹0";

  // 🔹 CLEAN PRICES
  const fullPrice = fullPriceRaw.replace(/[₹,]/g, "");
  const monthlyPrice = monthlyPriceRaw.replace(/[₹,]/g, "");

  // 🔹 FINAL AMOUNT LOGIC
  const amount =
    source === "courses"
      ? paymentType === "monthly"
        ? monthlyPrice
        : fullPrice
      : fullPrice;

  // 🔹 UPI STRING (LOCKED AMOUNT)
  const upiString = `upi://pay?pa=9148526550@ybl&pn=MACHTMIT&am=${amount}&cu=INR&tn=${encodeURIComponent(
    courseName + " Fee"
  )}`;

  return (
    <div className="payment-container">
      <h1>Complete Your Payment</h1>
      <p>Select a payment method to proceed</p>

      <div className="payment-box">

        {/* ================= STEPPER ================= */}
        <div className="stepper-box">

          <div className="stepper-step stepper-completed">
            <div className="stepper-circle">✓</div>
            <div className="stepper-line"></div>
            <div className="stepper-content">
              <div className="stepper-title">{courseName}</div>
              <div className="stepper-status">
                Amount: ₹{amount}
                {source === "courses" && paymentType === "monthly" && " / month"}
              </div>
              <div className="stepper-time">Time Zone : IST</div>
            </div>
          </div>

          <div className="stepper-step stepper-active">
            <div className="stepper-circle">2</div>
            <div className="stepper-line"></div>
            <div className="stepper-content">
              <div className="stepper-title">Processing</div>
              <div className="stepper-status">In Progress</div>
            </div>
          </div>

          <div className="stepper-step stepper-pending">
            <div className="stepper-circle">3</div>
            <div className="stepper-content">
              <div className="stepper-title">Payment Successful</div>
              <div className="stepper-status">Pending</div>
            </div>
          </div>

          <Link to="/pricing" className="stepper-button">
            Cancel Payment
          </Link>
        </div>

        {/* ================= PAYMENT METHODS ================= */}
        <div className="payment-methods">
          <button onClick={() => setMethod("upi")}>UPI</button>
          <button onClick={() => setMethod("card")}>Card</button>
          <button onClick={() => setMethod("netbanking")}>Net Banking</button>
          <button onClick={() => setMethod("wallet")}>Wallet</button>
        </div>

        {/* ================= PAYMENT CONTENT ================= */}
        <div className="payment-content">

          {/* 🔹 FULL / MONTHLY (ONLY FOR COURSES) */}
          {source === "courses" && (
            <div className="payment-type">
              <label>
                <input
                  type="radio"
                  checked={paymentType === "full"}
                  onChange={() => setPaymentType("full")}
                />
                Full Course – ₹{fullPrice}
              </label>

              <label>
                <input
                  type="radio"
                  checked={paymentType === "monthly"}
                  onChange={() => setPaymentType("monthly")}
                />
                Monthly – ₹{monthlyPrice}
              </label>
            </div>
          )}

          {/* ================= UPI ================= */}
          {method === "upi" && (
            <div className="upi">
              <h2>UPI Payment</h2>
              <p>Scan using any UPI app</p>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                  upiString
                )}`}
                alt="UPI QR"
              />

              <p><b>UPI ID:</b> 9148526550@ybl</p>
              <p><b>Amount:</b> ₹{amount}</p>
            </div>
          )}

          {/* ================= CARD ================= */}
          {method === "card" && (
            <div className="card">
              <h2>Card Payment</h2>
              <input placeholder="Card Number" />
              <input placeholder="Name on Card" />
              <div className="row">
                <input placeholder="MM/YY" />
                <input placeholder="CVV" />
              </div>
              <button className="pay-btn">Pay ₹{amount}</button>
            </div>
          )}

          {/* ================= NET BANKING ================= */}
          {method === "netbanking" && (
            <div className="netbanking">
              <h2>Net Banking</h2>
              <select>
                <option>Select Bank</option>
                <option>SBI</option>
                <option>HDFC</option>
                <option>ICICI</option>
              </select>
              <button className="pay-btn">Pay ₹{amount}</button>
            </div>
          )}

          {/* ================= WALLET ================= */}
          {method === "wallet" && (
            <div className="wallet">
              <h2>Wallet</h2>
              PhonePe<button>  <SiPhonepe size={40} color="#5f27cd" /></button><br></br>
              Google Pay<button ><FaGooglePay size={40} /></button> <br></br>
              Paytm<button><SiPaytm size={40} color="#00BAF2"/></button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Payments;
