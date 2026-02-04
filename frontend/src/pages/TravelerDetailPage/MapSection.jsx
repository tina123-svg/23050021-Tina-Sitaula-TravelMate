import React from 'react';
import TrekkingMap from '../../components/TrekkingMap';

const MapSection = ({ route }) => {
  if (!route?.startPoint?.coordinates?.lat) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🗺️</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Route Map Not Available</h3>
        <p className="text-gray-600">
          This package doesn't have route coordinates yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🗺️</span>
          Trekking Route Map
        </h2>

        <TrekkingMap
          startPoint={route.startPoint}
          endPoint={route.endPoint}
          height="500px"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center mr-3">S</span>
            Start Point
          </h3>
          <p className="text-gray-700 text-lg font-medium">{route.startPoint.name}</p>
          <div className="mt-3 text-sm text-gray-500">
            <div className="flex items-center mb-1">
              <span className="w-20">Latitude:</span>
              <span className="font-mono">{route.startPoint.coordinates.lat}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20">Longitude:</span>
              <span className="font-mono">{route.startPoint.coordinates.lng}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center mr-3">E</span>
            End Point
          </h3>
          <p className="text-gray-700 text-lg font-medium">{route.endPoint.name}</p>
          <div className="mt-3 text-sm text-gray-500">
            <div className="flex items-center mb-1">
              <span className="w-20">Latitude:</span>
              <span className="font-mono">{route.endPoint.coordinates.lat}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20">Longitude:</span>
              <span className="font-mono">{route.endPoint.coordinates.lng}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-3">📝 Map Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="font-medium">Start Point</div>
              <div className="text-sm text-gray-600">Beginning of the trek</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
            <div>
              <div className="font-medium">End Point</div>
              <div className="text-sm text-gray-600">Destination</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
            <div>
              <div className="font-medium">Route Line</div>
              <div className="text-sm text-gray-600">Approximate path</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;