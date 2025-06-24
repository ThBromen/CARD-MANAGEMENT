import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VerifyCard() {
  const [scanResult, setScanResult] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText);
          scannerRef.current.clear();
          setVerificationStatus(null);
          verifyStudent(decodedText);
        },
        (errorMessage) => {
          console.warn("QR Scan error:", errorMessage);
        }
      );
    }
  }, []);

  const verifyStudent = async (scannedText) => {
    try {
      // Extract transaction hash from scanned URL
      const txHashMatch = scannedText.match(/tx\/(0x[a-fA-F0-9]{64})$/);
      if (!txHashMatch) {
        setVerificationStatus("invalid-format");
        return;
      }
      const txHash = txHashMatch[1];

      // Call API using GET method with hash as URL parameter
      const response = await fetch(
        `https://student-card-api.onrender.com/api/v1/cardRequest/verify/${encodeURIComponent(txHash)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setVerificationStatus("not-found");
        } else {
          setVerificationStatus("error");
        }
        return;
      }

      const data = await response.json();

      if (data.card) {
        setVerificationStatus({
          status: "valid",
          student: data.card,
        });
      } else {
        setVerificationStatus("not-found");
      }
    } catch (error) {
      toast.error(`Verification failed: ${error.message}`);
      setVerificationStatus("error");
    }
  };

  const getStatusCard = () => {
    if (verificationStatus?.status === "valid") {
      const student = verificationStatus.student;
      return (
        <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl p-6 shadow-md flex items-start gap-4">
          <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold">✅ Card Valid</h3>
            <p><strong>Student:</strong> {student.name}</p>
            <p><strong>ID:</strong> {student.regNumber}</p>
            <p><strong>School:</strong> {student.school}</p>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>Program:</strong> {student.program}</p>
            <p><strong>Year of Study:</strong> {student.yearOfStudy}</p>
            <p><strong>Status:</strong> {student.status}</p>
            <p><strong>Hash:</strong> {student.hash}</p>
            {student.location && (
              <div className="mt-4">
                <img
                  src={student.location}
                  alt="Card"
                  className="w-full max-w-xs rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    switch (verificationStatus) {
      case "tampered":
        return (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Card Tampered</h3>
              <p className="text-sm">
                The data does not match the blockchain record.
              </p>
            </div>
          </div>
        );
      case "not-found":
        return (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Student Not Found</h3>
              <p className="text-sm">
                No matching student was found in the database.
              </p>
            </div>
          </div>
        );
      case "invalid-format":
        return (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Invalid QR Code Format</h3>
              <p className="text-sm">The QR code format is not recognized.</p>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Verification Error</h3>
              <p className="text-sm">
                An error occurred during verification. Please try again.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Student Card Verification
        </h2>
        <div
          id="reader"
          className="rounded-lg border shadow-md overflow-hidden mb-6"
        />

        {getStatusCard()}

        {scanResult && (
          <div className="mt-6 text-center text-sm text-gray-500 break-words">
            Scanned Data: <span className="font-mono">{scanResult}</span>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default VerifyCard;
