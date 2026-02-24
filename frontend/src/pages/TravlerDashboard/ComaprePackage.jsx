import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { X, Check, Star, MapPin, Calendar, Users, DollarSign, Loader, Package, Building } from "lucide-react";

const ComparePage = () => {
  const navigate = useNavigate();
  const [packagesToCompare, setPackagesToCompare] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get packages from localStorage
    try {
      const storedPackages = JSON.parse(localStorage.getItem('comparePackages') || '[]');

      // Validate packages
      const enhancedPackages = storedPackages
        .filter(pkg => pkg && pkg.id && pkg.title)
        .map(pkg => ({
          ...pkg,
          // Ensure rating is properly handled
          rating: typeof pkg.rating === 'object' ? pkg.rating?.average || 0 : pkg.rating || 0,
          // Ensure reviews count
          reviews: typeof pkg.rating === 'object' ? pkg.rating?.count || 0 : pkg.reviews || 0,
          // Handle agency 
          agency: pkg.agencyDetails?.name || pkg.agency?.name || pkg.agency || "Unknown Agency",
          // Handle included/excluded
          included: pkg.included || pkg.inclusions || [],
          excluded: pkg.excluded || pkg.exclusions || []
        }));

      console.log("Enhanced packages for comparison:", enhancedPackages);
      setPackagesToCompare(enhancedPackages);

      // Update localStorage with enhanced packages
      if (enhancedPackages.length > 0) {
        localStorage.setItem('comparePackages', JSON.stringify(enhancedPackages));
      }
    } catch (error) {
      console.error("Error loading compare packages:", error);
      setPackagesToCompare([]);
      localStorage.removeItem('comparePackages');
    } finally {
      setLoading(false);
    }
  }, []);

  const removePackage = (id) => {
    const updated = packagesToCompare.filter(pkg => pkg.id !== id);
    setPackagesToCompare(updated);
    localStorage.setItem('comparePackages', JSON.stringify(updated));
  };

  const addPackage = () => {
    navigate('/package');
  };

  const comparisonFields = [
    { key: "price", label: "Price", icon: DollarSign, type: "price" },
    { key: "duration", label: "Duration", icon: Calendar, type: "number" },
    { key: "rating", label: "Rating", icon: Star, type: "rating" },
    { key: "reviews", label: "Reviews", icon: Users, type: "number" },
    { key: "difficulty", label: "Difficulty", type: "text" },
    { key: "destination", label: "Destination", icon: MapPin, type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "agency", label: "Agency", icon: Building, type: "agency" },
    { key: "included", label: "What's Included", type: "included" },
    { key: "excluded", label: "Not Included", type: "excluded" }
  ];

  const renderFieldValue = (pkg, field) => {
    // Get value with fallback
    let value = pkg[field.key];

    // Special handling for agency
    if (field.key === "agency" && !value) {
      value = pkg.agencyDetails?.name || pkg.agency?.name || pkg.agency || "Unknown Agency";
    }

    // Special handling for included/excluded
    if (field.key === "included" && !value) {
      value = pkg.inclusions || [];
    }

    if (field.key === "excluded" && !value) {
      value = pkg.exclusions || [];
    }

    // Handle empty values
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      return <div className="text-gray-400 text-sm italic">Not specified</div>;
    }

    switch (field.type) {
      case "price": {
        const price = typeof value === 'number' ? value : parseInt(value?.toString().replace?.(/,/g, '') || 0);
        return (
          <div className="font-bold text-lg text-blue-700">
            NPR {price.toLocaleString()}
          </div>
        );
      }

      case "rating": {
        const ratingValue = typeof value === 'object' ? value?.average || 0 : parseFloat(value) || 0;
        return (
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(ratingValue) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 font-bold">{ratingValue.toFixed(1)}</span>
          </div>
        );
      }

      case "agency": {
        return (
          <div className="flex items-center text-gray-800">
            <Building className="mr-2 text-gray-500" size={16} />
            <span>{value}</span>
          </div>
        );
      }

      case "included": {
        const items = Array.isArray(value) ? value : [value];
        if (items.length === 0 || (items.length === 1 && !items[0])) {
          return <div className="text-gray-400 text-sm italic">Not specified</div>;
        }

        return (
          <ul className="space-y-1">
            {items.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={14} />
                <span className="line-clamp-2">{item}</span>
              </li>
            ))}
            {items.length > 3 && (
              <li className="text-xs text-gray-500 mt-1">+{items.length - 3} more</li>
            )}
          </ul>
        );
      }

      case "excluded": {
        const items = Array.isArray(value) ? value : [value];
        if (items.length === 0 || (items.length === 1 && !items[0])) {
          return <div className="text-gray-400 text-sm italic">Not specified</div>;
        }

        return (
          <ul className="space-y-1">
            {items.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <X className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={14} />
                <span className="line-clamp-2">{item}</span>
              </li>
            ))}
            {items.length > 3 && (
              <li className="text-xs text-gray-500 mt-1">+{items.length - 3} more</li>
            )}
          </ul>
        );
      }

      case "number": {
        return <div className="font-medium text-gray-800">{value.toLocaleString()}</div>;
      }

      default:
        return <div className="text-gray-800">{value}</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Loader className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading comparison...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (packagesToCompare.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No packages to compare</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Select packages to compare from the packages page. You can compare up to 3 packages at once.
            </p>
            <button
              onClick={() => navigate('/package')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
            >
              Browse Packages
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Compare Packages ({packagesToCompare.length}/3)
              </h1>
              <p className="text-gray-600">
                Side-by-side comparison to help you choose the best package
              </p>
            </div>
            <button
              onClick={() => navigate('/package')}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              ← Back to Packages
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          {/* Package Headers */}
          <div className={`grid border-b ${packagesToCompare.length === 3 ? 'grid-cols-4' : 'grid-cols-5'}`}>
            <div className="p-6 border-r bg-gray-50">
              <h3 className="font-bold text-gray-700 mb-4">Features</h3>
            </div>

            {packagesToCompare.map((pkg) => (
              <div key={pkg.id} className="p-6 relative border-r">
                <button
                  onClick={() => removePackage(pkg.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  title="Remove from comparison"
                >
                  <X size={18} />
                </button>
                <div className="h-40 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src={pkg.image || pkg.images?.[0] || "/assets/images/default-package.jpg"}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/images/default-package.jpg";
                    }}
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 h-14">
                  {pkg.title}
                </h3>
                <div className="flex items-center mb-2">
                  <Star className="fill-yellow-400 text-yellow-400 mr-1" size={16} />
                  <span className="font-bold">
                    {typeof pkg.rating === 'object' ? pkg.rating?.average?.toFixed(1) || "5.0" : parseFloat(pkg.rating).toFixed(1) || "5.0"}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({typeof pkg.rating === 'object' ? pkg.rating?.count || 0 : pkg.reviews || 0} reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <Building className="inline mr-1" size={14} />
                  {pkg.agencyDetails?.name || pkg.agency?.name || pkg.agency || "Unknown Agency"}
                </div>
                <button
                  onClick={() => navigate(`/package/${pkg.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
                >
                  View Details
                </button>
              </div>
            ))}

            {/* Add Package Column */}
            {packagesToCompare.length < 3 && (
              <div className="p-6 text-center border-r">
                <div
                  onClick={addPackage}
                  className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <span className="text-gray-600 font-medium">Add Package</span>
                  <span className="text-sm text-gray-400 mt-1">
                    {3 - packagesToCompare.length} more
                  </span>
                </div>
                <button
                  onClick={addPackage}
                  className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 px-6 rounded-lg font-medium transition-colors"
                >
                  Add Package
                </button>
              </div>
            )}
          </div>

          {/* Comparison Rows */}
          {comparisonFields.map((field) => (
            <div key={field.key} className={`grid border-b hover:bg-gray-50 ${packagesToCompare.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
              }`}>
              <div className="p-4 border-r flex items-center">
                <div className="flex items-center">
                  {field.icon && <field.icon className="text-gray-500 mr-2" size={18} />}
                  <span className="font-medium text-gray-700">{field.label}</span>
                </div>
              </div>

              {packagesToCompare.map((pkg) => (
                <div key={`${pkg.id}-${field.key}`} className="p-4 border-r">
                  {renderFieldValue(pkg, field)}
                </div>
              ))}

              {/* Empty column for add package */}
              {packagesToCompare.length < 3 && (
                <div className="p-4 border-r text-gray-300 flex items-center justify-center">
                  -
                </div>
              )}
            </div>
          ))}

          {/* Final Decision Row */}
          <div className={`grid ${packagesToCompare.length === 3 ? 'grid-cols-4' : 'grid-cols-5'}`}>
            <div className="p-4 border-r font-medium text-gray-700 flex items-center">
              Select Your Choice
            </div>
            {packagesToCompare.map((pkg) => (
              <div key={`choice-${pkg.id}`} className="p-4 border-r">
                <button
                  onClick={() => navigate(`/package/${pkg.id}`)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg"
                >
                  Select This Package
                </button>
              </div>
            ))}
            {packagesToCompare.length < 3 && (
              <div className="p-4"></div>
            )}
          </div>
        </div>

        {/* Comparison Tips */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Comparison Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Price vs Value</h4>
              <p className="text-sm text-gray-600">
                Compare what's included in the price. A higher price might include more services, better accommodation, or expert guides.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Check Reviews</h4>
              <p className="text-sm text-gray-600">
                Look at recent reviews and photos from actual travelers. Higher ratings with more reviews are more reliable.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Agency Reputation</h4>
              <p className="text-sm text-gray-600">
                Verified agencies with experience and proper licenses are more reliable and provide better support.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Flexibility</h4>
              <p className="text-sm text-gray-600">
                Consider cancellation policies, date flexibility, and customizations offered by the agency.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Comparison */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('comparePackages');
              navigate('/package');
            }}
            className="text-gray-600 hover:text-gray-800 underline text-sm"
          >
            Clear all comparisons and start over
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComparePage;