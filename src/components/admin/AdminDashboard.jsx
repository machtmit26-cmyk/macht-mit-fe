import { useEffect, useState } from "react";
import { CheckCircle, Clock, IndianRupee, Search, AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";
import "./admin.css";

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payments");
      setPayments(res.data);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (id) => {
    try {
      setVerifyingId(id);
      await api.put(`/payments/${id}/verify`);
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "Verified" } : p))
      );
    } catch (error) {
      alert("Failed to verify payment");
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = p.planName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "Pending").length,
    verified: payments.filter((p) => p.status === "Verified").length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-container">
          <div className="header-content">
            <div>
              <h1 className="header-title">Payment Verification</h1>
              <p className="header-subtitle">
                Manage and verify payment transactions
              </p>
            </div>
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Total Payments</p>
                <p className="stat-value">{stats.total}</p>
              </div>
              <div className="stat-icon blue">
                <IndianRupee />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-value pending">{stats.pending}</p>
              </div>
              <div className="stat-icon amber">
                <Clock />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Verified</p>
                <p className="stat-value verified">{stats.verified}</p>
              </div>
              <div className="stat-icon emerald">
                <CheckCircle />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Total Amount</p>
                <p className="stat-value">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="stat-icon slate">
                <IndianRupee />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by plan name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button
                onClick={() => setFilter("all")}
                className={`filter-btn ${filter === "all" ? "active-all" : ""}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("Pending")}
                className={`filter-btn ${
                  filter === "Pending" ? "active-pending" : ""
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("Verified")}
                className={`filter-btn ${
                  filter === "Verified" ? "active-verified" : ""
                }`}
              >
                Verified
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <Loader2 className="spinner" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="empty-state">
              <AlertCircle />
              <p className="empty-state-title">No payments found</p>
              <p className="empty-state-subtitle">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="payments-table">
              <thead className="table-header">
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredPayments.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="plan-name">{p.planName}</div>
                    </td>
                    <td>
                      <div className="amount-cell">
                        <IndianRupee />
                        {p.amount.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      {p.status === "Pending" ? (
                        <span className="status-badge pending">
                          <Clock />
                          Pending
                        </span>
                      ) : (
                        <span className="status-badge verified">
                          <CheckCircle />
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="action-cell">
                      {p.status === "Pending" && (
                        <button
                          onClick={() => verify(p._id)}
                          disabled={verifyingId === p._id}
                          className="verify-btn"
                        >
                          {verifyingId === p._id ? (
                            <>
                              <Loader2 className="spinning" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle />
                              Verify
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
