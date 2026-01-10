// components/agency/PackageForm.jsx
import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, Calendar, Users, MapPin } from 'lucide-react';

const PackageForm = ({ onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
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
    whatToBring: ['']
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

  const handleArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
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
      itinerary: [...prev.itinerary, { ...currentItineraryDay }]
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.title || !formData.description || !formData.price || !formData.duration) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.itinerary.length === 0) {
      alert('Please add at least one itinerary day');
      return;
    }

    onSave(formData);
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
                  minLength="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min. 100 characters: {formData.description.length}/100
                </p>
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
                          groupSize: { ...prev.groupSize, min: e.target.value }
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
                        groupSize: { ...prev.groupSize, max: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      min={formData.groupSize.min}
                    />
                  </div>
                </div>
              </div>

              {/* Best Time to Go */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Time to Go
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bestTimes.map(time => (
                    <label
                      key={time}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.bestTimeToGo.includes(time)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.bestTimeToGo.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              bestTimeToGo: [...prev.bestTimeToGo, time]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              bestTimeToGo: prev.bestTimeToGo.filter(t => t !== time)
                            }));
                          }
                        }}
                        className="mr-3"
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Highlights
                </label>
                {formData.highlights.map((highlight, index) => (
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
            {formData.itinerary.map((day, index) => (
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
                    required
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
                    required
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

          {/* Included/Excluded */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Included */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included</h3>
              {formData.included.map((item, index) => (
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

            {/* Excluded */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">What's Excluded</h3>
              {formData.excluded.map((item, index) => (
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