import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuthState } from "@/hooks/use-auth-state";
import { getFighterById, updateFighter } from "@/lib/supabase-client";
import { ATTRIBUTE_CATEGORIES, rand, clamp } from "@/lib/game-utils";

export default function TrainingScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuthState();
  const params = useLocalSearchParams();
  const fighterId = params.id as string;

  const [fighter, setFighter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState<string | null>(null);

  useEffect(() => {
    loadFighter();
  }, [fighterId]);

  const loadFighter = async () => {
    if (!fighterId) return;
    
    try {
      setLoading(true);
      const { data, error } = await getFighterById(fighterId);
      if (error) {
        Alert.alert("Error", error.message);
        router.back();
      } else if (data) {
        setFighter(data);
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const train = async (attr: string) => {
    if (!fighter || fighter.training_points < 2) {
      Alert.alert("Not Enough Points", "You need at least 2 training points");
      return;
    }

    const currentValue = fighter.attributes?.[attr] || 50;
    if (currentValue >= 99) {
      Alert.alert("Max Level", "This attribute is already at maximum level");
      return;
    }

    try {
      setTraining(attr);
      const improvement = rand(2, 4);
      const newVal = clamp(currentValue + improvement, 30, 99);
      
      const { error } = await updateFighter(fighter.id, {
        training_points: fighter.training_points - 2,
        attributes: { ...fighter.attributes, [attr]: newVal }
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", `${attr} improved by ${improvement} points!`);
        await loadFighter();
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setTraining(null);
    }
  };

  const getColor = (value: number) => {
    if (value >= 90) return colors.warning;
    if (value >= 80) return colors.success;
    if (value >= 70) return colors.primary;
    return colors.foreground;
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-muted mt-4">Loading fighter...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!fighter) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-muted text-center">Fighter not found</Text>
          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-primary font-semibold">Go Back</Text>
          </Pressable>
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
        <View className="gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-foreground">Training</Text>
              <Text className="text-sm text-muted">
                {fighter.first_name} {fighter.last_name}
              </Text>
            </View>
            <View className="bg-warning/20 rounded-lg px-4 py-2 border border-warning">
              <Text className="text-warning text-xl font-bold">{fighter.training_points}</Text>
              <Text className="text-xs text-muted">TP</Text>
            </View>
            <Pressable onPress={() => router.back()} className="ml-4">
              <Text className="text-primary font-semibold">Done</Text>
            </Pressable>
          </View>

          {/* Info */}
          <View className="bg-surface rounded-lg p-3 border border-border">
            <Text className="text-sm text-muted">
              💡 Each training session costs 2 TP and improves an attribute by 2-4 points
            </Text>
          </View>

          {/* Attributes */}
          {Object.entries(ATTRIBUTE_CATEGORIES).map(([category, attrs]) => (
            <View key={category} className="bg-surface rounded-lg p-4 border border-border gap-3">
              <Text className="text-lg font-bold text-primary">{category}</Text>
              {attrs.map((attr) => {
                const value = fighter.attributes?.[attr] || 50;
                const isTraining = training === attr;
                const canTrain = fighter.training_points >= 2 && value < 99;

                return (
                  <View key={attr} className="gap-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm text-muted">{attr}</Text>
                      <Text className="font-bold" style={{ color: getColor(value) }}>
                        {value}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center gap-2">
                      <View className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <View 
                          className="h-full bg-primary"
                          style={{ width: `${value}%` }}
                        />
                      </View>
                      
                      <Pressable
                        onPress={() => train(attr)}
                        disabled={!canTrain || isTraining}
                        style={({ pressed }) => [
                          {
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                      >
                        <View className={`px-3 py-1 rounded ${
                          !canTrain || isTraining ? 'bg-border' : 'bg-primary'
                        }`}>
                          {isTraining ? (
                            <ActivityIndicator size="small" color={colors.background} />
                          ) : (
                            <Text className={`text-xs font-semibold ${
                              !canTrain ? 'text-muted' : 'text-background'
                            }`}>
                              +2TP
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
