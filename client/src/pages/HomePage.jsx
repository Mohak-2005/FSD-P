import { Link } from "react-router-dom";
import ListingGrid from "../components/listings/ListingGrid";
import useListings from "../hooks/useListings";

function HomePage() {
  const { listings, loading, error } = useListings({ limit: 6 });

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-white py-10 text-center">
        <h1 className="text-4xl font-extrabold leading-tight text-textPrimary">
          Buy & Sell your <span className="bg-gradient-to-r from-accentOrange to-accentPurple bg-clip-text text-transparent underline">Social</span> Profiles online.
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-textSecondary">
          A secure marketplace to buy and sell Instagram, YouTube, Twitter, Telegram and more - fast, safe and hassle-free.
        </p>
        <div className="mx-auto mt-6 flex max-w-xl gap-2">
          <input className="w-full rounded-full border border-cardBorder px-4 py-3" placeholder="Search Instagram account..." />
          <Link to="/marketplace" className="rounded-full bg-primary px-6 py-3 font-medium text-white">Search</Link>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Latest Listings</h2>
        {loading && <p>Loading listings...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <ListingGrid listings={listings} />}
      </div>
    </section>
  );
}

export default HomePage;
