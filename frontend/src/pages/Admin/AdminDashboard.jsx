import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/admin";

export default function AdminDashboard() {
  const [pendingAgencies, setPendingAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingAgencies();
  }, []);

  const fetchPendingAgencies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/pending-agencies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingAgencies(res.data);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to load agencies");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Agency approved!");
      fetchPendingAgencies();
    } catch (err) {
      console.error("Approve agency error:", err);
      toast.error("Failed to approve");
    }

  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Agency rejected!");
      fetchPendingAgencies();
    } catch (err) {
      console.error("Reject agency error:", err);
      toast.error("Failed to reject");
    }



  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-900 text-white">
            <h2 className="text-2xl font-bold">Pending Agency Approvals ({pendingAgencies.length})</h2>
          </div>

          {pendingAgencies.length === 0 ? (
            <div className="p-10 text-center text-gray-600">
              No pending agencies
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Agency Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">License</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAgencies.map((agency) => (
                  <tr key={agency._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{agency.agencyName}</td>
                    <td className="p-4">{agency.email}</td>
                    <td className="p-4">{agency.agencyPhone}</td>
                    <td className="p-4">{agency.licenseNumber}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleApprove(agency._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(agency._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}