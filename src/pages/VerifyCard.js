import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import sha256 from 'crypto-js/sha256';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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

  const verifyStudent = (scannedText) => {
    const studentId = scannedText.split("ID:")[1]?.split(" - ")[0];
    const studentName = scannedText.split(" - ")[1];

    const students = JSON.parse(localStorage.getItem('studentRequests')) || [];
    const blockchain = JSON.parse(localStorage.getItem('blockchain')) || {};

    const student = students.find(s => s.registrationNumber === studentId);

    if (!student) {
      setVerificationStatus('not-found');
      return;
    }

    const dataString = `${student.name}|${student.registrationNumber}|${student.school}|${student.department}|${student.yearOfStudy}`;
    const localHash = sha256(dataString).toString();
    const blockchainHash = blockchain[student.registrationNumber];

    if (localHash === blockchainHash) {
      setVerificationStatus('valid');
    } else {
      setVerificationStatus('tampered');
    }
  };

  const getStatusCard = () => {
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
    </div>
  );
}

export default VerifyCard;
