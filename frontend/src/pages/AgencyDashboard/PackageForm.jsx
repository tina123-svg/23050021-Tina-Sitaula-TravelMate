// components/agency/PackageForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Calendar, Users, MapPin } from 'lucide-react';
import { packageService } from '../../services/packageService';

const PackageForm = ({ onClose, onSave, initialData = null }) => {
  // Helper to parse initial data
  const parseInitialData = () => {
    if (!initialData) return null;

    return {
      ...initialData,
      // Convert any JSON strings to arrays
      bestTimeToGo: Array.isArray(initialData.bestTimeToGo)
        ? initialData.bestTimeToGo
        : (typeof initialData.bestTimeToGo === 'string'
          ? JSON.parse(initialData.bestTimeToGo || '[]')
          : []),
      highlights: Array.isArray(initialData.highlights)
        ? initialData.highlights
        : (typeof initialData.highlights === 'string'
          ? JSON.parse(initialData.highlights || '[]')
          : ['']),
      included: Array.isArray(initialData.included)
        ? initialData.included
        : (typeof initialData.included === 'string'
          ? JSON.parse(initialData.included || '[]')
          : ['']),
      excluded: Array.isArray(initialData.excluded)
        ? initialData.excluded
        : (typeof initialData.excluded === 'string'
          ? JSON.parse(initialData.excluded || '[]')
          : ['']),
      whatToBring: Array.isArray(initialData.whatToBring)
        ? initialData.whatToBring
        : (typeof initialData.whatToBring === 'string'
          ? JSON.parse(initialData.whatToBring || '[]')
          : ['']),
      route: typeof initialData.route === 'string'
        ? JSON.parse(initialData.route || '{}')
        : initialData.route || {
          startPoint: { name: '', coordinates: { lat: '', lng: '' } },
          endPoint: { name: '', coordinates: { lat: '', lng: '' } }
        },
      itinerary: Array.isArray(initialData.itinerary) ? initialData.itinerary : [],
    };
  };

  const [formData, setFormData] = useState(parseInitialData() || {
    title: '',
    description: '',
    overview: '',
    price: '',
    duration: '',
    difficulty: 'moderate',
    destination: '',
    category: 'trekking',
    groupSize: { min: 2, max: 12 },
    bestTimeToGo: [],
    highlights: [''],
    included: [''],
    excluded: [''],
    itinerary: [],
    images: [],
    featured: false,
    physicalRequirements: '',
    whatToBring: [''],
    route: {
      startPoint: {
        name: '',
        coordinates: { lat: '', lng: '' }
      },
      endPoint: {
        name: '',
        coordinates: { lat: '', lng: '' }
      }
    }
  });

  const [currentItineraryDay, setCurrentItineraryDay] = useState({
    day: 1,
    title: '',
    description: '',
    icon: '🏔️',
    highlight: '',
    accommodation: '',
    meals: 'Breakfast, Lunch, Dinner',
    altitude: '',
    distance: '',
    tips: ''
  });

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'challenging', label: 'Challenging' },
    { value: 'strenuous', label: 'Strenuous' }
  ];

  const categories = [
    { value: 'trekking', label: 'Trekking' },
    { value: 'tour', label: 'Tour' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const bestTimes = [
    'Spring (Mar-May)',
    'Autumn (Sep-Nov)',
    'Summer (Jun-Aug)',
    'Winter (Dec-Feb)'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Array field handlers - SIMPLE now because we're using arrays!
  const handleArrayField = (field, index, value) => {
    setFormData(prev => {
      const currentArray = [...(prev[field] || [])];
      currentArray[index] = value;
      return { ...prev, [field]: currentArray };
    });
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    setCurrentItineraryDay(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItineraryDay = () => {
    if (!currentItineraryDay.title.trim() || !currentItineraryDay.description.trim()) {
      alert('Please fill day title and description');
      return;
    }

    setFormData(prev => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), { ...currentItineraryDay }]
    }));

    // Reset for next day
    setCurrentItineraryDay({
      day: currentItineraryDay.day + 1,
      title: '',
      description: '',
      icon: '🏔️',
      highlight: '',
      accommodation: '',
      meals: 'Breakfast, Lunch, Dinner',
      altitude: '',
      distance: '',
      tips: ''
    });
  };

  const removeItineraryDay = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    // Re-number days
    const renumberedItinerary = newItinerary.map((day, idx) => ({
      ...day,
      day: idx + 1
    }));

    setFormData(prev => ({
      ...prev,
      itinerary: renumberedItinerary
    }));

    if (currentItineraryDay.day > 1) {
      setCurrentItineraryDay(prev => ({
        ...prev,
        day: prev.day - 1
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Fields to send (all will be stringified when needed)
    const fieldsToSend = [
      'title', 'description', 'overview', 'price', 'duration',
      'difficulty', 'destination', 'category', 'groupSize',
      'bestTimeToGo', 'highlights', 'included', 'excluded',
      'itinerary', 'whatToBring', 'route', 'physicalRequirements',
      'featured', 'status'
    ];

    fieldsToSend.forEach(key => {
      if (formData[key] !== undefined) {
        // Always stringify objects/arrays, keep primitives as is
        const value = typeof formData[key] === 'object'
          ? JSON.stringify(formData[key])
          : formData[key];
        formDataToSend.append(key, value);
      }
    });

    // Add images separately
    formData.images?.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      const response = initialData
        ? await packageService.updatePackage(initialData._id, formDataToSend)
        : await packageService.createPackage(formDataToSend);

      if (response.success) {
        onSave(response.data);
        onClose();
      }
    } catch (err) {
      console.error("Package save error:", err);
      alert("Failed to save package: " + (err.response?.data?.message || err.message));
    }
  };

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...files]
    }));
  };

  // Best Time to Go checkbox handler
  const handleBestTimeToggle = (time) => {
    setFormData(prev => {
      const current = prev.bestTimeToGo || [];
      const newArray = current.includes(time)
        ? current.filter(t => t !== time)
        : [...current, time];
      return { ...prev, bestTimeToGo: newArray };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? 'Edit Package' : 'Create New Package'}
            </h2>
            <p className="text-gray-600">Fill in all required details for your travel package</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Package Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Everest Base Camp Trek - 14 Days"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description that appears on package cards"
                  required
                />
              </div>

              {/* Overview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Overview *
                </label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Detailed description of the adventure"
                  required
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (NPR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">NPR</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="25000"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="14"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Destination & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Everest Region, Nepal"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {difficulties.map(diff => (
                    <label
                      key={diff.value}
                      className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${formData.difficulty === diff.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={diff.value}
                        checked={formData.difficulty === diff.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {diff.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Details */}
            <div className="space-y-6">
              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Size
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={formData.groupSize.min}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          groupSize: { ...prev.groupSize, min: Number(e.target.value) }
                        }))}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={formData.groupSize.max}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        groupSize: { ...prev.groupSize, max: Number(e.target.value) }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      min={formData.groupSize.min}
                    />
                  </div>
                </div>
              </div>

              {/* Best Time to Go - SIMPLIFIED */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Time to Go
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bestTimes.map((time) => (
                    <label
                      key={time}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.bestTimeToGo?.includes(time)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.bestTimeToGo?.includes(time) || false}
                        onChange={() => handleBestTimeToggle(time)}
                        className="mr-3"
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>

              {/* Route Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline mr-2" size={16} />
                  Trek Route Points
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Point */}
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-2">S</span>
                      Start Point
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Location Name</label>
                        <input
                          type="text"
                          value={formData.route?.startPoint?.name || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            route: {
                              ...prev.route,
                              startPoint: {
                                ...prev.route?.startPoint,
                                name: e.target.value
                              }
                            }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="e.g., Lukla Airport"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            value={formData.route?.startPoint?.coordinates?.lat || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              route: {
                                ...prev.route,
                                startPoint: {
                                  ...prev.route?.startPoint,
                                  coordinates: {
                                    ...prev.route?.startPoint?.coordinates,
                                    lat: e.target.value
                                  }
                                }
                              }
                            }))}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="27.687"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            value={formData.route?.startPoint?.coordinates?.lng || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              route: {
                                ...prev.route,
                                startPoint: {
                                  ...prev.route?.startPoint,
                                  coordinates: {
                                    ...prev.route?.startPoint?.coordinates,
                                    lng: e.target.value
                                  }
                                }
                              }
                            }))}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="86.731"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* End Point */}
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center mr-2">E</span>
                      End Point
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Location Name</label>
                        <input
                          type="text"
                          value={formData.route?.endPoint?.name || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            route: {
                              ...prev.route,
                              endPoint: {
                                ...prev.route?.endPoint,
                                name: e.target.value
                              }
                            }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="e.g., Everest Base Camp"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            value={formData.route?.endPoint?.coordinates?.lat || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              route: {
                                ...prev.route,
                                endPoint: {
                                  ...prev.route?.endPoint,
                                  coordinates: {
                                    ...prev.route?.endPoint?.coordinates,
                                    lat: e.target.value
                                  }
                                }
                              }
                            }))}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="27.9881"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            value={formData.route?.endPoint?.coordinates?.lng || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              route: {
                                ...prev.route,
                                endPoint: {
                                  ...prev.route?.endPoint,
                                  coordinates: {
                                    ...prev.route?.endPoint?.coordinates,
                                    lng: e.target.value
                                  }
                                }
                              }
                            }))}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="86.9250"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Images (up to 10)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={40} className="text-gray-400 mb-2" />
                    <span className="text-blue-600 font-medium">Click to upload images</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, max 5MB each</span>
                  </label>
                </div>

                {/* Preview */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${idx}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Highlights - SIMPLIFIED */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Highlights
                </label>
                {(formData.highlights || []).map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayField('highlights', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      placeholder="e.g., Sunrise view from Kala Patthar"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('highlights', index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('highlights')}
                  className="mt-2 flex items-center text-green-600 hover:text-green-800"
                >
                  <Plus size={20} className="mr-2" />
                  Add Highlight
                </button>
              </div>

              {/* Featured Package */}
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-600 rounded"
                />
                <label htmlFor="featured" className="ml-3 text-gray-700">
                  Mark as Featured Package
                </label>
                <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full">
                  ✨ Featured
                </span>
              </div>
            </div>
          </div>

          {/* Itinerary Section */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Itinerary</h3>

            {/* Existing Itinerary Days */}
            {(formData.itinerary || []).map((day, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-blue-700">Day {day.day}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{day.title}</h4>
                      <p className="text-sm text-gray-600">{day.highlight}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Day Form */}
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl">
              <h4 className="font-bold text-gray-700 mb-4">Add Day {currentItineraryDay.day}</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentItineraryDay.title}
                    onChange={handleItineraryChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., Arrival in Kathmandu"

                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highlight *
                  </label>
                  <input
                    type="text"
                    name="highlight"
                    value={currentItineraryDay.highlight}
                    onChange={handleItineraryChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., Hotel check-in and welcome dinner"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={currentItineraryDay.description}
                    onChange={handleItineraryChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Detailed description of the day's activities"

                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addItineraryDay}
                className="mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Day {currentItineraryDay.day} to Itinerary
              </button>
            </div>
          </div>

          {/* Included/Excluded - SIMPLIFIED */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Included */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included</h3>
              {(formData.included || []).map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayField('included', index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., All meals during trek"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('included', index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('included')}
                className="mt-2 flex items-center text-green-600 hover:text-green-800"
              >
                <Plus size={20} className="mr-2" />
                Add Included Item
              </button>
            </div>

            {/* Excluded - SIMPLIFIED */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">What's Excluded</h3>
              {(formData.excluded || []).map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayField('excluded', index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., International flights"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('excluded', index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('excluded')}
                className="mt-2 flex items-center text-green-600 hover:text-green-800"
              >
                <Plus size={20} className="mr-2" />
                Add Excluded Item
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-12 pt-8 border-t flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
            >
              {initialData ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageForm;