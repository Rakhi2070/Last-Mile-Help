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
  const detailRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://192.168.1.108:5000/api/users/${id}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
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
      <h2 style="font-size: 22px; text-align: center; font-weight: bold; margin-bottom: 10px;">User Details</h2>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Address:</strong> ${user.address}</p>
      <p><strong>Gender:</strong> ${user.gender}</p>
      <p><strong>Age:</strong> ${user.age}</p>
      <br />
      <p><strong>Photo:</strong></p>
      <img src="http://192.168.1.108:5000/uploads/${user.photo}" style="width: 100px; height: 100px; object-fit: cover;" />
      <br /><br />
      <p><strong>Document:</strong></p>
      <a href="http://192.168.1.108:5000/uploads/${user.document}" style="color: blue;">View Document</a>
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

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div ref={detailRef} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">User Details</h2>

        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Age:</strong> {user.age}</p>
        </div>

        <div className="my-4">
          <p className="font-semibold">Photo:</p>
          <img
            src={`http://192.168.1.108:5000/uploads/${user.photo}`}
            alt="User"
            className="w-32 h-32 object-cover rounded mt-1"
          />
        </div>

        <div className="my-4">
          <p className="font-semibold">Document:</p>
          <a
            href={`http://192.168.1.108:5000/uploads/${user.document}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="font-semibold mb-2">QR Code (opens this page)</p>
          <div className="inline-block bg-white p-2 rounded shadow">
            <QRCode value={`http://192.168.1.108:5173/user/${id}`} size={128} />
          </div>
        </div>

        <div className="mt-6 text-center space-x-4">
          <button
            onClick={handleDownloadQR}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download QR as PNG
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Details as PDF
          </button>

          {/* <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Apply for Services
            </h3>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Select Service:
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Choose --</option>
                <option value="Ration">Ration</option>
                <option value="Shelter">Shelter</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Job">Job</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Notes (optional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded"
                placeholder="Additional info or special needs..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                onClick={handleApplyService}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Submit Application
              </button> */}
            </div> 
          </div>
        </div>
  );
};

export default UserDetail;
