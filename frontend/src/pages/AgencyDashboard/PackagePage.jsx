// pages/agency/PackagesPage.jsx
import React, { useState, useEffect } from 'react';
import AgencyLayout from '../../layout/Agencylayout';
import PackageForm from './PackageForm';
import { Plus, Search, Filter, Edit, Trash2, Star, Package as PackageIcon } from 'lucide-react';
import { packageService } from '../../services/packageService';
import ConfirmModal from '../../components/ConfirmModal';
const PackagesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  // Fetch packages on mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packageService.getPackages();

      if (response.success) {
        setPackages(response.data);
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load packages'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePackage = async (packageData) => {
    try {
      if (editingPackage) {
        // Update existing package
        const response = await packageService.updatePackage(editingPackage._id, packageData);
        if (response.success) {
          setMessage({ type: 'success', text: 'Package updated successfully!' });
          fetchPackages(); // Refresh list
        }
      } else {
        // Create new package
        const response = await packageService.createPackage(packageData);
        if (response.success) {
          setMessage({ type: 'success', text: 'Package created successfully!' });
          fetchPackages(); // Refresh list
        }
      }

      setShowForm(false);
      setEditingPackage(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save package'
      });
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const openDeleteModal = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!packageToDelete) return;

    try {
      const response = await packageService.deletePackage(packageToDelete._id);
      if (response.success) {
        setMessage({ type: 'success', text: 'Package deleted successfully!' });
        fetchPackages();
        setShowDeleteModal(false);
        setPackageToDelete(null);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete package'
      });
      setShowDeleteModal(false);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await packageService.toggleFeatured(id);
      fetchPackages(); // Refresh list
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'strenuous': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading packages...</p>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Packages</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create and manage your travel packages</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} />
          Add New Package
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-5 p-4 rounded-2xl flex items-center justify-between text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search packages by title, destination, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm outline-none"
            />
          </div>
          <button
            onClick={fetchPackages}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-600 transition-all"
          >
            <Filter size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-600 to-emerald-600">
              <tr>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">Package</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">Destination</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">Price</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">Duration</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">Difficulty</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPackages.map(pkg => (
                <tr key={pkg._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg mr-4 overflow-hidden bg-gray-200 flex items-center justify-center">
                        {pkg.images?.[0]?.url ? (
                          <img
                            src={`https://travelmatess.onrender.com${pkg.images[0].url}`}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/assets/images/default-package.jpg";
                              e.target.className = "w-6 h-6 text-gray-400";
                            }}
                          />
                        ) : (
                          <PackageIcon size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 flex items-center">
                          {pkg.title}
                          {pkg.featured && (
                            <span
                              onClick={() => handleToggleFeatured(pkg._id)}
                              className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full cursor-pointer"
                            >
                              ✨
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {pkg.rating?.average || 0} ({pkg.rating?.count || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{pkg.destination}</div>
                    <div className="text-sm text-gray-500">{pkg.category}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-800">NPR {pkg.price?.toLocaleString() || 0}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{pkg.duration} days</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pkg.difficulty)}`}>
                      {pkg.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={pkg.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await packageService.updateStatus(pkg._id, newStatus);

                        setPackages((prev) =>
                          prev.map((p) =>
                            p._id === pkg._id ? { ...p, status: newStatus } : p
                          )
                        );
                      }}
                      className={`text-xs rounded-md px-2 py-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 ${getStatusColor(pkg.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">

                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-xl"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(pkg)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageIcon size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {searchTerm ? 'No packages found' : 'No packages yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search' : 'Create your first package to get started'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-emerald-700 shadow-sm transition-all"
          >
            Create Your First Package
          </button>
        </div>
      )}

      {/* Package Form Modal */}
      {showForm && (
        <PackageForm
          initialData={editingPackage}
          onClose={() => {
            setShowForm(false);
            setEditingPackage(null);
          }}
          onSave={handleSavePackage}
        />
      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPackageToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Package?"
        message={`Are you sure you want to delete "${packageToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete Package"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </AgencyLayout>
  );
};

export default PackagesPage;