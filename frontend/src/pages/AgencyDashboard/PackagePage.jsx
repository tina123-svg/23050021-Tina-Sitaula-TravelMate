// pages/agency/PackagesPage.jsx
import React, { useState } from 'react';
import AgencyLayout from '../../layout/Agencylayout';
import PackageForm from './PackageForm';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Star } from 'lucide-react';

const PackagesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock packages data
  const [packages, setPackages] = useState([
    {
      id: 1,
      title: 'Everest Base Camp Trek - 14 Days',
      price: '25,000',
      duration: 14,
      difficulty: 'challenging',
      destination: 'Everest Region',
      category: 'trekking',
      rating: 4.8,
      reviews: 42,
      status: 'active',
      bookings: 12,
      featured: true
    },
    {
      id: 2,
      title: 'Pokhara Lakeside Tour - 5 Days',
      price: '12,000',
      duration: 5,
      difficulty: 'easy',
      destination: 'Pokhara',
      category: 'tour',
      rating: 4.5,
      reviews: 28,
      status: 'active',
      bookings: 8,
      featured: false
    }
  ]);

  const handleSavePackage = (packageData) => {
    if (editingPackage) {
      // Update existing package
      setPackages(prev => prev.map(pkg =>
        pkg.id === editingPackage.id
          ? { ...pkg, ...packageData, id: pkg.id }
          : pkg
      ));
    } else {
      // Add new package
      const newPackage = {
        ...packageData,
        id: packages.length + 1,
        rating: 0,
        reviews: 0,
        bookings: 0,
        status: 'active'
      };
      setPackages(prev => [newPackage, ...prev]);
    }

    setShowForm(false);
    setEditingPackage(null);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
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

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Packages</h1>
          <p className="text-gray-600">Create and manage your travel packages</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add New Package
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search packages by title, destination, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={20} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Package</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Destination</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Duration</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Bookings</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPackages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                      <div>
                        <div className="font-medium text-gray-800 flex items-center">
                          {pkg.title}
                          {pkg.featured && (
                            <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full">
                              ✨
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {pkg.rating} ({pkg.reviews} reviews)
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
                    <div className="font-bold text-gray-800">NPR {pkg.price}</div>
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
                    <div className="font-medium text-gray-800">{pkg.bookings}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <MoreVertical size={18} />
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
            <Package size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No packages found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or create your first package</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
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
    </AgencyLayout>
  );
};

export default PackagesPage;