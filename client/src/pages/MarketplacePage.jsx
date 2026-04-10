import ListingFilters from "../components/listings/ListingFilters";
import ListingGrid from "../components/listings/ListingGrid";
import useListings from "../hooks/useListings";

function MarketplacePage() {
  const { listings, pagination, loading, error, params, setParams } = useListings({ page: 1, limit: 9 });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <ListingFilters params={params} setParams={setParams} />
      <section>
        {loading && <p>Loading marketplace...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <ListingGrid listings={listings} />}
        <div className="mt-6 flex items-center justify-between text-sm">
          <p>Page {pagination.page} • Total {pagination.total}</p>
          <button className="rounded border px-3 py-1" onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}>Next</button>
        </div>
      </section>
    </div>
  );
}

export default MarketplacePage;
