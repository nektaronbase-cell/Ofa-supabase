import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useChallenges } from "@/hooks/use-challenges";
import { useAuthState } from "@/hooks/use-auth-state";
import { updateChallenge, getFighterById, updateFighter } from "@/lib/supabase-client";
import { simFight } from "@/lib/game-utils";

// Mock challenges data
const mockChallenges = [
  {
    id: "ch1",
    challenger_name: "John Smith",
    defender_name: "You",
    challenger_fighter_id: "mock1",
    defender_fighter_id: "mock2",
    weight_class: "welterweight",
    status: "pending",
    created_at: "2026-01-03T15:30:00Z",
  },
  {
    id: "ch2",
    challenger_name: "Maria Garcia",
    defender_name: "You",
    challenger_fighter_id: "mock3",
    defender_fighter_id: "mock4",
    weight_class: "middleweight",
    status: "pending",
    created_at: "2026-01-03T14:15:00Z",
  },
];

const mockHistory = [
  {
    id: "h1",
    challenger_name: "Alex Champion",
    defender_name: "You",
    winner: "You",
    method: "KO",
    round: 2,
    purse: 50000,
    created_at: "2026-01-02T18:00:00Z",
  },
  {
    id: "h2",
    challenger_name: "You",
    defender_name: "Jordan Striker",
    winner: "Jordan Striker",
    method: "Decision",
    round: 3,
    purse: 15000,
    created_at: "2026-01-01T16:30:00Z",
  },
];

export default function ChallengesScreen() {
  const colors = useColors();
  const { user } = useAuthState();
  const { challenges: supabaseChallenges, loading, error, refetch } = useChallenges();
  const [displayChallenges, setDisplayChallenges] = useState(mockChallenges);
  const [displayHistory] = useState(mockHistory);
  const [activeTab, setActiveTab] = useState<"incoming" | "history">("incoming");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Use Supabase data if available, otherwise use mock data
  useEffect(() => {
    if (supabaseChallenges && supabaseChallenges.length > 0) {
      setDisplayChallenges(supabaseChallenges as any);
    } else {
      setDisplayChallenges(mockChallenges);
    }
  }, [supabaseChallenges]);

  const handleAcceptChallenge = async (challengeId: string) => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to accept challenges");
      return;
    }

    const challenge = displayChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    try {
      setActionLoading(challengeId);
      
      // Get both fighters
      const { data: f1 } = await getFighterById(challenge.challenger_fighter_id);
      const { data: f2 } = await getFighterById(challenge.defender_fighter_id);
      
      if (!f1 || !f2) {
        Alert.alert("Error", "Could not load fighter data");
        return;
      }

      // Simulate fight
      const result = simFight(f1, f2);
      const won = result.winner.id === f2.id;
      
      // Update winner
      await updateFighter(result.winner.id, {
        wins: result.winner.wins + 1,
        ko_wins: result.method === 'KO' ? result.winner.ko_wins + 1 : result.winner.ko_wins,
        sub_wins: result.method === 'Submission' ? result.winner.sub_wins + 1 : result.winner.sub_wins,
        dec_wins: result.method === 'Decision' ? result.winner.dec_wins + 1 : result.winner.dec_wins,
        money: result.winner.money + 50000,
        training_points: result.winner.training_points + 4
      });
      
      // Update loser
      await updateFighter(result.loser.id, {
        losses: result.loser.losses + 1,
        money: result.loser.money + 15000,
        training_points: result.loser.training_points + 2
      });
      
      // Update challenge status
      await updateChallenge(challengeId, "done");
      
      // Show result
      const purse = won ? 50000 : 15000;
      Alert.alert(
        won ? "🏆 VICTORY!" : "💔 DEFEAT",
        `${result.winner.first_name} ${result.winner.last_name} def. ${result.loser.first_name} ${result.loser.last_name}\n\n${result.method} • R${result.round} • ${result.time}\n\nPurse: $${purse.toLocaleString()}`,
        [{ text: "OK", onPress: () => refetch() }]
      );
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineChallenge = async (challengeId: string) => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to decline challenges");
      return;
    }

    try {
      setActionLoading(challengeId);
      const { error: err } = await updateChallenge(challengeId, "declined");
      if (err) {
        Alert.alert("Error", err.message);
      } else {
        Alert.alert("Success", "Challenge declined");
        refetch();
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActionLoading(null);
    }
  };

  const renderChallengeCard = ({ item }: any) => {
    const isProcessing = actionLoading === item.id;

    return (
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <View className="mb-3">
          <Text className="text-lg font-bold text-foreground mb-1">
            ⚔️ {item.challenger_name}
          </Text>
          <Text className="text-sm text-muted">
            {item.weight_class} • {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        {isProcessing ? (
          <View className="flex-row items-center justify-center py-2">
            <ActivityIndicator size="small" color={colors.primary} />
            <Text className="text-muted ml-2">Processing...</Text>
          </View>
        ) : (
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => handleAcceptChallenge(item.id)}
              style={({ pressed }) => [
                { flex: 1 },
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View className="bg-success rounded-lg py-2 px-3 items-center">
                <Text className="text-background font-semibold text-sm">Accept</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleDeclineChallenge(item.id)}
              style={({ pressed }) => [
                { flex: 1 },
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View className="bg-error rounded-lg py-2 px-3 items-center">
                <Text className="text-background font-semibold text-sm">Decline</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  const renderHistoryCard = ({ item }: any) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground mb-1">
            {item.challenger_name} vs {item.defender_name}
          </Text>
          <Text className="text-sm text-muted">
            {item.method} • Round {item.round}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className={`text-lg font-bold ${
              item.winner === "You" ? "text-success" : "text-error"
            }`}
          >
            {item.winner === "You" ? "✓ Win" : "✗ Loss"}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between pt-2 border-t border-border">
        <Text className="text-xs text-muted">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <Text className="text-sm font-semibold text-success">
          💰 ${item.purse.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">⚔️ Challenges</Text>
            <Text className="text-sm text-muted">Manage your fights and history</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error/10 rounded-lg p-3 border border-error">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* Tab Selector */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setActiveTab("incoming")}
              style={({ pressed }) => [
                { flex: 1 },
                {
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View
                className={`rounded-lg py-2 px-3 items-center border ${
                  activeTab === "incoming"
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    activeTab === "incoming" ? "text-background" : "text-foreground"
                  }`}
                >
                  Incoming ({displayChallenges.length})
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("history")}
              style={({ pressed }) => [
                { flex: 1 },
                {
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View
                className={`rounded-lg py-2 px-3 items-center border ${
                  activeTab === "history"
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    activeTab === "history" ? "text-background" : "text-foreground"
                  }`}
                >
                  History ({displayHistory.length})
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Content */}
          {activeTab === "incoming" ? (
            <View>
              {loading ? (
                <View className="items-center py-12">
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text className="text-muted mt-4">Loading challenges...</Text>
                </View>
              ) : displayChallenges.length > 0 ? (
                <FlatList
                  data={displayChallenges}
                  renderItem={renderChallengeCard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View className="bg-surface rounded-lg p-6 items-center border border-border">
                  <Text className="text-muted text-center">
                    No incoming challenges. You're ready to fight!
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              {displayHistory.length > 0 ? (
                <FlatList
                  data={displayHistory}
                  renderItem={renderHistoryCard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View className="bg-surface rounded-lg p-6 items-center border border-border">
                  <Text className="text-muted text-center">
                    No fight history yet. Challenge someone to get started!
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
