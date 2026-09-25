import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { shop } from "../../constants/machine";

export const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  const machineName = localStorage.getItem("winbet_machine_name") || "Terminal-02";
  const machineType = localStorage.getItem("winbet_machine_type") || "terminal";

  const handleClearAndRegister = () => {
    // Clear local storage machine binding
    localStorage.removeItem("winbet_machine_name");
    localStorage.removeItem("winbet_machine_type");
    localStorage.removeItem("winbet_setup_code");
    localStorage.removeItem("winbet_shop_name");
    localStorage.removeItem("winbet_shop_location");

    // Navigate to registration screen
    navigate("/register");
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "radial-gradient(circle at 50% 20%, #1c0628 0%, #080214 100%)" }}>
      <div className="container-fluid px-lg-5 py-3 d-flex flex-column flex-grow-1">
        {/* Top Header */}
        <div
          className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3"
          style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}
        >
          <div className="d-flex align-items-center gap-2">
            <Link to="/register" className="brand-logo-wrap text-decoration-none mb-0">
              <span className="brand-name fs-5">
                <span style={{ color: "#f5b300" }}>WIN</span>
                <span style={{ color: "#ffffff" }}>BET</span>
              </span>
            </Link>
            <span
              className="badge ms-2 bg-danger text-white border border-danger-subtle"
              style={{ fontSize: "0.75rem" }}
            >
              SECURITY ALERT
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-dark text-secondary border border-secondary" style={{ fontSize: "0.76rem" }}>
              Shop System · Hardware Bind
            </span>
          </div>
        </div>

        {/* Center Card for Screen 28 */}
        <div className="my-auto w-100 py-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5 col-xl-4">
              <div
                className="winbet-card"
                style={{
                  borderColor: "rgba(239, 68, 68, 0.5)",
                  boxShadow: "0 12px 45px rgba(0, 0, 0, 0.85), 0 0 35px rgba(239, 68, 68, 0.35)",
                }}
              >
                <div>
                  {/* Step Pill */}
                  <div className="step-pill-box justify-content-center mb-3">
                    <span className="badge-circle bg-danger text-white">28</span>
                    <span className="pill-text fw-bold text-danger">Hardware Authorization</span>
                  </div>

                  {/* Red Neon Alert Icon */}
                  <div className="neon-alert-circle-wrap mb-3 text-center">
                    <div
                      style={{
                        width: "84px",
                        height: "84px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(185, 28, 28, 0.1) 100%)",
                        border: "2.5px solid #ef4444",
                        boxShadow: "0 0 35px rgba(239, 68, 68, 0.7)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ef4444",
                        fontSize: "2.2rem",
                      }}
                    >
                      <i className="fa-solid fa-lock"></i>
                    </div>
                  </div>

                  <h2 className="card-heading text-danger text-center mb-2">PC Not Authorized</h2>

                  <p className="text-light small text-center mb-3" style={{ lineHeight: "1.5" }}>
                    This PC no longer matches the server bind. The machine slot was unbound in Back Office, or this application is running on a different computer.
                  </p>

                  {/* Machine Details List */}
                  <div className="receipt-list mb-4">
                    <div className="receipt-row">
                      <span className="receipt-label">Machine ID:</span>
                      <span className="receipt-value text-danger fw-bold">{machineName}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Device Type:</span>
                      <span className="receipt-value text-capitalize">{machineType}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Shop Name:</span>
                      <span className="receipt-value">{shop.name}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Hardware Bind:</span>
                      <span className="badge bg-danger-subtle text-danger border border-danger">
                        UNBOUND / MISMATCH
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Big Primary Action: Clear local data & register again */}
                  <button
                    type="button"
                    className="btn-winbet"
                    onClick={handleClearAndRegister}
                    style={{
                      background: "linear-gradient(135deg, #f5b300 0%, #ff8800 100%)",
                      color: "#000000",
                      fontWeight: 700,
                    }}
                  >
                    <i className="fa-solid fa-trash-arrow-up me-2"></i>
                    <span>CLEAR LOCAL DATA & REGISTER AGAIN</span>
                  </button>

                  <div className="card-footer-brand mt-3">
                    <div className="brand-badge">
                      <i className="fa-solid fa-scale-balanced"></i>
                    </div>
                    <div className="brand-text-block">
                      <span className="brand-title">WinBet Security</span>
                      <span className="brand-sub">Hardware Binding · Tauri PC Protection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
