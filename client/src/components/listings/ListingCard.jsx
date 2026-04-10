import { Link } from "react-router-dom";
import { FiBookmark, FiTrendingUp, FiUsers } from "react-icons/fi";

const platformColor = {
  instagram: "text-orange-500",
  twitch: "text-purple-600",
  youtube: "text-red-600",
  twitter: "text-sky-500",
  telegram: "text-blue-500",
  tiktok: "text-black",
  other: "text-gray-700",
};

function ListingCard({ listing }) {
  return (
    <article className="p-4">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-textPrimary">{listing.title}</h3>
          <p className={`text-sm ${platformColor[listing.platform] || "text-textSecondary"}`}>
            @{listing.handle} � {listing.platform}
          </p>
        </div>
        <button type="button" className="text-textSecondary"><FiBookmark /></button>
      </div>
      <div className="mb-2 flex gap-4 text-sm text-textSecondary">
        <span className="inline-flex items-center gap-1"><FiUsers />{Number(listing.followers_count).toLocaleString()} followers</span>
        <span className="inline-flex items-center gap-1"><FiTrendingUp />{listing.engagement_rate}% engagement</span>
      </div>
      <div className="mb-2 flex gap-2 text-xs">
        <span className="rounded-full bg-pink-50 px-2 py-1 text-pink-600">{listing.category}</span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">{listing.country}</span>
      </div>
      <p className="truncate text-sm text-textSecondary">{listing.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-2xl font-bold text-textPrimary">${Number(listing.price_usd).toLocaleString()} <span className="text-xs font-normal text-textSecondary">USD</span></p>
        <Link className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white" to={`/listings/${listing.id}`}>
          More Details
        </Link>
      </div>
    </article>
  );
}

export default ListingCard;
