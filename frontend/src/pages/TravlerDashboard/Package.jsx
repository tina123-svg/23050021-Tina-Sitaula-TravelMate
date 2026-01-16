import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import FilterSidebar from "../../components/FilterSidebar";
import PackageCardEnhanced from "./PackageCard";
import SortDropdown from "../../components/SortDropdown";
import ActiveFilters from "../../components/ActiveFilters";
import { Grid, Map, Filter, Search, Loader, X } from "lucide-react";
import { travelerService } from "../../services/travelerService";

export default function PackagesPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    priceRange: [0, 200000],
    categories: [],
    destinations: [],
    difficulty: "",
    rating: 0,
  });
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [totalPackages, setTotalPackages] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const navigate = useNavigate();
  const packagesPerPage = 9;

  // Fetch packages and filter options
  useEffect(() => {
    fetchPackages();
    fetchFilterOptions();
  }, [filters, searchQuery, sortBy, currentPage]);

  const fetchFilterOptions = async () => {
    try {
      // Get unique categories and destinations from packages
      const response = await travelerService.getAllPackages({ limit: 100 });
      if (response.success && response.filters) {
        setCategories(response.filters.categories || []);
        setDestinations(response.filters.destinations || []);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = {
        page: currentPage,
        limit: packagesPerPage,
      };

      // Add search query
      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      // Add category filter
      if (filters.categories.length > 0) {
        params.category = filters.categories.join(',');
      }

      // Add destination filter
      if (filters.destinations.length > 0) {
        params.destination = filters.destinations.join(',');
      }

      // Add price range
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }

      // Add difficulty filter
      if (filters.difficulty) {
        params.difficulty = filters.difficulty;
      }

      // Add rating filter
      if (filters.rating > 0) {
        params.minRating = filters.rating;
      }

      // Add sorting - FIXED: Actually use sortParam
      let sortParam = "";
      switch (sortBy) {
        case "price-low":
          sortParam = "price";
          break;
        case "price-high":
          sortParam = "-price";
          break;
        case "rating":
          sortParam = "-rating";
          break;
        default:
          sortParam = "-createdAt";
      }

      // Add sort to params
      params.sort = sortParam; // THIS LINE WAS MISSING

      const response = await travelerService.getAllPackages(params);

      if (response.success) {
        setPackages(response.data || []);
        setTotalPackages(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
      setTotalPackages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPackages();
  };

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
      categories: [],
      destinations: [],
      difficulty: "",
      rating: 0,
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  // const handleCompareClick = () => {



  //   const selectedPackages = packages.filter(pkg => compareList.includes(pkg.id));
  //   localStorage.setItem('comparePackages', JSON.stringify(selectedPackages));
  //   navigate('/compare');
  // };

  // In PackagesPage.jsx - Update the handleCompareClick function:
  const handleCompareClick = async () => {
    const selectedPackages = packages.filter(pkg => compareList.includes(pkg.id));

    if (selectedPackages.length === 0) {
      alert("Please select at least one package to compare");
      return;
    }

    try {
      // Fetch full details for each selected package
      const fullPackageDetails = await Promise.all(
        selectedPackages.map(async (pkg) => {
          try {
            const response = await travelerService.getPackageDetails(pkg.id);
            if (response.success) {
              return {
                ...response.data,
                // Ensure all required fields are present
                rating: response.data.rating || { average: 5, count: 0 },
                agency: response.data.agencyDetails?.name || response.data.agency,
                included: response.data.included || response.data.inclusions || [],
                excluded: response.data.excluded || response.data.exclusions || []
              };
            }
          } catch (error) {
            console.error(`Error fetching details for package ${pkg.id}:`, error);
          }
          return pkg;
        })
      );

      // Filter out any null/undefined results
      const validPackages = fullPackageDetails.filter(pkg => pkg);

      if (validPackages.length > 0) {
        localStorage.setItem('comparePackages', JSON.stringify(validPackages));
        navigate('/compare');
      } else {
        alert("Unable to fetch package details. Please try again.");
      }
    } catch (error) {
      console.error("Error preparing packages for comparison:", error);
      // Fallback: save basic package info
      localStorage.setItem('comparePackages', JSON.stringify(selectedPackages));
      navigate('/compare');
    }
  };


  const handlePackageClick = (id) => {
    navigate(`/package/${id}`);
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 border rounded-lg ${currentPage === i
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 hover:bg-gray-50'
            }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (loading && packages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading packages...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Search Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search packages, destinations, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full p-4 pl-12 rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-medium"
              >
                Search
              </button>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              {searchQuery ? (
                <span>
                  Found {totalPackages} package{totalPackages !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              ) : (
                <span>Showing {totalPackages} packages</span>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          <div className="flex">
            {/* Filter Sidebar */}
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
              {/* Top Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Discover Nepal's Best Travel Packages
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {totalPackages} package{totalPackages !== 1 ? 's' : ''} found
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
                      disabled
                      className={`px-4 py-2 rounded-md ${viewMode === "map" ? "bg-white shadow" : ""} opacity-50 cursor-not-allowed`}
                      title="Map view coming soon"
                    >
                      <Map size={20} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                </div>
              </div>

              {/* Active Filters */}
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
              {viewMode === "grid" && (
                <>
                  {/* Compare Info */}
                  {compareList.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Search className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">
                              {compareList.length} package{compareList.length > 1 ? 's' : ''} selected for comparison
                            </span>
                            <p className="text-sm text-blue-600 mt-1">
                              Select up to 3 packages to compare features and prices
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleCompareClick}
                          disabled={compareList.length < 2}
                          className={`px-4 py-2 rounded-lg font-medium ${compareList.length >= 2
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          Compare Now
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Package Grid */}
                  {packages.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                          <PackageCardEnhanced
                            key={pkg.id}
                            pkg={pkg}
                            isComparing={compareList.includes(pkg.id)}
                            onCompareToggle={() => toggleCompare(pkg.id)}
                            onViewDetails={() => handlePackageClick(pkg.id)}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-12">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <X size={16} className="rotate-90" />
                              Previous
                            </button>

                            {renderPagination()}

                            <button
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 flex items-center gap-2"
                            >
                              Next
                              <X size={16} className="-rotate-90" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
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
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Compare Bar - Mobile */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <button
            onClick={handleCompareClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            Compare {compareList.length}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}