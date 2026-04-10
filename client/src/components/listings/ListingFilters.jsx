function ListingFilters({ params, setParams }) {
  return (
    <aside className="space-y-4 rounded-lg border border-cardBorder p-4">
      <h3 className="text-sm font-semibold">Filters</h3>
      <select className="w-full rounded border p-2" value={params.platform || ""} onChange={(e) => setParams((p) => ({ ...p, platform: e.target.value, page: 1 }))}>
        <option value="">All Platforms</option>
        <option value="instagram">Instagram</option>
        <option value="youtube">YouTube</option>
        <option value="twitter">Twitter</option>
        <option value="twitch">Twitch</option>
        <option value="telegram">Telegram</option>
        <option value="tiktok">TikTok</option>
      </select>
      <input className="w-full rounded border p-2" type="number" placeholder="Min Price" onChange={(e) => setParams((p) => ({ ...p, minPrice: e.target.value || undefined, page: 1 }))} />
      <input className="w-full rounded border p-2" type="number" placeholder="Max Price" onChange={(e) => setParams((p) => ({ ...p, maxPrice: e.target.value || undefined, page: 1 }))} />
    </aside>
  );
}

export default ListingFilters;
