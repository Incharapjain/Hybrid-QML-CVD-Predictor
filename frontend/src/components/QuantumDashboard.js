import React, { useState } from "react";
import "./QuantumDashboard.css";

export default function QuantumDashboard({ onBack }) {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorLog, setErrorLog] = useState(null);
  const [uploadedDataPoints, setUploadedDataPoints] = useState([]);
  const [fileName, setFileName] = useState("");
  const [totalSamplesFound, setTotalSamplesFound] = useState(0);

  /* =====================================================
     FILE UPLOAD
     SAME LOGIC AS YOUR EXISTING FRONTEND
  ===================================================== */

  const handleFileUpload = (event) => {
    const file = event.target?.files?.[0] || event.target.files[0];

    if (!file) return;

    setFileName(file.name);
    setErrorLog(null);
    setDiagnosticData(null);

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    /* ===============================
       PIPELINE A — .DAT FORMAT 212
    =============================== */

    if (fileExtension === "dat") {
      reader.onload = (e) => {
        const buffer = e.target.result;

        const u8Array = new Uint8Array(buffer);

        let numericArray = [];

        for (let i = 0; i + 2 < u8Array.length; i += 3) {
          const b1 = u8Array[i];
          const b2 = u8Array[i + 1];
          const b3 = u8Array[i + 2];

          const sample1 = b1 | ((b2 & 0x0f) << 8);

          const signExtended1 =
            sample1 > 2047 ? sample1 - 4096 : sample1;

          const sample2 = b3 | ((b2 & 0xf0) << 4);

          const signExtended2 =
            sample2 > 2047 ? sample2 - 4096 : sample2;

          numericArray.push(signExtended1);
          numericArray.push(signExtended2);
        }

        if (numericArray.length === 0) {
          numericArray = Array.from(u8Array);
        }

        numericArray = numericArray.filter(
          (val) => !isNaN(val)
        );

        const sampleCount = numericArray.length;

        setTotalSamplesFound(sampleCount);

        if (sampleCount === 0) {
          setErrorLog(
            "Binary decoding yielded no data! The file might be empty or unreadable."
          );

          setUploadedDataPoints([]);

          return;
        }

        let standardizedWindow = [...numericArray];

        if (sampleCount > 180) {
          standardizedWindow =
            numericArray.slice(0, 180);
        } else if (sampleCount < 180) {
          setErrorLog(
            `Binary stream is too short! Extracted ${sampleCount} samples, but the QNN pipeline requires at least 180.`
          );

          setUploadedDataPoints([]);

          return;
        }

        setUploadedDataPoints(standardizedWindow);
      };

      reader.readAsArrayBuffer(file);
    }

    /* ===============================
       PIPELINE B — CSV / TXT
    =============================== */

    else {
      reader.onload = (e) => {
        const text = e.target.result;

        let numericArray = text
          .replace(/[\r\n;]+/g, ",")
          .split(",")
          .map((val) => val.trim())
          .filter((val) => val !== "")
          .map((val) => parseFloat(val));

        numericArray = numericArray.filter(
          (val) => !isNaN(val)
        );

        const sampleCount = numericArray.length;

        setTotalSamplesFound(sampleCount);

        if (sampleCount === 0) {
          setErrorLog(
            "Could not find any numeric parameters inside the document."
          );

          setUploadedDataPoints([]);

          return;
        }

        let standardizedWindow = [...numericArray];

        if (sampleCount > 180) {
          standardizedWindow =
            numericArray.slice(0, 180);
        } else if (sampleCount < 180) {
          setErrorLog(
            `Signal text is too short! Contains ${sampleCount} samples instead of the required 180.`
          );

          setUploadedDataPoints([]);

          return;
        }

        setUploadedDataPoints(standardizedWindow);
      };

      reader.readAsText(file);
    }
  };

  /* =====================================================
     ANALYSIS
     YOUR EXISTING BACKEND CALL — UNCHANGED
  ===================================================== */

  const triggerLiveAnalysis = async () => {
    if (uploadedDataPoints.length !== 180) {
      setErrorLog(
        "Please upload a valid data sequence first."
      );

      return;
    }

    setIsProcessing(true);
    setErrorLog(null);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/diagnose",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            device_id:
              "HOSP-USER-MULTI-FORMAT-UPLOAD",

            lead_telemetry: uploadedDataPoints,
          }),
        }
      );

      if (!response.ok)
        throw new Error(
          `Server returned HTTP error code: ${response.status}`
        );

      const payload = await response.json();

      setDiagnosticData(
        payload.quantum_analysis
      );
    } catch (err) {
      setErrorLog(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="assessment-page">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <nav className="assessment-navbar">

        <div className="assessment-brand">

          <QCardioLogo />

          <div>
            <strong>Q-CARDIO</strong>
            <small>
              Quantum Cardiac Rhythm Analysis
            </small>
          </div>

        </div>

        <button
          className="back-home"
          onClick={onBack}
        >
          ← Back to Home
        </button>

      </nav>


      {/* =====================================
          HERO
      ====================================== */}

      <section className="assessment-hero">

        <span className="assessment-eyebrow">
          ECG RHYTHM ASSESSMENT
        </span>

        <h1>
          Analyze Your
          <em> ECG Signal.</em>
        </h1>

        <p>
          Upload an ECG signal to perform
          quantum machine learning based
          cardiac rhythm classification.
        </p>

        <MiniECG />

      </section>


      <main className="assessment-content">

        {/* =====================================
            UPLOAD
        ====================================== */}

        <section className="assessment-section">

          <SectionHeader
            number="01"
            label="SIGNAL INPUT"
            title="Upload ECG Signal"
          />

          <label className="upload-zone">

            <input
              type="file"
              accept=".csv,.txt,.dat"
              onChange={handleFileUpload}
            />

            <div className="upload-icon">
              <UploadIcon />
            </div>

            <strong>
              {fileName
                ? "ECG signal loaded"
                : "Choose your ECG file"}
            </strong>

            <p>
              {fileName
                ? fileName
                : "Browse to select an ECG telemetry file"}
            </p>

            <span className="supported-files">
              DAT&nbsp;&nbsp; • &nbsp;&nbsp;CSV&nbsp;&nbsp; • &nbsp;&nbsp;TXT
            </span>

          </label>


          {/* FILE INFORMATION */}

          {fileName && (
            <div className="file-information">

              <div className="file-status-icon">
                ✓
              </div>

              <div className="file-details">

                <span>LOADED SIGNAL</span>

                <strong>{fileName}</strong>

              </div>

              <div className="sample-information">

                <span>TOTAL SAMPLES</span>

                <strong>
                  {totalSamplesFound.toLocaleString()}
                </strong>

              </div>

              <div className="window-information">

                <span>ANALYSIS WINDOW</span>

                <strong>
                  {uploadedDataPoints.length}/180
                </strong>

              </div>

            </div>
          )}


          {/* ERROR */}

          {errorLog && (
            <div className="assessment-error">

              <span>!</span>

              <p>{errorLog}</p>

            </div>
          )}


          {/* ANALYSIS BUTTON */}

          <div className="analysis-button-area">

            <button
              className="assessment-analysis-button"
              onClick={triggerLiveAnalysis}
              disabled={
                isProcessing ||
                uploadedDataPoints.length !== 180
              }
            >

              {isProcessing ? (
                <>
                  <span className="analysis-spinner"></span>
                  ANALYZING ECG SIGNAL...
                </>
              ) : (
                <>
                  BEGIN ANALYSIS
                  <span>→</span>
                </>
              )}

            </button>

            {uploadedDataPoints.length === 180 &&
              !isProcessing && (
                <small>
                  Signal ready for classification
                </small>
              )}

          </div>

        </section>


        {/* =====================================
            ECG PREVIEW
        ====================================== */}

        {uploadedDataPoints.length === 180 && (
          <section className="assessment-section signal-section">

            <SectionHeader
              number="02"
              label="SIGNAL WINDOW"
              title="ECG Signal Preview"
            />

            <div className="ecg-chart-card">

              <div className="chart-top">

                <div>
                  <span>ACTIVE WINDOW</span>

                  <strong>
                    180 ECG Samples
                  </strong>
                </div>

                <span className="ready-badge">
                  ● READY
                </span>

              </div>

              <ECGChart
                data={uploadedDataPoints}
              />

              <div className="signal-statistics">

                <SignalStat
                  label="WINDOW SIZE"
                  value="180"
                />

                <SignalStat
                  label="SAMPLES FOUND"
                  value={totalSamplesFound.toLocaleString()}
                />

                <SignalStat
                  label="INPUT STATUS"
                  value="VALID"
                />

              </div>

            </div>

          </section>
        )}


        {/* =====================================
            PROCESSING STATE
        ====================================== */}

        {isProcessing && (
          <section className="processing-card">

            <div className="processing-orbit">

              <QCardioLogo />

            </div>

            <span>
              QUANTUM CLASSIFICATION
            </span>

            <h2>
              Analyzing cardiac rhythm...
            </h2>

            <p>
              Processing the selected ECG
              signal window through the
              classification model.
            </p>

            <MiniECG />

          </section>
        )}


        {/* =====================================
            RESULT
        ====================================== */}

        {diagnosticData && (
          <section className="assessment-section results-section">

            <SectionHeader
              number="03"
              label="CLASSIFICATION OUTPUT"
              title="Assessment Result"
            />


            {/* RESULT HERO */}

            <div className="result-hero">

              <span className="result-label">
                CLASSIFIED RHYTHM
              </span>

              <h2>
                {diagnosticData.detected_class}
              </h2>

              <div className="result-confidence">

                <strong>
                  {(
                    diagnosticData.confidence_score *
                    100
                  ).toFixed(2)}
                  %
                </strong>

                <span>
                  Classification Confidence
                </span>

              </div>

            </div>


            {/* PROBABILITIES */}

            <div className="probability-card">

              <div className="probability-heading">

                <div>
                  <span>
                    PROBABILITY DISTRIBUTION
                  </span>

                  <h3>
                    Rhythm Classification
                    Breakdown
                  </h3>
                </div>

                <MiniECGIcon />

              </div>


              <div className="probability-list">

                {Object.entries(
                  diagnosticData.predictions_breakdown
                ).map(
                  ([condition, prob]) => {

                    const isDetected =
                      condition.toLowerCase() ===
                      diagnosticData.detected_class.toLowerCase();

                    return (
                      <div
                        className={`probability-row ${isDetected
                            ? "detected-probability"
                            : ""
                          }`}
                        key={condition}
                      >

                        <div className="probability-name">

                          <strong>
                            {condition}
                          </strong>

                          {isDetected && (
                            <span>
                              DETECTED
                            </span>
                          )}

                        </div>

                        <div className="probability-track">

                          <div
                            className="probability-fill"
                            style={{
                              width: `${prob * 100
                                }%`,
                            }}
                          />

                        </div>

                        <strong className="probability-value">
                          {(prob * 100).toFixed(2)}%
                        </strong>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  number,
  label,
  title,
}) {
  return (
    <div className="section-heading">

      <span className="section-number">
        {number}
      </span>

      <div>

        <span className="section-eyebrow">
          {label}
        </span>

        <h2>{title}</h2>

      </div>

    </div>
  );
}


/* =========================================================
   SIGNAL STAT
========================================================= */

function SignalStat({ label, value }) {
  return (
    <div className="signal-stat">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


/* =========================================================
   ECG CHART
   PURE SVG — NO EXTRA LIBRARY
========================================================= */

function ECGChart({ data }) {

  if (!data || data.length === 0)
    return null;

  const width = 1000;
  const height = 260;
  const padding = 25;

  const min = Math.min(...data);
  const max = Math.max(...data);

  const range =
    max - min === 0 ? 1 : max - min;

  const points = data
    .map((value, index) => {

      const x =
        padding +
        (index / (data.length - 1)) *
        (width - padding * 2);

      const normalized =
        (value - min) / range;

      const y =
        height -
        padding -
        normalized *
        (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="ecg-chart">

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >

        {/* GRID */}

        <defs>

          <pattern
            id="smallGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >

            <path
              d="M 20 0 L 0 0 0 20"
              className="small-grid"
            />

          </pattern>

          <pattern
            id="grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >

            <rect
              width="100"
              height="100"
              fill="url(#smallGrid)"
            />

            <path
              d="M 100 0 L 0 0 0 100"
              className="large-grid"
            />

          </pattern>

        </defs>


        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
        />


        {/* ECG */}

        <polyline
          className="uploaded-ecg-line"
          points={points}
        />

      </svg>

      <div className="chart-axis">

        <span>0</span>
        <span>45</span>
        <span>90</span>
        <span>135</span>
        <span>180</span>

      </div>

    </div>
  );
}


/* =========================================================
   MINI ECG
========================================================= */

function MiniECG() {
  return (
    <svg
      className="assessment-mini-ecg"
      viewBox="0 0 400 60"
    >

      <path
        d="
          M0 30
          H65
          L78 27
          L90 30
          H125
          L140 34
          L153 8
          L168 51
          L184 21
          L202 30
          H250
          L265 27
          L280 30
          H400
        "
      />

    </svg>
  );
}


function MiniECGIcon() {
  return (
    <svg
      className="mini-ecg-icon"
      viewBox="0 0 70 30"
    >

      <path
        d="
          M2 16
          H15
          L20 12
          L25 22
          L31 4
          L37 25
          L43 14
          L48 16
          H68
        "
      />

    </svg>
  );
}


/* =========================================================
   UPLOAD ICON
========================================================= */

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 50 50"
      aria-hidden="true"
    >

      <path
        d="M25 34V12"
      />

      <path
        d="M17 20L25 12L33 20"
      />

      <path
        d="M11 32V39H39V32"
      />

    </svg>
  );
}


/* =========================================================
   Q-CARDIO LOGO
========================================================= */

function QCardioLogo() {
  return (
    <span className="dashboard-q-logo">

      <svg viewBox="0 0 120 120">

        <g className="dash-orbit dash-orbit-one">

          <ellipse
            cx="60"
            cy="60"
            rx="53"
            ry="21"
          />

          <circle
            cx="10"
            cy="54"
            r="4"
          />

        </g>


        <g className="dash-orbit dash-orbit-two">

          <ellipse
            cx="60"
            cy="60"
            rx="52"
            ry="20"
          />

          <circle
            cx="108"
            cy="54"
            r="3.5"
          />

        </g>


        <g className="dash-orbit dash-orbit-three">

          <ellipse
            cx="60"
            cy="60"
            rx="50"
            ry="19"
          />

          <circle
            cx="12"
            cy="54"
            r="3.5"
          />

        </g>


        <circle
          className="dash-logo-core"
          cx="60"
          cy="60"
          r="31"
        />


        <text
          className="dash-logo-q"
          x="60"
          y="53"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Q
        </text>


        <path
          className="dash-logo-ecg"
          d="
            M37 77
            H46
            L50 73
            L54 81
            L59 68
            L64 83
            L69 73
            L74 77
            H83
          "
        />

      </svg>

    </span>
  );
}