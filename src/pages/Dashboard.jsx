import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import {
  userAPI,
  cardRequestAPI,
  cardAPI,
  authUtils,
  apiErrorHandler,
} from "../services/api";

function Dashboard({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardRequests, setCardRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cardRequests");
  const navigate = useNavigate();

  // Fetch all data when component mounts
  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchCardRequests(),
        fetchApprovedCards(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Get students from approved cards instead of separate API
      const response = await cardAPI.getAllCards();
      console.log('Cards response for students:', response);
      const cardsData = response?.data || response?.cards || response || [];
      
      // Convert approved cards to student format
      const studentsFromCards = cardsData.map((card) => ({
        _id: card._id,
        name: card.name || 'N/A',
        email: card.email || 'N/A',
        regNumber: card.regNumber,
        department: card.department,
        school: card.school,
        program: card.program,
        yearOfStudy: card.yearOfStudy,
        status: "Active", // All approved cards are active students
        cardId: card._id,
        hasCard: true,
        cardLocation: card.location,
        blockchainHash: card.hash
      }));
      
      setStudents(studentsFromCards);
    } catch (error) {
      console.error('Students fetch error:', error);
      const errorMessage = apiErrorHandler(error);
      toast.error(`Failed to fetch students: ${errorMessage}`);
      setStudents([]);
    }
  };

  const fetchCardRequests = async () => {
    try {
      const response = await cardRequestAPI.getAllCardRequests();
      console.log('Card requests response:', response);
      
      // Handle the response structure: { message: "...", data: [...] }
      const requestsData = response?.data || response?.requests || response || [];
      const requestsWithStatus = requestsData.map((req) => ({
        ...req,
        status: req.status || "Pending",
      }));
      setCardRequests(requestsWithStatus);
    } catch (error) {
      console.error('Card requests fetch error:', error);
      const errorMessage = apiErrorHandler(error);
      toast.error(`Failed to fetch card requests: ${errorMessage}`);
      setCardRequests([]);
    }
  };

  const fetchApprovedCards = async () => {
    try {
      const response = await cardAPI.getAllCards();
      console.log('All cards response:', response);
      
      // Handle the response structure: { message: "...", data: [...] }
      const cardsData = response?.data || response?.cards || response || [];
      setCards(cardsData);
    } catch (error) {
      console.error('All cards fetch error:', error);
      const errorMessage = apiErrorHandler(error);
      toast.error(`Failed to fetch approved cards: ${errorMessage}`);
      setCards([]);
    }
  };

  // Update card status function
  const updateCardStatus = async (id, status) => {
    try {
      await cardRequestAPI.updateCardStatus(id, status);
      
      // Update local state
      const updatedRequests = cardRequests.map(request =>
        request._id === id ? { ...request, status } : request
      );
      setCardRequests(updatedRequests);
      
      toast.success(`Request ${status.toLowerCase()} successfully!`);
      
      // Refresh data to get latest
      await fetchCardRequests();
      await fetchApprovedCards();
    } catch (error) {
      const errorMessage = apiErrorHandler(error);
      toast.error(`Failed to ${status.toLowerCase()} request: ${errorMessage}`);
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    navigate("/login");
  };

  const downloadCard = async (cardUrl, studentName, regNumber) => {
    try {
      const response = await fetch(cardUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${studentName}_${regNumber}_card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Card downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download card');
    }
  };

  const renderTabContent = () => {
    if (activeTab === "students") {
      return (
        <div className="grid gap-6">
          {students.length === 0 && (
            <p className="text-center text-gray-500">No students with approved cards found.</p>
          )}
          {students.map((student, index) => (
            <div
              key={student._id || index}
              className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-start"
            >
              <div className="flex-1">
                <p><strong>Name:</strong> {student.name || 'N/A'}</p>
                <p><strong>Registration No:</strong> {student.regNumber || 'N/A'}</p>
                <p><strong>Email:</strong> {student.email || 'N/A'}</p>
                <p><strong>School:</strong> {student.school || 'N/A'}</p>
                <p><strong>Department:</strong> {student.department || 'N/A'}</p>
                <p><strong>Program:</strong> {student.program || 'N/A'}</p>
                <p><strong>Year of Study:</strong> {student.yearOfStudy || 'N/A'}</p>
                <p><strong>Card ID:</strong> {student.cardId || 'N/A'}</p>
                {student.blockchainHash && (
                  <p><strong>Blockchain Hash:</strong> <span className="text-xs font-mono break-all">{student.blockchainHash}</span></p>
                )}
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`font-bold text-green-600`}>
                    {student.status} (Card Issued)
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 mt-2 md:mt-0">
                {student.cardLocation && (
                  <div className="text-center">
                    <img
                      src={student.cardLocation}
                      alt="Student Card"
                      className="w-32 h-20 rounded object-cover border mb-2"
                    />
                    <button
                      onClick={() => downloadCard(student.cardLocation, student.name, student.regNumber)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                    >
                      Download Card
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "cardRequests") {
      return (
        <div className="grid gap-6">
          {cardRequests.length === 0 && (
            <p className="text-center text-gray-500">No card requests found.</p>
          )}
          {cardRequests.map((request, idx) => (
            <div
              key={request._id || idx}
              className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-center"
            >
              <div className="flex-1">
                <p><strong>ID:</strong> {request._id}</p>
                {request.name && <p><strong>Name:</strong> {request.name}</p>}
                {request.regNumber && <p><strong>Registration No:</strong> {request.regNumber}</p>}
                {request.school && <p><strong>School:</strong> {request.school}</p>}
                {request.program && <p><strong>Program:</strong> {request.program}</p>}
                {request.department && <p><strong>Department:</strong> {request.department}</p>}
                {request.yearOfStudy && <p><strong>Year of Study:</strong> {request.yearOfStudy}</p>}
                {request.age && <p><strong>Age:</strong> {request.age}</p>}
                {request.email && <p><strong>Email:</strong> {request.email}</p>}
                <p><strong>Date:</strong> {new Date(request.Date).toLocaleDateString()}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      request.status === "Approved"
                        ? "text-green-600"
                        : request.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>
                {request.photo && (
                  <div className="mt-2">
                    <img
                      src={request.photo}
                      alt="Student"
                      className="w-20 h-20 rounded object-cover border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  onClick={() => updateCardStatus(request._id, "Approved")}
                  disabled={request.status === "Approved"}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={() => updateCardStatus(request._id, "Rejected")}
                  disabled={request.status === "Rejected"}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "cards") {
      return (
        <div className="grid gap-6">
          {cards.length === 0 && (
            <p className="text-center text-gray-500">No approved cards found.</p>
          )}
          {cards.map((card, idx) => (
            <div
              key={card._id || idx}
              className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-center"
            >
              <div className="flex-1">
                <p><strong>Card ID:</strong> {card._id}</p>
                <p><strong>Name:</strong> {card.name || 'N/A'}</p>
                <p><strong>Registration No:</strong> {card.regNumber}</p>
                <p><strong>School:</strong> {card.school || 'N/A'}</p>
                <p><strong>Department:</strong> {card.department}</p>
                <p><strong>Year of Study:</strong> {card.yearOfStudy}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{card.status}</span></p>
                <p><strong>Date Created:</strong> {new Date(card.Date).toLocaleDateString()}</p>
                {card.hash && (
                  <div className="mt-2">
                    <p><strong>Blockchain Hash:</strong></p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{card.hash}</p>
                  </div>
                )}
                {card.requestId && (
                  <p><strong>Request ID:</strong> <span className="text-xs font-mono">{card.requestId}</span></p>
                )}
              </div>
              {card.location && (
                <div className="mt-2 md:mt-0 md:ml-4 text-center">
                  <p className="text-sm font-medium mb-2">Generated Card:</p>
                  <img
                    src={card.location}
                    alt="Generated Student Card"
                    className="w-40 h-25 rounded border-2 border-gray-300 object-contain bg-white mb-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    onClick={() => downloadCard(card.location, card.name, card.regNumber)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                  >
                    Download Card
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <div className="flex-1 p-6 bg-white shadow rounded relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Students with Cards</h3>
              <p className="text-2xl font-bold text-blue-900">{students.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Requests</h3>
              <p className="text-2xl font-bold text-green-900">{cardRequests.length}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {cardRequests.filter(r => r.status === "Pending").length}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Approved Cards</h3>
              <p className="text-2xl font-bold text-purple-900">{cards.length}</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-800">On Blockchain</h3>
              <p className="text-2xl font-bold text-indigo-900">
                {cards.filter(card => card.hash).length}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded transition ${
                activeTab === "students"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("students")}
            >
              Students ({students.length})
            </button>
            <button
              className={`px-4 py-2 rounded transition ${
                activeTab === "cardRequests"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("cardRequests")}
            >
              Card Requests ({cardRequests.length})
            </button>
            <button
              className={`px-4 py-2 rounded transition ${
                activeTab === "cards"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("cards")}
            >
              Approved Cards ({cards.length})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Tab Content */}
          {!loading && renderTabContent()}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Dashboard;
