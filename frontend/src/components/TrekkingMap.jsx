import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const TrekkingMap = ({ startPoint, endPoint }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const lineRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers + line when coordinates change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear previous markers and line
    markersRef.current.forEach(marker => {
      if (marker) mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    if (lineRef.current) {
      mapInstance.current.removeLayer(lineRef.current);
      lineRef.current = null;
    }

    const start = startPoint?.coordinates;
    const end = endPoint?.coordinates;

    // If no valid coordinates, show Nepal overview
    if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
      mapInstance.current.setView([27.7172, 85.3240], 7);
      return;
    }

    // Parse coordinates - ensure they are numbers
    const startLat = parseFloat(start.lat);
    const startLng = parseFloat(start.lng);
    const endLat = parseFloat(end.lat);
    const endLng = parseFloat(end.lng);

    // Create markers
    const startMarker = L.marker([startLat, startLng], {
      icon: L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="#10B981" stroke-width="2">
            <circle cx="12" cy="12" r="10" fill="#10B981" opacity="0.2"/>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })
    }).addTo(mapInstance.current);

    const endMarker = L.marker([endLat, endLng], {
      icon: L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="#EF4444" stroke-width="2">
            <circle cx="12" cy="12" r="10" fill="#EF4444" opacity="0.2"/>
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })
    }).addTo(mapInstance.current);

    markersRef.current = [startMarker, endMarker];

    // Create popups
    const startName = startPoint.name || 'Start Point';
    const endName = endPoint.name || 'End Point';

    startMarker.bindPopup(`
      <div class="font-medium text-gray-800">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span class="font-semibold">Start: ${startName}</span>
        </div>
        <div class="text-sm text-gray-600">
          ${startLat.toFixed(4)}°, ${startLng.toFixed(4)}°
        </div>
      </div>
    `);

    endMarker.bindPopup(`
      <div class="font-medium text-gray-800">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <span class="font-semibold">End: ${endName}</span>
        </div>
        <div class="text-sm text-gray-600">
          ${endLat.toFixed(4)}°, ${endLng.toFixed(4)}°
        </div>
      </div>
    `);

    // Create a straight line between points
    const line = L.polyline([[startLat, startLng], [endLat, endLng]], {
      color: '#3B82F6',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8',
      lineCap: 'round',
    }).addTo(mapInstance.current);

    lineRef.current = line;

    // Calculate bounds to fit both points
    const bounds = L.latLngBounds(
      [startLat, startLng],
      [endLat, endLng]
    );

    // Add some padding to the bounds
    mapInstance.current.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15
    });

    // Open start popup by default
    startMarker.openPopup();

  }, [startPoint, endPoint]);

  // Placeholder when no coordinates
  if (!startPoint?.coordinates?.lat || !endPoint?.coordinates?.lat) {
    return (
      <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 border border-gray-200">
        <div className="text-6xl mb-4 animate-pulse">🗺️</div>
        <p className="text-lg font-medium">Route Map</p>
        <p className="text-sm mt-2 text-center px-8">
          {startPoint?.coordinates?.lat || endPoint?.coordinates?.lat
            ? "Add both start and end coordinates to see the map"
            : "Enter valid start and end coordinates"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      <div ref={mapRef} className="h-[500px] w-full" />

      {/* Info panel at bottom */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg z-[1000]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Start: {startPoint.name || 'Start Point'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">End: {endPoint.name || 'End Point'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-8 bg-blue-500/80 rounded" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, white 50%)', backgroundSize: '8px 4px' }}></div>
            <span className="text-sm text-gray-600">Direct route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrekkingMap;