import { ScrollView, Text, View, Pressable, FlatList, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFighters } from "@/hooks/use-fighters";
import { useAuthState } from "@/hooks/use-auth-state";

// Mock data for development
const mockFighters = [
  {
    id: "1",
    first_name: "John",
    last_name: "Smith",
    nickname: "The Hammer",
    weight_class: "welterweight",
    style_icon: "🏟️",
    wins: 12,
    losses: 3,
    draws: 0,
    money: 125000,
    training_points: 8,
  },
  {
    id: "2",
    first_name: "Maria",
    last_name: "Garcia",
    nickname: "La Reina",
    weight_class: "middleweight",
    style_icon: "🥊",
    wins: 8,
    losses: 2,
    draws: 1,
    money: 85000,
    training_points: 5,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuthState();
  const { fighters: supabaseFighters, loading, error } = useFighters();
  const [displayFighters, setDisplayFighters] = useState(mockFighters);

  // Use Supabase data if available, otherwise use mock data
  useEffect(() => {
    if (supabaseFighters && supabaseFighters.length > 0) {
      setDisplayFighters(supabaseFighters as any);
    } else if (!loading && !user) {
      // Show mock data when not logged in
      setDisplayFighters(mockFighters);
    }
  }, [supabaseFighters, loading, user]);

  const handleCreateFighter = () => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to create a fighter");
      return;
    }
    router.push("/create-fighter");
  };

  const handleViewFighter = (fighterId: string) => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to view fighter details");
      return;
    }
    router.push(`/training?id=${fighterId}`);
  };

  const handleViewChallenges = () => {
    router.push("../challenges");
  };

  const handleViewRankings = () => {
    router.push("../rankings");
  };

  const renderFighterCard = ({ item }: any) => (
    <Pressable
      onPress={() => handleViewFighter(item.id)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">
              {item.style_icon || "🥊"} {item.first_name} {item.last_name}
            </Text>
            {item.nickname && (
              <Text className="text-sm text-muted italic">"{item.nickname}"</Text>
            )}
          </View>
          <Text className="text-xs bg-primary px-2 py-1 rounded text-background font-semibold">
            {item.weight_class}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-muted">
            Record: {item.wins}W - {item.losses}L - {item.draws || 0}D
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-xs text-success font-semibold">
            💰 ${item.money?.toLocaleString() || "0"}
          </Text>
          <Text className="text-xs text-warning font-semibold">
            ⚡ {item.training_points || 0} pts
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-muted mt-4">Loading fighters...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">OFA</Text>
            <Text className="text-sm text-muted">
              {user ? `Welcome, ${user.email}` : "Onchain Fighting Association"}
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error/10 rounded-lg p-3 border border-error">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* Quick Stats */}
          {displayFighters.length > 0 && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-2">
              <Text className="text-sm font-semibold text-muted uppercase">
                Your Stats
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-2xl font-bold text-primary">
                    {displayFighters.reduce((sum, f: any) => sum + (f.wins || 0), 0)}
                  </Text>
                  <Text className="text-xs text-muted">Total Wins</Text>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-error">
                    {displayFighters.reduce((sum, f: any) => sum + (f.losses || 0), 0)}
                  </Text>
                  <Text className="text-xs text-muted">Total Losses</Text>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-success">
                    ${(displayFighters.reduce((sum, f: any) => sum + (f.money || 0), 0) / 1000).toFixed(0)}k
                  </Text>
                  <Text className="text-xs text-muted">Total Money</Text>
                </View>
              </View>
            </View>
          )}

          {/* Authentication Buttons */}
          {!user && (
            <View className="gap-2">
              <Pressable
                onPress={() => router.push('/sign-in' as any)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-primary rounded-lg py-4 items-center">
                  <Text className="text-background font-bold text-base">
                    Sign In
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => router.push('/sign-up' as any)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-surface border border-border rounded-lg py-4 items-center">
                  <Text className="text-foreground font-semibold text-base">
                    Create Account
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

          {/* Action Buttons */}
          {user && (
            <View className="gap-2">
              <Pressable
                onPress={() => router.push('/admin-seed')}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-border rounded-lg py-2 px-4 items-center">
                  <Text className="text-foreground font-semibold text-xs">
                    🔧 Admin: Seed Database
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleCreateFighter}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-primary rounded-lg py-3 px-4 items-center">
                  <Text className="text-background font-bold text-base">
                    ➕ Create Fighter
                  </Text>
                </View>
              </Pressable>

              <View className="flex-row gap-2">
              <Pressable
                onPress={handleViewChallenges}
                style={({ pressed }) => [
                  { flex: 1 },
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-surface rounded-lg py-3 px-4 items-center border border-border">
                  <Text className="text-foreground font-semibold text-sm">
                    ⚔️ Challenges
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleViewRankings}
                style={({ pressed }) => [
                  { flex: 1 },
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-surface rounded-lg py-3 px-4 items-center border border-border">
                  <Text className="text-foreground font-semibold text-sm">
                    🏆 Rankings
                  </Text>
                </View>
              </Pressable>
              </View>
            </View>
          )}

          {/* Fighters List */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              Your Fighters
            </Text>
            {displayFighters.length > 0 ? (
              <FlatList
                data={displayFighters}
                renderItem={renderFighterCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface rounded-lg p-6 items-center border border-border">
                <Text className="text-muted text-center">
                  {user
                    ? "No fighters yet. Create your first fighter to get started!"
                    : "Sign in to manage your fighters"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
