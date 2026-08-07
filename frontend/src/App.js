import React, { useEffect, useState } from "react";

import QuantumDashboard from "./components/QuantumDashboard";
import LandingPage from "./pages/LandingPage";
import HeartLoader from "./components/HeartLoader";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Open Assessment Page
  const openAssessment = () => {
    setCurrentPage("assessment");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Go Back to Landing Page
  const goHome = () => {
    setCurrentPage("landing");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  // Initial Loader
  if (loading) {
    return <HeartLoader />;
  }

  // Assessment Page
  if (currentPage === "assessment") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fffaf4",
        }}
      >
        <QuantumDashboard onBack={goHome} />
      </div>
    );
  }

  // Landing Page
  return <LandingPage onStart={openAssessment} />;
}

export default App;