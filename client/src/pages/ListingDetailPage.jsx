import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiMessageSquare, FiTrendingUp, FiUsers } from "react-icons/fi";
import { getListingById } from "../api/listings";
import demoListings from "../utils/demoListings";

function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const similarListings = useMemo(() => {
    if (!listing) return [];
    return demoListings.filter((item) => item.platform === listing.platform && item.id !== listing.id).slice(0, 2);
  }, [listing]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        const fallback = demoListings.find((item) => String(item.id) === String(id));
        if (fallback) setListing(fallback);
        else setError(err.response?.data?.message || "Listing not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Loading listing details...</p>;
  if (error || !listing) return <p className="text-red-600">{error || "Listing not found"}</p>;

  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-cardBorder p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm text-textSecondary">{listing.platform}</p>
            <h1 className="text-3xl font-bold text-textPrimary">{listing.title}</h1>
            <p className="mt-1 text-textSecondary">@{listing.handle}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-textSecondary">
              <span className="inline-flex items-center gap-1"><FiUsers /> {Number(listing.followers_count).toLocaleString()} followers</span>
              <span className="inline-flex items-center gap-1"><FiTrendingUp /> {listing.engagement_rate}% engagement</span>
              <span className="rounded-full bg-gray-100 px-2 py-1">{listing.category}</span>
              <span className="rounded-full bg-gray-100 px-2 py-1">{listing.country}</span>
            </div>
          </div>
          <div className="min-w-[220px] rounded-lg border border-cardBorder p-4">
            <p className="text-3xl font-extrabold">${Number(listing.price_usd).toLocaleString()}</p>
            <p className="mb-3 text-sm text-textSecondary">USD</p>
            <Link
              to="/messages"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white"
            >
              <FiMessageSquare /> Contact Seller
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-cardBorder p-6">
          <h2 className="mb-3 text-xl font-semibold">Description</h2>
          <p className="leading-7 text-textSecondary">{listing.description}</p>
        </div>
        <aside className="rounded-xl border border-cardBorder p-6">
          <h3 className="mb-3 text-lg font-semibold">Seller Info</h3>
          <div className="flex items-center gap-3">
            <img
              src={listing.avatar_url || "https://i.pravatar.cc/100?img=20"}
              alt={listing.username || "seller"}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{listing.username || "Verified Seller"}</p>
              <p className="text-xs text-textSecondary">
                Joined {new Date(listing.seller_joined || listing.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Similar listings</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {similarListings.map((item) => (
            <Link key={item.id} to={`/listings/${item.id}`} className="rounded-lg border border-cardBorder p-4 hover:bg-gray-50">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-textSecondary">@{item.handle} · {item.platform}</p>
              <p className="mt-2 text-lg font-bold">${Number(item.price_usd).toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ListingDetailPage;
