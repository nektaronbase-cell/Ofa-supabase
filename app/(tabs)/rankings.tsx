import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRankings } from "@/hooks/use-rankings";
import { useAuthState } from "@/hooks/use-auth-state";
import { useFighters } from "@/hooks/use-fighters";
import { createChallenge } from "@/lib/supabase-client";
import { genId } from "@/lib/game-utils";

const WEIGHT_CLASSES = [
  { id: "flyweight", name: "Flyweight" },
  { id: "bantamweight", name: "Bantamweight" },
  { id: "featherweight", name: "Featherweight" },
  { id: "lightweight", name: "Lightweight" },
  { id: "welterweight", name: "Welterweight" },
  { id: "middleweight", name: "Middleweight" },
  { id: "lightheavyweight", name: "Light Heavyweight" },
  { id: "heavyweight", name: "Heavyweight" },
];

// Mock rankings data
const mockRankings: any[] = [
  {
    rank: 1,
    first_name: "Alex",
    last_name: "Champion",
    wins: 25,
    losses: 2,
    style_icon: "🥊",
    is_champion: true,
  },
  {
    rank: 2,
    first_name: "Jordan",
    last_name: "Striker",
    wins: 20,
    losses: 4,
    style_icon: "🦵",
    is_champion: false,
  },
  {
    rank: 3,
    first_name: "Casey",
    last_name: "Grappler",
    wins: 18,
    losses: 5,
    style_icon: "🤼",
    is_champion: false,
  },
  {
    rank: 4,
    first_name: "Morgan",
    last_name: "Technician",
    wins: 15,
    losses: 7,
    style_icon: "🥋",
    is_champion: false,
  },
  {
    rank: 5,
    first_name: "Taylor",
    last_name: "Rising",
    wins: 12,
    losses: 8,
    style_icon: "🏟️",
    is_champion: false,
  },
];

export default function RankingsScreen() {
  const colors = useColors();
  const { user } = useAuthState();
  const { fighters } = useFighters();
  const [selectedWeightClass, setSelectedWeightClass] = useState("welterweight");
  const { rankings: supabaseRankings, loading, error } = useRankings(selectedWeightClass);
  const [displayRankings, setDisplayRankings] = useState(mockRankings);
  const [challenging, setChallenging] = useState<string | null>(null);

  const selectedFighter = fighters && fighters.length > 0 ? fighters[0] : null;

  const handleChallenge = async (opponent: any) => {
    if (!user || !selectedFighter) {
      Alert.alert("Error", "You need a fighter to send a challenge");
      return;
    }

    try {
      setChallenging(opponent.id);
      const { error } = await createChallenge({
        id: genId(),
        challenger_id: user.id,
        challenger_fighter_id: selectedFighter.id,
        challenger_name: `${selectedFighter.first_name} ${selectedFighter.last_name}`,
        defender_id: opponent.owner_id,
        defender_fighter_id: opponent.id,
        defender_name: `${opponent.first_name} ${opponent.last_name}`,
        weight_class: selectedFighter.weight_class,
        status: 'pending'
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Challenge sent!");
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setChallenging(null);
    }
  };

  // Use Supabase data if available, otherwise use mock data
  useEffect(() => {
    if (supabaseRankings && supabaseRankings.length > 0) {
      const rankedFighters = supabaseRankings.map((fighter: any, index: number) => ({
        ...fighter,
        rank: index + 1,
      }));
      setDisplayRankings(rankedFighters);
    } else {
      setDisplayRankings(mockRankings);
    }
  }, [supabaseRankings]);

  const renderRankingCard = ({ item }: any) => (
    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border flex-row items-center">
        {/* Rank Badge */}
        <View className="bg-primary rounded-full w-12 h-12 items-center justify-center mr-3">
          <Text className="text-background font-bold text-lg">{item.rank}</Text>
        </View>

        {/* Fighter Info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-lg font-bold text-foreground">
              {item.style_icon || "🥊"} {item.first_name} {item.last_name}
            </Text>
            {item.is_champion && (
              <Text className="text-xs bg-warning px-2 py-1 rounded font-semibold text-background">
                CHAMPION
              </Text>
            )}
          </View>
          <Text className="text-sm text-muted">
            {item.wins}W - {item.losses}L
          </Text>
        </View>

        {/* Challenge Button */}
        {item.owner_id !== user?.id && selectedFighter && item.weight_class === selectedFighter.weight_class && (
          <Pressable
            onPress={() => handleChallenge(item)}
            disabled={challenging === item.id}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View className={`rounded px-3 py-2 ${challenging === item.id ? 'bg-border' : 'bg-primary'}`}>
              {challenging === item.id ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text className="text-background font-semibold text-sm">Challenge</Text>
              )}
            </View>
          </Pressable>
        )}
      </View>
    </Pressable>
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
            <Text className="text-2xl font-bold text-foreground">🏆 Rankings</Text>
            <Text className="text-sm text-muted">Global leaderboard by weight class</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error/10 rounded-lg p-3 border border-error">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* Weight Class Selector */}
          <View className="bg-surface rounded-lg p-3 border border-border">
            <Text className="text-sm font-semibold text-muted mb-2">Weight Class</Text>
            <Picker
              selectedValue={selectedWeightClass}
              onValueChange={(itemValue: string) => setSelectedWeightClass(itemValue)}
            >
              {WEIGHT_CLASSES.map((wc) => (
                <Picker.Item key={wc.id} label={wc.name} value={wc.id} />
              ))}
            </Picker>
          </View>

          {/* Rankings List */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              {WEIGHT_CLASSES.find((wc) => wc.id === selectedWeightClass)?.name} Division
            </Text>
            {loading ? (
              <View className="items-center py-12">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="text-muted mt-4">Loading rankings...</Text>
              </View>
            ) : displayRankings.length > 0 ? (
              <FlatList
                data={displayRankings}
                renderItem={renderRankingCard}
                keyExtractor={(item) => item.rank.toString()}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface rounded-lg p-6 items-center border border-border">
                <Text className="text-muted text-center">No fighters in this weight class yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
