import React, { useEffect, useRef } from "react";
import "./LandingPage.css";

export default function LandingPage({ onStart }) {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((element) => observerRef.current.observe(element));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const classes = [
    {
      number: "01",
      short: "N",
      title: "Normal Rhythm",
      description:
        "A regular cardiac rhythm representing normal electrical activity and coordinated contraction of the heart.",
      wave: "normal",
    },
    {
      number: "02",
      short: "LBBB",
      title: "Left Bundle Branch Block",
      description:
        "A conduction pattern where electrical activation of the left ventricle is delayed, producing characteristic ECG changes.",
      wave: "lbbb",
    },
    {
      number: "03",
      short: "RBBB",
      title: "Right Bundle Branch Block",
      description:
        "A cardiac conduction pattern caused by delayed electrical activation through the right bundle branch.",
      wave: "rbbb",
    },
    {
      number: "04",
      short: "APB",
      title: "Atrial Premature Beat",
      description:
        "An early heartbeat originating in the atria that interrupts the normal rhythm before the next expected beat.",
      wave: "apb",
    },
    {
      number: "05",
      short: "PVC",
      title: "Premature Ventricular Contraction",
      description:
        "An early ventricular heartbeat producing an abnormal electrical pattern before the regular heartbeat resumes.",
      wave: "pvc",
    },
  ];

  return (
    <div className="heart-landing">
      {/* BACKGROUND DECORATION */}
      <div className="background-decoration" aria-hidden="true">
        <span className="floating-symbol symbol-one"></span>
        <span className="floating-symbol symbol-two"></span>
        <span className="floating-symbol symbol-three"></span>
        <span className="floating-symbol symbol-four"></span>

        <div className="blur-blob blob-one"></div>
        <div className="blur-blob blob-two"></div>
      </div>

      {/* NAVBAR */}
      <nav className="heart-navbar">
        <a className="heart-logo" href="#home">
          <QCardioLogo />

          <div>
            <strong>Q-CARDIO</strong>
            <small>Quantum Cardiac Rhythm Analysis</small>
          </div>

        </a>

        <div className="heart-nav-links">
          <a href="#home">Home</a>
          <a href="#journey">How It Works</a>
          <a href="#rhythms">Heart Rhythms</a>
          <a href="#technology">Technology</a>
          <a href="#about">About</a>
        </div>

        <button className="nav-heart-button" onClick={onStart}>
          Begin Analysis

        </button>
      </nav>

      {/* HERO */}
      <section id="home" className="heart-hero">
        <div className="hero-small-label hero-load-animation">
          <span></span>
          QUANTUM CARDIAC RHYTHM ANALYSIS
          <span></span>
        </div>

        <h1 className="hero-load-animation hero-delay-one">
          Where Every Beat Meets
          <br />
          <span>Quantum Computing.</span>
        </h1>

        <p className="hero-subtitle hero-load-animation hero-delay-two">
          A quantum machine learning system designed to analyze ECG signals and classify cardiac rhythm patterns.
        </p>

        {/* INTERACTIVE ANALYSIS CTA */}
        <div className="hero-heart-area hero-load-animation hero-delay-three">
          <div className="heart-glow"></div>

          <button
            className="analysis-orb"
            onClick={onStart}
            aria-label="Begin ECG Analysis"
          >
            <span className="analysis-orb-small">BEGIN</span>

            <span className="analysis-orb-main">
              ANALYSIS
            </span>
          </button>
          <div className="heart-ring ring-one"></div>
          <div className="heart-ring ring-two"></div>
          <div className="heart-ring ring-three"></div>
        </div>

        {/* MAIN ECG */}
        <div className="hero-ecg hero-load-animation hero-delay-three">
          <HeartbeatWave />
        </div>

        <a className="scroll-indicator" href="#journey">
          <span>SCROLL TO DISCOVER</span>
          <div>↓</div>
        </a>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="journey-section">
        <div className="section-intro reveal">
          <span className="eyebrow">YOUR HEART'S JOURNEY</span>

          <h2>
            From every beat to
            <span> intelligent insight.</span>
          </h2>

          <p>
            Your ECG travels through a carefully designed pipeline where
            classical computing and quantum machine learning work together.
          </p>
        </div>

        <div className="journey-container">
          <JourneyStep
            number="01"
            icon={<MiniHeart />}
            title="ECG Signal"
            text="Your cardiac signal enters the system as a standardized ECG window."
            delay="delay-1"
          />

          <JourneyConnector />

          <JourneyStep
            number="02"
            icon={<SignalIcon />}
            title="Signal Processing"
            text="The ECG data is prepared and transformed for intelligent analysis."
            delay="delay-2"
          />

          <JourneyConnector />

          <JourneyStep
            number="03"
            icon={<QuantumIcon />}
            title="Quantum Analysis"
            text="Quantum machine learning processes cardiac patterns."
            delay="delay-3"
          />

          <JourneyConnector />

          <JourneyStep
            number="04"
            icon={<ResultIcon />}
            title="Assessment"
            text="The system returns the predicted rhythm and confidence distribution."
            delay="delay-4"
          />
        </div>
      </section>

      {/* HEART RHYTHMS */}
      <section id="rhythms" className="rhythms-section">
        <div className="section-intro reveal">
          <span className="eyebrow">UNDERSTANDING THE RHYTHM</span>

          <h2>
            Discover the Patterns Behind
            <span> Every Heartbeat.</span>
          </h2>

          <p>
            The assessment model distinguishes between five ECG rhythm
            categories to identify different cardiac electrical patterns.
          </p>
        </div>

        <div className="rhythm-cards">
          {classes.map((item, index) => (
            <RhythmCard key={item.short} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* QUANTUM SECTION */}
      <section id="technology" className="quantum-section">
        <div className="quantum-left reveal">
          <span className="eyebrow">THE INTELLIGENCE WITHIN</span>

          <h2>
            Bringing Quantum Computing to
            <span> Cardiac Rhythm Analysis.</span>
          </h2>

          <p>
            Q-Cardio brings together classical ECG processing and quantum
            machine learning to create an approach to cardiac rhythm
            assessment.
          </p>

          <div className="quantum-features">
            <div>
              <span>01</span>
              <p>
                <strong>Cardiac Signal Processing</strong>
                Prepares ECG telemetry for the machine learning pipeline.
              </p>
            </div>

            <div>
              <span>02</span>
              <p>
                <strong>Hybrid QML</strong>
                Combines classical computation with parameterized quantum
                operations.
              </p>
            </div>

            <div>
              <span>03</span>
              <p>
                <strong>Rhythm Classification</strong>
                Generates predicted cardiac rhythm probabilities.
              </p>
            </div>
          </div>
        </div>

        <div className="quantum-visual reveal">


          <PipelineNode
            className="pipeline-one"
            icon="〰"
            title="ECG Signal"
            subtitle="Cardiac Input"
          />

          <PipelineArrow />

          <PipelineNode
            className="pipeline-two"
            icon="◇"
            title="Feature Processing"
            subtitle="Classical Layer"
          />

          <PipelineArrow />

          <div className="quantum-core">
            <div className="orbit orbit-one">
              <span></span>
            </div>

            <div className="orbit orbit-two">
              <span></span>
            </div>

            <div className="quantum-core-center">
              <strong>Q</strong>
              <small>QUANTUM</small>
            </div>
          </div>

          <PipelineArrow />

          <PipelineNode
            className="pipeline-four"
            icon={<MiniHeart />}
            title="Heart Assessment"
            subtitle="5-Class Prediction"
          />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-card reveal">
          <div className="about-heart">
            <MiniHeart />
          </div>

          <span className="eyebrow">ABOUT Q-CARDIO</span>

          <h2>
            Technology designed around
            <span> every heartbeat.</span>
          </h2>

          <p>
            Q-Cardio is a hybrid quantum machine learning cardiovascular
            assessment system designed to explore intelligent ECG rhythm
            classification using classical and quantum computing techniques.
          </p>
        </div>
      </section>

      {/* FINAL CTA
      <section className="final-section">
        <div className="final-wave wave-top">
          <HeartbeatWave />
        </div>

        <div className="final-content reveal">
          <div className="final-heart">♥</div>

          <span className="eyebrow">YOUR HEART. YOUR RHYTHM.</span>

          <h2>Every beat tells a story.</h2>

          <p>
            Take the next step and explore what your ECG signal reveals through
            hybrid quantum intelligence.
          </p>

          <button className="know-heart-button final-button" onClick={onStart}>
            <span className="button-heart">♥</span>
            Know Your Heart
            <span className="button-arrow">→</span>
          </button>
        </div>

        <div className="final-wave wave-bottom">
          <HeartbeatWave />
        </div>
      </section> */}

      {/* FOOTER */}
      <footer className="heart-footer">
        <div className="heart-logo">
          <QCardioLogo />
          <div>
            <strong>Q-CARDIO</strong>
            <small>Quantum Cardiac Rhythm Analysis</small>
          </div>
        </div>

        <p>
          Quantum Machine Learning Cardiovascular Assessment System
        </p>

        <span>Made for every beat ♡</span>
      </footer>
    </div>
  );
}

/* ------------------------------------------------ */
/* COMPONENTS                                       */
/* ------------------------------------------------ */

function HeartbeatWave() {
  return (
    <svg
      className="heartbeat-svg"
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="heartbeat-shadow"
        d="
        M0 95
        L120 95 L155 95 L175 80 L195 95
        L270 95 L290 90 L310 95
        L340 95 L365 120 L390 25 L420 145 L448 72 L475 95
        L555 95 L580 86 L600 95
        L690 95 L710 82 L730 95
        L790 95 L815 118 L840 32 L870 143 L900 70 L930 95
        L1020 95 L1045 84 L1065 95
        L1200 95
        "
      />

      <path
        className="heartbeat-path"
        d="
        M0 95
        L120 95 L155 95 L175 80 L195 95
        L270 95 L290 90 L310 95
        L340 95 L365 120 L390 25 L420 145 L448 72 L475 95
        L555 95 L580 86 L600 95
        L690 95 L710 82 L730 95
        L790 95 L815 118 L840 32 L870 143 L900 70 L930 95
        L1020 95 L1045 84 L1065 95
        L1200 95
        "
      />
    </svg>
  );
}

function MiniWave({ type }) {
  const paths = {
    normal:
      "M0 40 L35 40 L45 32 L55 40 L75 40 L84 53 L95 10 L108 65 L120 30 L132 40 L180 40",
    lbbb:
      "M0 40 L38 40 L50 30 L62 40 L82 40 L95 62 L107 15 L120 60 L135 20 L148 55 L162 40 L180 40",
    rbbb:
      "M0 40 L35 40 L47 32 L60 40 L82 40 L94 55 L104 13 L115 60 L125 18 L135 58 L145 26 L157 40 L180 40",
    apb:
      "M0 40 L28 40 L38 27 L48 40 L65 40 L75 52 L85 12 L96 60 L108 30 L120 40 L135 40 L142 28 L150 40 L180 40",
    pvc:
      "M0 40 L40 40 L50 30 L60 40 L80 40 L95 64 L110 12 L125 67 L140 15 L155 55 L165 40 L180 40",
  };

  return (
    <svg viewBox="0 0 180 80" className="mini-wave">
      <path d={paths[type]} />
    </svg>
  );
}

function RhythmCard({ item, index }) {
  return (
    <article
      className={`rhythm-card reveal ${index % 2 === 1 ? "rhythm-right" : ""
        }`}
    >
      <div className="rhythm-number">{item.number}</div>

      <div className="rhythm-wave-area">
        <MiniWave type={item.wave} />
      </div>

      <div className="rhythm-info">
        <span className="rhythm-short">{item.short}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>

      {/* <div className="rhythm-heart">♡</div> */}
    </article>
  );
}

function JourneyStep({ number, icon, title, text, delay }) {
  return (
    <article className={`journey-step reveal ${delay}`}>
      <span className="journey-number">{number}</span>

      <div className="journey-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>
    </article>
  );
}

function JourneyConnector() {
  return (
    <div className="journey-connector reveal">
      <span></span>
      <div>♥</div>
      <span></span>
    </div>
  );
}

function MiniHeart() {
  return (
    <svg
      className="simple-icon"
      width="32"
      height="20"
      viewBox="0 0 60 30"
      fill="none"
    >
      <path
        d="M2 16 H15 L20 11 L25 22 L31 4 L37 24 L43 14 L48 16 H58"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SignalIcon() {
  return <span className="simple-icon">〰</span>;
}

function QuantumIcon() {
  return <span className="simple-icon quantum-letter">Q</span>;
}

function ResultIcon() {
  return <span className="simple-icon">✓</span>;
}

function PipelineNode({ icon, title, subtitle }) {
  return (
    <div className="pipeline-node">
      <div className="pipeline-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="pipeline-arrow">
      <span></span>
      <b>↓</b>
    </div>
  );
}
function QCardioLogo() {
  return (
    <span className="qcardio-logo">
      <svg
        viewBox="0 0 120 120"
        className="qcardio-logo-svg"
        aria-hidden="true"
      >
        {/* =========================
            ROTATING QUANTUM ORBITS
        ========================== */}

        <g className="logo-orbit-group orbit-group-1">
          <ellipse
            className="logo-orbit-line"
            cx="60"
            cy="60"
            rx="53"
            ry="22"
          />

          <circle
            className="logo-electron"
            cx="10"
            cy="53"
            r="4"
          />
        </g>

        <g className="logo-orbit-group orbit-group-2">
          <ellipse
            className="logo-orbit-line"
            cx="60"
            cy="60"
            rx="53"
            ry="22"
          />

          <circle
            className="logo-electron"
            cx="108"
            cy="52"
            r="3.5"
          />
        </g>

        <g className="logo-orbit-group orbit-group-3">
          <ellipse
            className="logo-orbit-line logo-orbit-soft"
            cx="60"
            cy="60"
            rx="50"
            ry="18"
          />

          <circle
            className="logo-electron small-electron"
            cx="14"
            cy="55"
            r="3"
          />
        </g>

        <g className="logo-orbit-group orbit-group-4">
          <ellipse
            className="logo-orbit-line logo-orbit-soft"
            cx="60"
            cy="60"
            rx="48"
            ry="19"
          />

          <circle
            className="logo-electron small-electron"
            cx="105"
            cy="54"
            r="3"
          />
        </g>


        {/* =========================
            CENTER ROSE CIRCLE
        ========================== */}

        <circle
          className="logo-core-glow"
          cx="60"
          cy="60"
          r="34"
        />

        <circle
          className="logo-core"
          cx="60"
          cy="60"
          r="31"
        />


        {/* =========================
            WHITE Q
        ========================== */}

        <text
          x="60"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          className="logo-q"
        >
          Q
        </text>


        {/* =========================
            WHITE ECG
        ========================== */}

        <path
          className="logo-ecg"
          d="
    M36 78
    H45
    L49 74
    L53 82
    L58 68
    L63 84
    L68 73
    L73 78
    H84
  "
        />
      </svg>
    </span>
  );
}