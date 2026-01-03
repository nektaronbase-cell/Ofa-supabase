import { useEffect, useState, useCallback } from "react";
import { getFighters, subscribeToFighters, Fighter } from "@/lib/supabase-client";
import { useAuthState } from "./use-auth-state";

export function useFighters() {
  const { user } = useAuthState();
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFighters = useCallback(async () => {
    if (!user) {
      setFighters([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await getFighters(user.id);

      if (err) {
        setError(err.message);
        setFighters([]);
      } else {
        setFighters(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setFighters([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFighters();
  }, [loadFighters]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToFighters(user.id, () => {
      loadFighters();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadFighters]);

  return { fighters, loading, error, refetch: loadFighters };
}
