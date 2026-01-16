// Update RelatedPackages.jsx to use real data
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, MapPin, Calendar, Loader } from "lucide-react";
import { packageDetailService } from "../../services/packageDetailsService";

const RelatedPackages = ({ currentPackageId, category }) => {
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      fetchRelatedPackages();
    }
  }, [category, currentPackageId]);

  const fetchRelatedPackages = async () => {
    try {
      setLoading(true);
      const response = await packageDetailService.getRelatedPackages(category, currentPackageId);

      if (response.success) {
        setRelatedPackages(response.data);
      }
    } catch (error) {
      console.error("Error fetching related packages:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center py-8">
          <Loader className="animate-spin h-8 w-8 mx-auto text-blue-600" />
          <p className="text-gray-600 mt-2">Loading related packages...</p>
        </div>
      </section>
    );
  }

  if (!relatedPackages || relatedPackages.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      {/* ... rest of the component code remains similar, but use real data ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedPackages.map((pkg) => (
          <Link
            key={pkg.id}
            to={`/package/${pkg.id}`}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Use pkg.image, pkg.title, pkg.price, etc. from real data */}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPackages;