import ListingCard from "./ListingCard";

function ListingGrid({ listings }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <div key={listing.id} className="rounded-lg border border-cardBorder bg-white">
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  );
}

export default ListingGrid;
