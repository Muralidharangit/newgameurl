import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shop } from "../../constants/machine";
import type { MachineType } from "../../types";
import { generateRandomSetupCode } from "../../utils/formatCurrency";

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [setupCode, setSetupCode] = useState("WB-SHOP-4821");
  const [machineType, setMachineType] = useState<MachineType>("smart-pc");
  const [isTerminalConfirmed, setIsTerminalConfirmed] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleSelectMachine = (type: MachineType) => {
    setMachineType(type);
    const name = type === "terminal" ? "Terminal-02" : "Smart PC-03";
    showToast(`Selected: ${type === "terminal" ? "Terminal" : "Smart PC"} (${name})`);
  };

  const handleGenerateCode = () => {
    const newCode = generateRandomSetupCode();
    setSetupCode(newCode);
    showToast(`Generated: ${newCode}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const inputCode = setupCode.trim();
    if (!inputCode) {
      setErrorMessage("Please enter a valid Setup Code.");
      showToast("Please enter a valid Setup Code!");
      return;
    }

    if (machineType === "terminal" && !isTerminalConfirmed) {
      setErrorMessage("Please confirm Bill / Ticket Terminal capability.");
      showToast("Please confirm Bill / Ticket Terminal capability!");
      return;
    }

    // Save registration state to localStorage
    const machineName = machineType === "terminal" ? "Terminal-02" : "Smart PC-03";
    localStorage.setItem("winbet_machine_type", machineType);
    localStorage.setItem("winbet_machine_name", machineName);
    localStorage.setItem("winbet_setup_code", inputCode.toUpperCase());
    localStorage.setItem("winbet_shop_name", shop.name);
    localStorage.setItem("winbet_shop_location", shop.location);

    // Switch to step 2
    setWizardStep(2);
    showToast(`Registration Successful for ${machineName}!`);
  };

  const handleContinueToPlatform = () => {
    const path = machineType === "terminal" ? "/terminal" : "/smart-pc";
    navigate(path);
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "radial-gradient(circle at 50% 15%, #1d0938 0%, #080214 100%)" }}>
      <div className="container-fluid px-lg-5 py-3 d-flex flex-column flex-grow-1">
        {/* Top Controls Bar */}
        <div
          className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3"
          style={{ borderColor: "rgba(94, 23, 187, 0.4)" }}
        >
          <div className="d-flex align-items-center gap-2">
            <Link to="/register" className="brand-logo-wrap text-decoration-none mb-0" title="WINBET Station">
              <span className="brand-name fs-5">
                <span style={{ color: "#f5b300" }}>WIN</span>
                <span style={{ color: "#ffffff" }}>BET</span>
              </span>
            </Link>
            <span
              className="badge ms-2 bg-dark text-warning border border-warning-subtle"
              style={{ fontSize: "0.75rem" }}
            >
              REGISTRATION PORTAL
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 mt-2 mt-sm-0">
            <span className="badge border border-purple-800 text-secondary" style={{ fontSize: "0.74rem", background: "rgba(22, 10, 48, 0.5)" }}>
              <i className="fa-solid fa-store me-1 text-warning"></i> {shop.name}
            </span>
          </div>
        </div>

        {/* Center Content Wrapper */}
        <div className="my-auto w-100 py-2">
          <div id="wizardContainer" className="row justify-content-center py-2">
            <div className="col-12 col-md-8 col-lg-5 col-xl-4">
              <div
                className="winbet-card active-step-card"
                style={{
                  animation: "modalPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
              >
                <div>
                  {/* Step Pill */}
                  <div className="step-pill-box justify-content-center mb-3">
                    <span className="badge-circle">{wizardStep}</span>
                    <span className="pill-text fw-bold">
                      {wizardStep === 1 ? "Machine Registration" : "Registration Complete"}
                    </span>
                  </div>

                  {wizardStep === 1 ? (
                    /* SCREEN 1: REGISTRATION SETUP */
                    <form id="flowScreen1" onSubmit={handleSubmit}>
                      <h2 className="card-heading text-center mb-3">Register Device</h2>

                      {/* 1. TOP: Setup Code Input */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label className="field-label mb-0" htmlFor="liveSignupCode">
                            SETUP CODE
                          </label>
                          <span
                            role="button"
                            className="text-warning small d-flex align-items-center gap-1"
                            style={{ cursor: "pointer", fontSize: "0.78rem" }}
                            onClick={handleGenerateCode}
                          >
                            <i className="fa-solid fa-shuffle"></i> Generate
                          </span>
                        </div>
                        <input
                          type="text"
                          id="liveSignupCode"
                          className="winbet-input text-uppercase font-monospace fw-bold text-warning"
                          value={setupCode}
                          onChange={(e) => {
                            setSetupCode(e.target.value);
                            setErrorMessage(null);
                          }}
                          placeholder="WB-SHOP-XXXX"
                        />
                        <div className="text-secondary small mt-1 text-start" style={{ fontSize: "0.74rem" }}>
                          Shop name and machine name appear after Register.
                        </div>
                        {errorMessage && (
                          <div
                            className="alert alert-danger py-2 px-3 mt-2 small text-light bg-danger bg-opacity-25 border-danger"
                            style={{ fontSize: "0.82rem" }}
                          >
                            <i className="fa-solid fa-triangle-exclamation me-1 text-danger"></i>
                            {errorMessage}
                          </div>
                        )}
                      </div>

                      {/* 2. DOWN: Device Type Selection */}
                      <div className="mb-3">
                        <label className="field-label">DEVICE TYPE</label>

                        {/* Smart PC Option */}
                        <div
                          className={`option-row ${machineType === "smart-pc" ? "selected" : ""}`}
                          id="optSmartPC"
                          onClick={() => handleSelectMachine("smart-pc")}
                        >
                          <div className="option-left">
                            <span
                              className={`radio-dot ${machineType === "smart-pc" ? "gold-ring-filled" : ""}`}
                              id="dotSmartPC"
                            ></span>
                            <span className="fw-semibold">Smart PC</span>
                          </div>
                          <span
                            className="badge border border-purple-500 text-light small px-2 py-1"
                            style={{ fontSize: "0.7rem", background: "#1c093a" }}
                          >
                            <i className="fa-solid fa-desktop me-1 text-warning"></i> Cashier Desk
                          </span>
                        </div>

                        {/* Terminal Option */}
                        <div
                          className={`option-row ${machineType === "terminal" ? "selected" : ""}`}
                          id="optTerminal"
                          onClick={() => handleSelectMachine("terminal")}
                        >
                          <div className="option-left">
                            <span
                              className={`radio-dot ${machineType === "terminal" ? "gold-ring-filled" : ""}`}
                              id="dotTerminal"
                            ></span>
                            <span className="fw-semibold">Terminal</span>
                          </div>
                          <span
                            className="badge border border-warning-subtle text-warning small px-2 py-1"
                            style={{ fontSize: "0.7rem", background: "#1c093a" }}
                          >
                            <i className="fa-solid fa-receipt me-1"></i> Bill / Scanner / Print
                          </span>
                        </div>
                      </div>

                      {/* Terminal Capability Confirmation Checkbox Field (Shown when Terminal is chosen) */}
                      {machineType === "terminal" && (
                        <div
                          className="terminal-confirm-card mb-3 p-3 text-start position-relative overflow-hidden cursor-pointer"
                          style={{
                            backgroundColor: "#150734",
                            border: isTerminalConfirmed ? "1px solid #8b3dff" : "1px solid #4c1d95",
                            boxShadow: isTerminalConfirmed
                              ? "0 0 16px rgba(139, 61, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                              : "none",
                            borderRadius: "12px",
                            transition: "all 0.2s ease",
                            animation: "modalSpringPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                            cursor: "pointer",
                          }}
                          onClick={() => setIsTerminalConfirmed((prev) => !prev)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              {/* Gold Ring Checkbox matching the radio dot style */}
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  border: isTerminalConfirmed ? "2px solid #f5b300" : "2px solid #6b5299",
                                  boxShadow: isTerminalConfirmed ? "0 0 8px rgba(245, 179, 0, 0.5)" : "none",
                                  backgroundColor: isTerminalConfirmed ? "#f5b300" : "transparent",
                                  color: "#150734",
                                  fontSize: "0.72rem",
                                  fontWeight: 900,
                                  flexShrink: 0,
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {isTerminalConfirmed && <i className="fa-solid fa-check"></i>}
                              </div>

                              <div>
                                <div className="fw-semibold text-light" style={{ fontSize: "0.92rem" }}>
                                  Confirm: Bill / Ticket Terminal
                                </div>
                                <div className="small mt-0" style={{ fontSize: "0.76rem", color: "#a594c9" }}>
                                  Prints cashout tickets · bill-in and ticket scan
                                </div>
                              </div>
                            </div>

                            {/* Badge matching the right-side option pill */}
                            <span
                              className={`badge border small px-2 py-1 ${
                                isTerminalConfirmed
                                  ? "border-warning-subtle text-warning"
                                  : "border-secondary-subtle text-secondary"
                              }`}
                              style={{ fontSize: "0.7rem", background: "#1c093a" }}
                            >
                              <i className={`fa-solid ${isTerminalConfirmed ? "fa-check" : "fa-clock"} me-1`}></i>
                              {isTerminalConfirmed ? "Confirmed" : "Pending"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Shop & Location Info */}
                      <div className="receipt-list mb-3">
                        <div className="receipt-row">
                          <span className="receipt-label">
                            <i className="fa-solid fa-store me-1 text-warning"></i> Shop:
                          </span>
                          <span className="receipt-value text-warning">{shop.name}</span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">
                            <i className="fa-solid fa-location-dot me-1 text-secondary"></i> Location:
                          </span>
                          <span className="receipt-value">{shop.location}</span>
                        </div>
                      </div>

                      {/* Button on Screen 1 */}
                      <div id="btnGroupScreen1">
                        <button type="submit" className="btn-winbet">
                          <i className="fa-solid fa-circle-check me-1"></i> Register
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* SCREEN 2: REGISTRATION SUCCESSFUL */
                    <div id="flowScreen2">
                      {/* Glowing Checkmark Circle */}
                      <div className="success-circle-container mt-2">
                        <div className="neon-success-circle">
                          <i className="fa-solid fa-check"></i>
                        </div>
                      </div>

                      <h2 className="success-banner-text">Registration Successful!</h2>

                      {/* Registration Summary */}
                      <div className="receipt-list mb-3">
                        <div className="receipt-row">
                          <span className="receipt-label">Machine Name:</span>
                          <span className="receipt-value text-warning fw-bold" id="successMachineName">
                            {machineType === "terminal" ? "Terminal-02" : "Smart PC-03"}
                          </span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">Machine Type:</span>
                          <span className="receipt-value" id="successMachineType">
                            {machineType === "terminal" ? "Terminal" : "Smart PC"}
                          </span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">Shop Name:</span>
                          <span className="receipt-value">{shop.name}</span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">Location:</span>
                          <span className="receipt-value text-secondary">{shop.location}</span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">Setup Code:</span>
                          <span className="receipt-value text-light font-monospace" id="successSetupCode">
                            {setupCode.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Button on Screen 2 */}
                      <div id="btnGroupScreen2">
                        <button
                          type="button"
                          className="btn-winbet"
                          onClick={handleContinueToPlatform}
                        >
                          <span>Continue to Gaming Platform</span>
                          <i className="fa-solid fa-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brand Footer */}
                <div className="card-footer-brand mt-3">
                  <div className="brand-badge">
                    <i className="fa-solid fa-scale-balanced"></i>
                  </div>
                  <div className="brand-text-block">
                    <span className="brand-title">WinBet Station</span>
                    <span className="brand-sub">Independent. Fair. Reliable. Windhoek Central.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Toast */}
        {toastMessage && (
          <div
            className="toast-custom-pill position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 rounded-pill text-light fw-semibold shadow-lg z-3"
            style={{
              background: "rgba(13, 5, 29, 0.95)",
              border: "1.5px solid rgba(245, 179, 0, 0.6)",
              boxShadow: "0 0 25px rgba(245, 179, 0, 0.4)",
              fontSize: "0.85rem",
              animation: "fadeInUp 0.25s ease forwards",
            }}
          >
            <i className="fa-solid fa-circle-info text-warning me-2"></i>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
