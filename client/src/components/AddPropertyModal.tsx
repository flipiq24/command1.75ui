import React, { useState } from 'react';
import { X, Search, Trash2 } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    mlsNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    latitude: '',
    longitude: '',
    bed: '',
    bath: '',
    garageSpaces: '',
    poolDescription: '',
    sqft: '',
    yearBuilt: '',
    type: '',
    lotSize: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setFormData({
      mlsNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      price: '',
      latitude: '',
      longitude: '',
      bed: '',
      bath: '',
      garageSpaces: '',
      poolDescription: '',
      sqft: '',
      yearBuilt: '',
      type: '',
      lotSize: ''
    });
  };

  const handleSearchMLS = () => {
    console.log('Searching MLS:', formData.mlsNumber);
  };

  const handleSearchProperty = () => {
    console.log('Searching property:', formData.address);
  };

  const handleAddProperty = () => {
    console.log('Adding property:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Property</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-8">
            {/* Left Column - Search by MLS */}
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Search by MLS</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MLS # <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter MLS #"
                    value={formData.mlsNumber}
                    onChange={(e) => handleInputChange('mlsNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={handleSearchMLS}
                  className="w-full px-4 py-2 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-medium rounded-lg transition"
                >
                  Search MLS
                </button>
              </div>
            </div>

            {/* Right Column - Property Details */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4">
                {/* Address - Full Width */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1234 Main St"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>

                {/* City, State, ZIP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Anytown"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CA"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 90210"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>

                {/* Price, Latitude, Longitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    placeholder="e.g., 210,000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    placeholder="e.g., 34.0522"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    placeholder="e.g., -118.2437"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>

                {/* Bed, Bath, Garage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bed</label>
                  <input
                    type="text"
                    placeholder="e.g., 3"
                    value={formData.bed}
                    onChange={(e) => handleInputChange('bed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bath</label>
                  <input
                    type="text"
                    placeholder="e.g., 2"
                    value={formData.bath}
                    onChange={(e) => handleInputChange('bath', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garage Spaces</label>
                  <input
                    type="text"
                    placeholder="e.g., 2"
                    value={formData.garageSpaces}
                    onChange={(e) => handleInputChange('garageSpaces', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>

                {/* Pool, Sqft, Year Built */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pool Description</label>
                  <input
                    type="text"
                    placeholder="e.g., In Ground"
                    value={formData.poolDescription}
                    onChange={(e) => handleInputChange('poolDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1,800"
                    value={formData.sqft}
                    onChange={(e) => handleInputChange('sqft', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1998"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>

                {/* Type, Lot Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Single Family"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lot Size (sqft)</label>
                  <input
                    type="text"
                    placeholder="e.g., 10800"
                    value={formData.lotSize}
                    onChange={(e) => handleInputChange('lotSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear and Search Property buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button 
                  onClick={handleClear}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
                <button 
                  onClick={handleSearchProperty}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-medium rounded-lg transition"
                >
                  <Search className="w-4 h-4" />
                  Search Property
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddProperty}
            className="px-6 py-2 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-medium rounded-lg transition"
          >
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
}
