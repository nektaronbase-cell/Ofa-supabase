import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

// Mock challenges data
const mockChallenges = [
  {
    id: "ch1",
    challenger_name: "John Smith",
    defender_name: "You",
    weight_class: "welterweight",
    status: "pending",
    created_at: "2026-01-03T15:30:00Z",
  },
  {
    id: "ch2",
    challenger_name: "Maria Garcia",
    defender_name: "You",
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
  const [challenges] = useState(mockChallenges);
  const [history] = useState(mockHistory);
  const [activeTab, setActiveTab] = useState<"incoming" | "history">("incoming");

  const renderChallengeCard = ({ item }: any) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="mb-3">
        <Text className="text-lg font-bold text-foreground mb-1">
          ⚔️ {item.challenger_name}
        </Text>
        <Text className="text-sm text-muted">
          {item.weight_class} • {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
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
    </View>
  );

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
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">⚔️ Challenges</Text>
            <Text className="text-sm text-muted">Manage your fights and history</Text>
          </View>

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
                  Incoming ({challenges.length})
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
                  History ({history.length})
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Content */}
          {activeTab === "incoming" ? (
            <View>
              {challenges.length > 0 ? (
                <FlatList
                  data={challenges}
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
              {history.length > 0 ? (
                <FlatList
                  data={history}
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
