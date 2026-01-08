// pages/PackagesPage.jsx - UPDATED WITH WORKING SEARCH
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import FilterSidebar from "../../components/FilterSidebar";
import PackageGridEnhanced from "../../components/PackageGrid";
import MapView from "./MapView";
import SortDropdown from "../../components/SortDropdown";
import ActiveFilters from "../../components/ActiveFilters";
import CompareBar from "./CompareBar";
import { Grid, Map, Filter, Search } from "lucide-react";

// Dummy data  
const allPackages = [
  {
    id: 1,
    title: "Everest Base Camp Trek",
    description: "Journey to the base of the world's highest peak with experienced guides.",
    price: "120,000",
    rating: 4.9,
    reviews: 128,
    duration: 14,
    difficulty: "Challenging",
    category: "Trekking",
    destination: "Everest Region",
    coordinates: { lat: 27.9881, lng: 86.9250 },
    image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800",
    agency: "Himalayan Adventures",
    verified: true,
    featured: true
  },
  {
    id: 2,
    title: "Annapurna Circuit Trek",
    description: "Classic loop around Annapurna with diverse landscapes and local culture.",
    price: "85,000",
    rating: 4.8,
    reviews: 94,
    duration: 12,
    difficulty: "Moderate",
    category: "Trekking",
    destination: "Annapurna Region",
    coordinates: { lat: 28.3949, lng: 84.1240 },
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    agency: "Nepal Trekking Experts",
    verified: true,
    featured: true
  },
  {
    id: 3,
    title: "Pokhara Adventure Tour",
    description: "Paragliding, boating, and mountain views in Nepal's lake city.",
    price: "35,000",
    rating: 4.7,
    reviews: 210,
    duration: 5,
    difficulty: "Easy",
    category: "Adventure",
    destination: "Pokhara",
    coordinates: { lat: 28.2096, lng: 83.9856 },
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3e2ede5?w=800",
    agency: "Adventure Nepal",
    verified: true,
    featured: false
  },
  {
    id: 4,
    title: "Chitwan Jungle Safari",
    description: "Wildlife adventure spotting rhinos, tigers, and elephants.",
    price: "25,000",
    rating: 4.6,
    reviews: 156,
    duration: 3,
    difficulty: "Easy",
    category: "Safari",
    destination: "Chitwan",
    coordinates: { lat: 27.5000, lng: 84.3333 },
    image: "https://images.unsplash.com/photo-1526392587636-9a0e8a0e5c6a?w=800",
    agency: "Wild Nepal Tours",
    verified: false,
    featured: false
  },
  {
    id: 5,
    title: "Kathmandu Cultural Heritage Tour",
    description: "Explore ancient temples and UNESCO sites in the capital valley.",
    price: "18,000",
    rating: 4.8,
    reviews: 89,
    duration: 4,
    difficulty: "Easy",
    category: "Cultural",
    destination: "Kathmandu Valley",
    coordinates: { lat: 27.7172, lng: 85.3240 },
    image: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800",
    agency: "Heritage Nepal",
    verified: true,
    featured: false
  },
  {
    id: 6,
    title: "Langtang Valley Trekking Experience",
    description: "Peaceful trek with Tamang culture and Himalayan mountain views.",
    price: "55,000",
    rating: 4.9,
    reviews: 67,
    duration: 10,
    difficulty: "Moderate",
    category: "Trekking",
    destination: "Langtang Region",
    coordinates: { lat: 28.2000, lng: 85.5000 },
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    agency: "Mountain Guides Nepal",
    verified: true,
    featured: true
  },
  // Add more packages as needed
];

const categories = ["Trekking", "Safari", "Cultural", "Adventure", "Luxury", "Budget"];
const destinations = ["Kathmandu", "Pokhara", "Everest Region", "Annapurna Region", "Chitwan", "Langtang"];


export default function PackagesPage() {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "map"
  const [filters, setFilters] = useState({
    priceRange: [0, 200000],
    duration: [],
    categories: [],
    rating: 0,
    destinations: []
  });
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ADDED: Search state

  const packagesPerPage = 9;

  // Function to handle search
  const handleSearch = () => {
    // Reset to first page when searching
    setCurrentPage(1);
  };
  const handleCompareClick = () => {
    // Save packages to localStorage
    const selectedPackages = allPackages.filter(pkg =>
      compareList.includes(pkg.id)
    );
    localStorage.setItem('comparePackages', JSON.stringify(selectedPackages));

    // Navigate to compare page
    navigate('/compare');
  };
  // Filter packages based on selected filters AND search query
  const filteredPackages = allPackages.filter(pkg => {
    // Search query filter (NEW)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        pkg.title.toLowerCase().includes(query) ||
        pkg.destination.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query) ||
        pkg.agency.toLowerCase().includes(query) ||
        pkg.category.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Existing filters (keep as is)
    // Price filter
    const price = parseInt(pkg.price.replace(/,/g, ''));
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(pkg.category)) return false;

    // Rating filter
    if (filters.rating > 0 && pkg.rating < filters.rating) return false;

    // Destination filter
    if (filters.destinations.length > 0 && !filters.destinations.includes(pkg.destination)) return false;

    // Duration filter
    if (filters.duration.length > 0) {
      const duration = pkg.duration;
      if (filters.duration.includes("short") && duration > 7) return false;
      if (filters.duration.includes("medium") && (duration <= 7 || duration > 14)) return false;
      if (filters.duration.includes("long") && duration <= 14) return false;
    }

    return true;
  });

  // Sort packages (keep as is)
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''));
      case "price-high":
        return parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''));
      case "rating":
        return b.rating - a.rating;
      case "duration":
        return a.duration - b.duration;
      default: // popular
        return b.reviews - a.reviews;
    }
  });

  // Pagination (keep as is)
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = sortedPackages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(sortedPackages.length / packagesPerPage);

  // Handle compare (keep as is)
  const toggleCompare = (pkgId) => {
    if (compareList.includes(pkgId)) {
      setCompareList(compareList.filter(id => id !== pkgId));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, pkgId]);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 200000],
      duration: [],
      categories: [],
      rating: 0,
      destinations: []
    });
    setSearchQuery(""); // Also clear search
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Top Advanced Search Bar - UPDATED */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search packages, destinations, agencies, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full p-4 pl-12 rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              {/* REMOVED: Dates and Travelers buttons */}
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-medium"
              >
                Search
              </button>
            </div>

            {/* Search Results Info - ADDED */}
            <div className="mt-3 text-sm text-gray-600">
              {searchQuery ? (
                <span>
                  Found {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              ) : (
                <span>Showing {filteredPackages.length} packages</span>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          <div className="flex">
            {/* Filter Sidebar - Desktop */}
            <aside className={`hidden lg:block w-64 pr-6 ${showFilters ? '' : 'hidden'}`}>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                destinations={destinations}
                clearFilters={clearFilters}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar - UPDATED */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Discover Nepal's Best Travel Packages
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {sortedPackages.length} package{sortedPackages.length !== 1 ? 's' : ''} found
                    {filters.categories.length > 0 && ` in ${filters.categories.join(', ')}`}
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 bg-white border px-4 py-2 rounded-lg"
                  >
                    <Filter size={20} />
                    Filters
                  </button>

                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-2 rounded-md ${viewMode === "grid" ? "bg-white shadow" : ""}`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("map")}
                      className={`px-4 py-2 rounded-md ${viewMode === "map" ? "bg-white shadow" : ""}`}
                    >
                      <Map size={20} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                </div>
              </div>

              {/* Active Filters - UPDATED to include search */}
              <ActiveFilters
                filters={filters}
                setFilters={setFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              {/* Mobile Filter Sidebar */}
              {showFilters && (
                <div className="lg:hidden mb-6">
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                    destinations={destinations}
                    clearFilters={clearFilters}
                  />
                </div>
              )}

              {/* Content Area */}
              {viewMode === "grid" ? (
                <>
                  {sortedPackages.length > 0 ? (
                    <>
                      <PackageGridEnhanced
                        packages={currentPackages}
                        compareList={compareList}
                        toggleCompare={toggleCompare}
                      />

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-12">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                              Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => {
                              const pageNum = i + 1;
                              // Show limited page numbers
                              if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={i}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 border rounded-lg ${currentPage === pageNum
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'border-gray-300 hover:bg-gray-50'
                                      }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              } else if (
                                pageNum === currentPage - 2 ||
                                pageNum === currentPage + 2
                              ) {
                                return <span key={i} className="px-2 text-gray-400">...</span>;
                              }
                              return null;
                            })}

                            <button
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // No Results Found
                    <div className="text-center py-16">
                      <div className="text-gray-400 text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-gray-700 mb-3">
                        No packages found
                      </h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        {searchQuery
                          ? `No packages matching "${searchQuery}". Try different keywords.`
                          : "No packages match your filters. Try adjusting them."}
                      </p>
                      <button
                        onClick={clearFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
                      >
                        Clear Search & Filters
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <MapView packages={filteredPackages} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Compare Bar - UPDATED with search awareness */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleCompareClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            Compare {compareList.length} Packages
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}