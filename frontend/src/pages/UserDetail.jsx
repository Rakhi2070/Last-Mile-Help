import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const detailRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://192.168.1.108:5000/api/users/${id}`);
        setUser(res.data);
        setError("");
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDownloadQR = () => {
    const svg = document.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `${user.name}_QRCode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleDownloadPDF = () => {
    if (!user) return;

    const printContent = document.createElement("div");
    printContent.style.fontFamily = "Arial, sans-serif";
    printContent.style.padding = "20px";
    printContent.style.backgroundColor = "#ffffff";
    printContent.style.color = "#000000";
    printContent.style.width = "600px";

    printContent.innerHTML = `
      <h2 style="font-size: 22px; text-align: center; font-weight: bold; margin-bottom: 20px; color: #1f2937;">User Details</h2>
      <div style="border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px;">
        <p style="margin-bottom: 8px;"><strong>Name:</strong> ${user.name}</p>
        <p style="margin-bottom: 8px;"><strong>Email:</strong> ${user.email}</p>
        <p style="margin-bottom: 8px;"><strong>Phone:</strong> ${user.phone}</p>
        <p style="margin-bottom: 8px;"><strong>Address:</strong> ${user.address}</p>
        <p style="margin-bottom: 8px;"><strong>Gender:</strong> ${user.gender}</p>
        <p style="margin-bottom: 8px;"><strong>Age:</strong> ${user.age}</p>
        <br />
        <p style="margin-bottom: 8px;"><strong>Photo:</strong></p>
        <img src="http://192.168.1.108:5000/uploads/${user.photo}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 2px solid #e5e7eb;" />
        <br /><br />
        <p style="margin-bottom: 8px;"><strong>Document:</strong></p>
        <a href="http://192.168.1.108:5000/uploads/${user.document}" style="color: #2563eb; text-decoration: underline;">View Document</a>
      </div>
    `;

    document.body.appendChild(printContent);

    html2canvas(printContent, {
      backgroundColor: "#ffffff",
      useCORS: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${user.name}_Details.pdf`);
        document.body.removeChild(printContent);
      })
      .catch((err) => {
        console.error("PDF generation failed:", err);
        document.body.removeChild(printContent);
      });
  };

  const handleApplyService = async () => {
    if (!serviceType) return alert("Please select a service.");

    try {
      await axios.post(`http://192.168.1.108:5000/api/users/${id}/apply-service`, {
        userId: id,
        serviceType,
        notes,
      });

      alert("Service application submitted successfully.");
      setServiceType("");
      setNotes("");
    } catch (error) {
      console.error("Service application failed:", error);
      alert("Failed to submit service application.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-lg">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">User Profile</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main User Details Card */}
          <div ref={detailRef} className="bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <img
                  src={`http://192.168.1.108:5000/uploads/${user.photo}`}
                  alt={user.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  ✓
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{user.name}</h2>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  📧
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  📱
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  🏠
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-800">{user.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                    {user.gender === 'Male' ? '👨' : user.gender === 'Female' ? '👩' : '👤'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-semibold text-gray-800">{user.gender}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    🎂
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold text-gray-800">{user.age} years</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    📄
                  </div>
                  <p className="text-sm text-gray-500">Document</p>
                </div>
                <a
                  href={`http://192.168.1.108:5000/uploads/${user.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View Document
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* QR Code and Actions Card */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="bg-white shadow-xl rounded-2xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">QR Code</h3>
              <p className="text-gray-600 mb-6">Scan to view this profile</p>
              
              <div className="inline-block bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-inner">
                <QRCode 
                  value={`http://192.168.1.108:5173/user/${id}`} 
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleDownloadQR}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                >
                  📥 Download QR Code
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                >
                  📄 Download PDF Report
                </button>
              </div>
            </div>

            {/* Service Application Card */}
            <div className="bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Apply for Services
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Service
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    <option value="">-- Choose a Service --</option>
                    <option value="Ration">🍽️ Ration</option>
                    <option value="Shelter">🏠 Shelter</option>
                    <option value="Healthcare">🏥 Healthcare</option>
                    <option value="Job">💼 Job</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    placeholder="Please provide any additional information or special requirements..."
                  />
                </div>

                <button
                  onClick={handleApplyService}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                >
                  🚀 Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;