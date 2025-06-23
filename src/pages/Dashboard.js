import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import sha256 from 'crypto-js/sha256';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Alert, AlertDescription } from "../components/ui/Alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import PopupForm from "../components/PopupForm";
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';


function Dashboard({ onLogout }) {

  // Moved useEffects inside the component
  useEffect(() => {
    const fetchStudentRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://student-card-api.onrender.com/api/v1/user/getUser/');
        const data = await res.json();
        // Ensure each request has a status property
        const requestsWithStatus = (data?.users || []).map(req => ({
          ...req,
          status: req.status || 'Pending'
        }));
        setRequests(requestsWithStatus);
      } catch (err) {
        toast.error("Failed to fetch student requests from API");
        setRequests([]);
      }
      setLoading(false);
    };
    fetchStudentRequests();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchStudentRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://student-card-api.onrender.com/api/v1/cardRequest/card');
        const data = await res.json();
        // Ensure each request has a status property
        const requestsWithStatus = (data?.requests || []).map(req => ({
          ...req,
          status: req.status || 'Pending'
        }));
        setRequests(requestsWithStatus);
      } catch (err) {
        toast.error("Failed to fetch student requests from API");
        setRequests([]);
      }
      setLoading(false);
    };
    fetchStudentRequests();
    // eslint-disable-next-line
  }, []);
 
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://student-card-api.onrender.com/api/v1/user/getUser/');
      const data = await res.json();
      setStudents(data?.users || []);
    } catch (err) {
      toast.error("Failed to fetch students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);
  const [cards, setCards] = useState([]);
  const [cardRequests, setCardRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [requests, setRequests] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  // Load student requests from localStorage on mount
  useEffect(() => {
    let storedRequests = JSON.parse(localStorage.getItem('studentRequests')) || [];
    // Ensure each request has a status property
    storedRequests = storedRequests.map(req => ({
      ...req,
      status: req.status || 'Pending'
    }));
    setRequests(storedRequests);
    localStorage.setItem('studentRequests', JSON.stringify(storedRequests));
  }, []);

  // Optionally, fetch cards and card requests on mount
  useEffect(() => {
    fetchCards();
    fetchCardRequests();
    // eslint-disable-next-line
  }, []);

  // State and handlers for editing student requests (moved above renderTabContent to avoid reference errors)
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(requests[index]);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    const updatedRequests = [...requests];
    updatedRequests[editingIndex] = editData;
    setRequests(updatedRequests);
    localStorage.setItem('studentRequests', JSON.stringify(updatedRequests));
    toast.success(`Updated ${editData.name}`);
    setEditingIndex(null);
  };

  const renderTabContent = () => {
    if (activeTab === 'students') {
      return (
        <div className="grid gap-6">
          {requests.length === 0 && <p className="text-center text-gray-500">No student requests found.</p>}
          {requests.map((student, index) => (
            <div key={index} className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-center">
              {editingIndex === index ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="registrationNumber"
                    value={editData.registrationNumber}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                    placeholder="Registration Number"
                  />
                  <input
                    type="text"
                    name="school"
                    value={editData.school}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                    placeholder="School"
                  />
                  <input
                    type="text"
                    name="department"
                    value={editData.department}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                    placeholder="Department"
                  />
                  <input
                    type="text"
                    name="yearOfStudy"
                    value={editData.yearOfStudy}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                    placeholder="Year of Study"
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" onClick={handleSaveEdit}>Save</button>
                    <button className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500" onClick={() => setEditingIndex(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Registration No:</strong> {student.registrationNumber}</p>
                    <p><strong>School:</strong> {student.school}</p>
                    <p><strong>Department:</strong> {student.department}</p>
                    <p><strong>Year of Study:</strong> {student.yearOfStudy}</p>
                    <p><strong>Status:</strong> <span className={`font-bold ${
                      student.status === 'Approved'
                        ? 'text-green-600'
                        : student.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}>{student.status}</span></p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => viewStudent(student)}>View</button>
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" onClick={() => handleApprove(index)} disabled={student.status === 'Approved'}>Approve</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleReject(index)} disabled={student.status === 'Rejected'}>Reject</button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" onClick={() => handleEdit(index)}>Edit</button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700" onClick={() => handleDelete(index)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === 'cardRequests') {
      return (
        <div className="grid gap-6">
          {cardRequests.length === 0 && <p className="text-center text-gray-500">No card requests found.</p>}
          {cardRequests.map((request, idx) => (
            <div key={idx} className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-center">
              <div>
                <p><strong>Name:</strong> {request.studentName || request.name}</p>
                <p><strong>Registration No:</strong> {request.registrationNumber}</p>
                <p><strong>Status:</strong> <span className={`font-bold ${
                  request.status === 'Approved'
                    ? 'text-green-600'
                    : request.status === 'Rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}>{request.status}</span></p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => viewCardRequest(request)}>View</button>
                <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" onClick={() => updateCardStatus(request._id, 'Approved')}>Approve</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => updateCardStatus(request._id, 'Rejected')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === 'cards') {
      return (
        <div className="grid gap-6">
          {cards.length === 0 && <p className="text-center text-gray-500">No cards available.</p>}
          {cards.map((card, idx) => (
            <div key={idx} className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-center">
              <div>
                <p><strong>Name:</strong> {card.studentName || card.name}</p>
                <p><strong>Registration No:</strong> {card.registrationNumber}</p>
                <p><strong>Card ID:</strong> {card._id}</p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => viewCard(card)}>View</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => deleteCard(card._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Fetch all card requests (API)
  const fetchCardRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://student-card-api.onrender.com/api/v1/cardRequest/card');
      const data = await res.json();
      setCardRequests(data?.requests || []);
    } catch (err) {
      toast.error("Failed to fetch card requests from API");
    }
    setLoading(false);
  };

  // Fetch all cards
  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://student-card-api.onrender.com/api/v1/cardRequest/allCards');
      const data = await res.json();
      setCards(data?.cards || []);
    } catch (err) {
      toast.error("Failed to fetch cards");
    }
    setLoading(false);
  };

  // Add student
  const addStudent = async (studentData) => {
    setLoading(true);
    try {
      const res = await fetch('https://student-card-api.onrender.com/api/v1/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (res.ok) {
        toast.success("Student added");
      } else {
        toast.error("Failed to add student");
      }
    } catch (err) {
      toast.error("Error adding student");
    }
    setLoading(false);
  };

  // Update card status
  const updateCardStatus = async (id, status) => {
    setLoading(true);
    try {
      const res = await fetch(`https://student-card-api.onrender.com/api/v1/cardRequest/card/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Card status updated to ${status}`);
        fetchCardRequests();
      } else {
        toast.error("Failed to update card status");
      }
    } catch (err) {
      toast.error("Error updating card status");
    }
    setLoading(false);
  };

  // Delete card
  const deleteCard = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`https://student-card-api.onrender.com/api/v1/cardRequest/card/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.info("Card deleted");
        fetchCards();
      } else {
        toast.error("Failed to delete card");
      }
    } catch (err) {
      toast.error("Error deleting card");
    }
    setLoading(false);
  };

  // Placeholder handlers for missing view functions
  const viewStudent = (student) => {
    toast.info(`Viewing student: ${student.name}`);
  };

  const viewCardRequest = (request) => {
    toast.info(`Viewing card request for: ${request.studentName || request.name}`);
  };

  const viewCard = (card) => {
    toast.info(`Viewing card for: ${card.studentName || card.name}`);
  };

  // Approve student request
  const handleApprove = (index) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = 'Approved';
    setRequests(updatedRequests);
    localStorage.setItem('studentRequests', JSON.stringify(updatedRequests));
    toast.success(`Approved ${updatedRequests[index].name}`);
    sendEmail(updatedRequests[index], 'approved');
    storeHashOnBlockchain(updatedRequests[index]);
  };

  // Reject student request
  const handleReject = (index) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = 'Rejected';
    setRequests(updatedRequests);
    localStorage.setItem('studentRequests', JSON.stringify(updatedRequests));
    toast.error(`Rejected ${updatedRequests[index].name}`);
    sendEmail(updatedRequests[index], 'rejected');
  };

  const handleDelete = (index) => {
    const updatedRequests = [...requests];
    const deleted = updatedRequests.splice(index, 1);
    setRequests(updatedRequests);
    localStorage.setItem('studentRequests', JSON.stringify(updatedRequests));
    toast.info(`Deleted ${deleted[0].name}`);
  };

  const handleChangePassword = () => {
    localStorage.setItem('adminPassword', newPassword);
    toast.success("Password changed successfully");
    setShowChangePassword(false);
    setNewPassword('');
  };

  const sendEmail = (student, status) => {
    console.log(`Sending email to ${student.email}: Your request has been ${status}`);
  };

  const storeHashOnBlockchain = (student) => {
    const studentData = `${student.name}|${student.registrationNumber}|${student.school}|${student.department}|${student.yearOfStudy}`;
    const hash = sha256(studentData).toString();
    const blockchain = JSON.parse(localStorage.getItem('blockchain')) || {};
    blockchain[student.registrationNumber] = hash;
    localStorage.setItem('blockchain', JSON.stringify(blockchain));
    console.log(`Blockchain hash stored for ${student.registrationNumber}: ${hash}`);
  };

  const downloadCard = async (id) => {
    const cardElement = document.getElementById(id);
    const canvas = await html2canvas(cardElement);
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${id}-StudentCard.png`;  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalApproved = requests.filter(r => r.status === 'Approved').length;
  const totalPending = requests.filter(r => r.status === 'Pending').length;
  const totalRejected = requests.filter(r => r.status === 'Rejected').length;

  return (

    <div className="flex">
      <div className="flex-1 p-6 bg-white shadow rounded relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
          <a
            href="/profile"
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
            style={{ textDecoration: "none" }}
          >
            <img
              src={
                JSON.parse(localStorage.getItem('adminUser'))?.profilePic ||
                "https://ui-avatars.com/api/?name=Admin"
              }
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2 object-cover border border-blue-500"
            />
            <span>
              {JSON.parse(localStorage.getItem('adminUser'))?.name || "Admin"}
            </span>
          </a>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

        {/* Tab Navigation */}
        <div className="mb-6 flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('students')}
          >
            Student Requests
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'cardRequests' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('cardRequests')}
          >
            Card Requests
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('cards')}
          >
            Cards
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      </div>
    </div>
  );
}

export default Dashboard;
