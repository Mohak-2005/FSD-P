import { useEffect, useState } from "react";
import { getListings } from "../api/listings";
import demoListings from "../utils/demoListings";

export default function useListings(initialParams = {}) {
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getListings(params);
        const serverListings = data.data || [];
        setListings(serverListings.length ? serverListings : demoListings);
        setPagination(data.pagination || { page: 1, limit: 12, total: serverListings.length });
      } catch (err) {
        setListings(demoListings);
        setPagination({ page: 1, limit: 12, total: demoListings.length });
        setError("");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [params]);

  return { listings, pagination, loading, error, params, setParams };
}
