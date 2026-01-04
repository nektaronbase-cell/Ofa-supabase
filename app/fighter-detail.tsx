import { ScrollView, Text, View, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFighters } from "@/hooks/use-fighters";

// Mock fight history data
const mockFightHistory = [
  {
    id: "1",
    opponent: "Mike Johnson",
    result: "Win",
    method: "KO",
    round: 2,
    date: "2024-01-15",
    purse: 15000,
  },
  {
    id: "2",
    opponent: "Carlos Silva",
    result: "Win",
    method: "Submission",
    round: 3,
    date: "2024-01-08",
    purse: 12000,
  },
  {
    id: "3",
    opponent: "Tommy Lee",
    result: "Loss",
    method: "Decision",
    round: 5,
    date: "2024-01-01",
    purse: 8000,
  },
];

export default function FighterDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const { fighters } = useFighters();
  
  const [fighter, setFighter] = useState<any>(null);
  const [fightHistory, setFightHistory] = useState(mockFightHistory);

  useEffect(() => {
    // Find fighter by ID from params
    if (params.id && fighters) {
      const found = fighters.find((f: any) => f.id === params.id);
      if (found) {
        setFighter(found);
      }
    }
  }, [params.id, fighters]);

  if (!fighter) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-muted text-center">Fighter not found</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-primary mt-4">Go Back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const attributes = [
    { name: "Striking", value: fighter.striking || 0, color: "#EF4444" },
    { name: "Grappling", value: fighter.grappling || 0, color: "#F59E0B" },
    { name: "Stamina", value: fighter.stamina || 0, color: "#10B981" },
    { name: "Chin", value: fighter.chin || 0, color: "#3B82F6" },
    { name: "Power", value: fighter.power || 0, color: "#8B5CF6" },
  ];

  const totalWins = fighter.wins || 0;
  const totalLosses = fighter.losses || 0;
  const totalDraws = fighter.draws || 0;
  const totalFights = totalWins + totalLosses + totalDraws;
  const winRate = totalFights > 0 ? ((totalWins / totalFights) * 100).toFixed(1) : "0.0";

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          {/* Header with Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-primary font-semibold">← Back</Text>
          </Pressable>

          {/* Fighter Profile */}
          <View className="bg-surface border border-border rounded-lg p-6 gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-3xl">{fighter.style_icon || "🥊"}</Text>
                  <View>
                    <Text className="text-2xl font-bold text-foreground">
                      {fighter.first_name} {fighter.last_name}
                    </Text>
                    {fighter.nickname && (
                      <Text className="text-sm text-muted italic">
                        "{fighter.nickname}"
                      </Text>
                    )}
                  </View>
                </View>

                <View className="bg-error/20 self-start px-3 py-1 rounded-full">
                  <Text className="text-error text-xs font-semibold uppercase">
                    {fighter.weight_class || "Unknown"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="h-px bg-border" />

            {/* Record */}
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-xs text-muted uppercase">Record</Text>
                <Text className="text-xl font-bold text-foreground">
                  {totalWins}W - {totalLosses}L - {totalDraws}D
                </Text>
              </View>
              <View className="gap-1 items-end">
                <Text className="text-xs text-muted uppercase">Win Rate</Text>
                <Text className="text-xl font-bold text-success">{winRate}%</Text>
              </View>
            </View>

            <View className="h-px bg-border" />

            {/* Stats */}
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-xs text-muted uppercase">Earnings</Text>
                <Text className="text-lg font-bold text-success">
                  💰 ${(fighter.money || 0).toLocaleString()}
                </Text>
              </View>
              <View className="gap-1 items-end">
                <Text className="text-xs text-muted uppercase">Training Points</Text>
                <Text className="text-lg font-bold text-warning">
                  ⚡ {fighter.training_points || 0} pts
                </Text>
              </View>
            </View>

            {/* Injury Status */}
            {fighter.injury && (
              <>
                <View className="h-px bg-border" />
                <View className="bg-error/10 p-3 rounded-lg">
                  <Text className="text-error font-semibold text-sm">
                    🤕 Injured - {fighter.injury} ({fighter.injury_time || 0} weeks recovery)
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Attributes Section */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-foreground">Attributes</Text>
            
            <View className="bg-surface border border-border rounded-lg p-4 gap-4">
              {attributes.map((attr, index) => (
                <View key={index} className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-foreground">
                      {attr.name}
                    </Text>
                    <Text className="text-sm font-bold text-primary">
                      {attr.value}/100
                    </Text>
                  </View>
                  
                  {/* Progress Bar */}
                  <View className="h-3 bg-border rounded-full overflow-hidden">
                    <View 
                      style={{ 
                        width: `${attr.value}%`,
                        backgroundColor: attr.color,
                      }}
                      className="h-full rounded-full"
                    />
                  </View>
                </View>
              ))}

              <View className="h-px bg-border mt-2" />

              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-muted">Total</Text>
                <Text className="text-lg font-bold text-foreground">
                  {attributes.reduce((sum, attr) => sum + attr.value, 0)}/500
                </Text>
              </View>
            </View>
          </View>

          {/* Fight History Section */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-foreground">Fight History</Text>
            
            {fightHistory.length > 0 ? (
              <View className="gap-3">
                {fightHistory.map((fight, index) => (
                  <View 
                    key={fight.id}
                    className="bg-surface border border-border rounded-lg p-4 gap-3"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 gap-1">
                        <Text className="text-base font-semibold text-foreground">
                          vs {fight.opponent}
                        </Text>
                        <Text className="text-xs text-muted">
                          {new Date(fight.date).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      <View 
                        className={`px-3 py-1 rounded-full ${
                          fight.result === "Win" 
                            ? "bg-success/20" 
                            : fight.result === "Loss"
                            ? "bg-error/20"
                            : "bg-border"
                        }`}
                      >
                        <Text 
                          className={`text-xs font-bold ${
                            fight.result === "Win"
                              ? "text-success"
                              : fight.result === "Loss"
                              ? "text-error"
                              : "text-muted"
                          }`}
                        >
                          {fight.result}
                        </Text>
                      </View>
                    </View>

                    <View className="h-px bg-border" />

                    <View className="flex-row items-center justify-between">
                      <View className="gap-1">
                        <Text className="text-xs text-muted uppercase">Method</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {fight.method} - Round {fight.round}
                        </Text>
                      </View>
                      <View className="gap-1 items-end">
                        <Text className="text-xs text-muted uppercase">Purse</Text>
                        <Text className="text-sm font-semibold text-success">
                          ${fight.purse.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-surface border border-border rounded-lg p-6 items-center">
                <Text className="text-muted text-center">
                  No fight history yet. Challenge other fighters to build your record!
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-2">
            <Pressable
              onPress={() => router.push(`/training?id=${fighter.id}` as any)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View className="bg-primary rounded-lg py-4 items-center">
                <Text className="text-background font-bold text-base">
                  🏋️ Train Fighter
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(tabs)/rankings")}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View className="bg-surface border border-border rounded-lg py-4 items-center">
                <Text className="text-foreground font-semibold text-base">
                  ⚔️ Find Opponents
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
