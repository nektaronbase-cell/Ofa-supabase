import { useEffect, useState, useCallback } from "react";
import { getRankings, Fighter } from "@/lib/supabase-client";

export function useRankings(weightClass: string) {
  const [rankings, setRankings] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRankings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await getRankings(weightClass);

      if (err) {
        setError(err.message);
        setRankings([]);
      } else {
        setRankings(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, [weightClass]);

  useEffect(() => {
    loadRankings();
  }, [loadRankings]);

  return { rankings, loading, error, refetch: loadRankings };
}
