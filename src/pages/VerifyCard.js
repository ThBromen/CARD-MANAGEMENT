import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import sha256 from 'crypto-js/sha256';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cardAPI, cardRequestAPI, apiErrorHandler } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      // Extract student information from QR code
      const studentId = scannedText.split("ID:")[1]?.split(" - ")[0];
      const studentName = scannedText.split(" - ")[1];

      if (!studentId) {
        setVerificationStatus('invalid-format');
        return;
      }

      // Get all approved cards from API
      const cardsData = await cardAPI.getAllCards();
      const cards = cardsData?.cards || cardsData || [];

      // Find the card by registration number
      const studentCard = cards.find(card => 
        card.regNumber === studentId || card.registrationNumber === studentId
      );

      if (!studentCard) {
        setVerificationStatus('not-found');
        return;
      }

      // Verify the hash
      const dataString = `${studentCard.name}|${studentCard.regNumber || studentCard.registrationNumber}|${studentCard.school}|${studentCard.department}|${studentCard.yearOfStudy}`;
      const localHash = sha256(dataString).toString();
      const cardHash = studentCard.hash;

      if (localHash === cardHash) {
        setVerificationStatus({
          status: 'valid',
          student: studentCard,
          scannedName: studentName
        });
      } else {
        setVerificationStatus('tampered');
      }
    } catch (error) {
      const errorMessage = apiErrorHandler(error);
      toast.error(`Verification failed: ${errorMessage}`);
      setVerificationStatus('error');
    }
  };

  const getStatusCard = () => {
    if (verificationStatus?.status === 'valid') {
      return (
        <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl p-6 shadow-md flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">✅ Card Valid</h3>
            <p>Student: {verificationStatus.student.name}</p>
            <p>ID: {verificationStatus.student.regNumber || verificationStatus.student.registrationNumber}</p>
            <p>School: {verificationStatus.student.school}</p>
            <p>Department: {verificationStatus.student.department}</p>
          </div>
        </div>
      );
    }

    switch (verificationStatus) {
      case 'valid':
        return (
          <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Card is Valid</h3>
              <p className="text-sm">This card is verified and unaltered.</p>
            </div>
          </div>
        );
      case 'tampered':
        return (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Card Tampered</h3>
              <p className="text-sm">The data does not match the blockchain record.</p>
            </div>
          </div>
        );
      case 'not-found':
        return (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Student Not Found</h3>
              <p className="text-sm">No matching student was found in the database.</p>
            </div>
          </div>
        );
      case 'invalid-format':
        return (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Invalid QR Code Format</h3>
              <p className="text-sm">The QR code format is not recognized.</p>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 shadow-md flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Verification Error</h3>
              <p className="text-sm">An error occurred during verification. Please try again.</p>
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
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Student Card Verification</h2>
        <div id="reader" className="rounded-lg border shadow-md overflow-hidden mb-6" />

        {getStatusCard()}

        {scanResult && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Scanned Data: <span className="font-mono">{scanResult}</span>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default VerifyCard;
