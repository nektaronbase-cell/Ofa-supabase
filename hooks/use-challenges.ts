import { useEffect, useState, useCallback } from "react";
import { getChallenges, subscribeToChallenges, Challenge } from "@/lib/supabase-client";
import { useAuthState } from "./use-auth-state";

export function useChallenges() {
  const { user } = useAuthState();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChallenges = useCallback(async () => {
    if (!user) {
      setChallenges([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await getChallenges(user.id);

      if (err) {
        setError(err.message);
        setChallenges([]);
      } else {
        setChallenges(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToChallenges(user.id, () => {
      loadChallenges();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadChallenges]);

  return { challenges, loading, error, refetch: loadChallenges };
}
