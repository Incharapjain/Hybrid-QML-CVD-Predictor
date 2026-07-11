// frontend/src/components/QuantumDashboard.js
import React, { useState } from 'react';

export default function QuantumDashboard() {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorLog, setErrorLog] = useState(null);
  const [uploadedDataPoints, setUploadedDataPoints] = useState([]);
  const [fileName, setFileName] = useState("");
  const [totalSamplesFound, setTotalSamplesFound] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target?.files?.[0] || event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setErrorLog(null);
    setDiagnosticData(null);

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    // 🎛️ PIPELINE A: ROBUST BINARY .DAT PARSER LAYER (Handles Format 212 and Binary Streams)
    if (fileExtension === 'dat') {
      reader.onload = (e) => {
        const buffer = e.target.result;
        // Read as raw 8-bit bytes to avoid "multiple of 2" RangeErrors
        const u8Array = new Uint8Array(buffer);
        
        let numericArray = [];

        // MIT-BIH Format 212 unpacking loop (Processes 3 bytes at a time to extract 2 samples)
        for (let i = 0; i + 2 < u8Array.length; i += 3) {
          const b1 = u8Array[i];
          const b2 = u8Array[i + 1];
          const b3 = u8Array[i + 2];

          // Extract first 12-bit sample
          const sample1 = b1 | ((b2 & 0x0f) << 8);
          // Sign extend if it's a negative 12-bit value
          const signExtended1 = sample1 > 2047 ? sample1 - 4096 : sample1;

          // Extract second 12-bit sample
          const sample2 = b3 | ((b2 & 0xf0) << 4);
          const signExtended2 = sample2 > 2047 ? sample2 - 4096 : sample2;

          numericArray.push(signExtended1);
          numericArray.push(signExtended2);
        }

        // Fallback fallback: If the file wasn't Format 212 and resulted in an empty array, read as plain 8-bit stream
        if (numericArray.length === 0) {
          numericArray = Array.from(u8Array);
        }

        // Clean out any unexpected malformed elements
        numericArray = numericArray.filter(val => !isNaN(val));
        const sampleCount = numericArray.length;
        setTotalSamplesFound(sampleCount);

        if (sampleCount === 0) {
          setErrorLog("Binary decoding yielded no data! The file might be empty or unreadable.");
          setUploadedDataPoints([]);
          return;
        }

        // Automatically extract the required 180 samples
        let standardizedWindow = [...numericArray];
        if (sampleCount > 180) {
          standardizedWindow = numericArray.slice(0, 180);
        } else if (sampleCount < 180) {
          setErrorLog(`Binary stream is too short! Extracted ${sampleCount} samples, but the QNN pipeline requires at least 180.`);
          setUploadedDataPoints([]);
          return;
        }

        setUploadedDataPoints(standardizedWindow);
      };
      
      reader.readAsArrayBuffer(file);

    // 📝 PIPELINE B: TEXT / CSV PARSER LAYER
    } else {
      reader.onload = (e) => {
        const text = e.target.result;
        let numericArray = text
          .replace(/[\r\n;]+/g, ',')
          .split(',')
          .map(val => val.trim())
          .filter(val => val !== "")
          .map(val => parseFloat(val));

        numericArray = numericArray.filter(val => !isNaN(val));
        const sampleCount = numericArray.length;
        setTotalSamplesFound(sampleCount);

        if (sampleCount === 0) {
          setErrorLog("Could not find any numeric parameters inside the document.");
          setUploadedDataPoints([]);
          return;
        }

        let standardizedWindow = [...numericArray];
        if (sampleCount > 180) {
          standardizedWindow = numericArray.slice(0, 180);
        } else if (sampleCount < 180) {
          setErrorLog(`Signal text is too short! Contains ${sampleCount} samples instead of the required 180.`);
          setUploadedDataPoints([]);
          return;
        }

        setUploadedDataPoints(standardizedWindow);
      };
      reader.readAsText(file);
    }
  };

  const triggerLiveAnalysis = async () => {
    if (uploadedDataPoints.length !== 180) {
      setErrorLog("Please upload a valid data sequence first.");
      return;
    }

    setIsProcessing(true);
    setErrorLog(null);

    try {
      const response = await fetch('http://localhost:3000/api/v1/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: "HOSP-USER-MULTI-FORMAT-UPLOAD",
          lead_telemetry: uploadedDataPoints
        })
      });

      if (!response.ok) throw new Error(`Server returned HTTP error code: ${response.status}`);
      const payload = await response.json();
      setDiagnosticData(payload.quantum_analysis);
    } catch (err) {
      setErrorLog(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', margin: '0 0 20px 0' }}>
        🏥 Hybrid QML Cardiovascular Assessment Monitor
      </h2>
      
      {/* Universal File Upload Workspace Component */}
      <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#475569' }}>📁 Upload Raw ECG File (.dat, .csv, .txt)</h4>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#64748b' }}>
          Select any telemetry file. Long binary streams or text logs will be automatically windowed to the first 180 elements.
        </p>
        <input type="file" accept=".csv,.txt,.dat" onChange={handleFileUpload} style={{ fontSize: '14px', color: '#475569' }} />
        
        {fileName && (
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#334155' }}>
            <p style={{ margin: '0 0 4px 0', color: '#059669' }}><strong>Loaded Dataset:</strong> {fileName}</p>
            <p style={{ margin: '0', color: '#64748b', fontSize: '13px' }}>
              📊 Total data array size: <strong>{totalSamplesFound.toLocaleString()} samples</strong> 
              {totalSamplesFound > 180 && <span style={{ color: '#2563eb' }}> (Auto-sliced to primary 180 window block)</span>}
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={triggerLiveAnalysis} 
        disabled={isProcessing || uploadedDataPoints.length !== 180}
        style={{ 
          padding: '12px 24px', fontSize: '16px', 
          backgroundColor: (isProcessing || uploadedDataPoints.length !== 180) ? '#cbd5e1' : '#3498db', 
          color: '#fff', border: 'none', borderRadius: '6px', 
          cursor: (isProcessing || uploadedDataPoints.length !== 180) ? 'not-allowed' : 'pointer', 
          fontWeight: 'bold', width: '100%'
        }}
      >
        {isProcessing ? "Processing Quantum Ansatz Rotations..." : "Analyze Patient Data Stream"}
      </button>

      {errorLog && <div style={{ marginTop: '20px', color: '#e74c3c', fontWeight: 'bold', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px', border: '1px solid #fee2e2' }}>⚠️ {errorLog}</div>}

      {/* Waveform Window Data Feedback Visualizer */}
      {uploadedDataPoints.length === 180 && !errorLog && (
        <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>📈 Active Window Sub-Array Preview (First 15 samples):</h4>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px', fontSize: '13px', color: '#475569' }}>
            {uploadedDataPoints.slice(0, 15).map((val, idx) => (
              <span key={idx} style={{ backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                [{idx}]: {val.toFixed(4)}
              </span>
            ))}
            <span>... (+165 hidden parameters)</span>
          </div>
        </div>
      )}

      {/* Probability Spaces Breakdown Display Card */}
      {diagnosticData && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>
            Diagnostic Assessment Status: <span style={{ color: '#e74c3c', textTransform: 'uppercase' }}>{diagnosticData.detected_class}</span>
          </h3>
          <p style={{ color: '#7f8c8d' }}>Quantum Engine Classification Certainty: <strong>{(diagnosticData.confidence_score * 100).toFixed(2)}%</strong></p>

          <h4 style={{ borderTop: '1px solid #eee', paddingTop: '15px', color: '#34495e' }}>📊 Probability Space Breakdown</h4>
          {Object.entries(diagnosticData.predictions_breakdown).map(([condition, prob]) => (
            <div key={condition} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ width: '80px', fontWeight: '500' }}>{condition}:</span>
              <div style={{ flexGrow: 1, backgroundColor: '#e1e8ed', height: '12px', borderRadius: '6px', margin: '0 15px', overflow: 'hidden' }}>
                <div style={{ width: `${prob * 100}%`, backgroundColor: '#2ecc71', height: '100%' }}></div>
              </div>
              <span style={{ width: '60px', textAlign: 'right' }}>{(prob * 100).toFixed(2)}%</span>
            </div>
          ))}

          <h4 style={{ borderTop: '1px solid #eee', paddingTop: '15px', color: '#34495e' }}>⚙️ Telemetric Quantum Rotational Weights</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f2f6', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Quantum Node Element ID</th>
                <th style={{ padding: '8px' }}>Active Parametric Weight States</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticData.quantum_features.map((val, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f2f6' }}>
                  <td style={{ padding: '8px', color: '#57606f' }}>Qubit Node Matrix Mapping Axis #{idx + 1}</td>
                  <td style={{ padding: '8px', fontWeight: 'bold', color: '#2f3542' }}>{val.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}