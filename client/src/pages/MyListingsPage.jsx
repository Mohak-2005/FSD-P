import ListingGrid from "../components/listings/ListingGrid";
import demoListings from "../utils/demoListings";
import { Link } from "react-router-dom";

function MyListingsPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-textPrimary">My Listings</h1>
        <Link to="/create-listing" className="rounded bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">
          Create New
        </Link>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <ListingGrid listings={demoListings} />
      </div>
    </section>
  );
}

export default MyListingsPage;
