import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuthState } from "@/hooks/use-auth-state";
import { supabase } from "@/lib/supabase-client";
import { makeFighter } from "@/lib/game-utils";

// Real UFC fighters data (truncated - first 5 from each weight class for demo)
const SEED_FIGHTERS = [
  // FLYWEIGHT
  { firstName: 'Joshua', lastName: 'Van', nickname: '', age: 28, height: 66, weight: 125, reach: 67, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 0, isChampion: true, wins: 15, losses: 2 },
  { firstName: 'Alexandre', lastName: 'Pantoja', nickname: 'The Cannibal', age: 34, height: 65, weight: 125, reach: 67, stance: 'Orthodox', style: 'bjj', weightClass: 'flyweight', rank: 1, wins: 28, losses: 5 },
  { firstName: 'Manel', lastName: 'Kape', nickname: 'Starboy', age: 31, height: 66, weight: 125, reach: 68, stance: 'Switch', style: 'muay_thai', weightClass: 'flyweight', rank: 2, wins: 20, losses: 6 },
  { firstName: 'Tatsuro', lastName: 'Taira', nickname: '', age: 24, height: 67, weight: 125, reach: 69, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 3, wins: 16, losses: 0 },
  { firstName: 'Brandon', lastName: 'Royval', nickname: 'Raw Dawg', age: 32, height: 69, weight: 125, reach: 69, stance: 'Orthodox', style: 'bjj', weightClass: 'flyweight', rank: 4, wins: 17, losses: 7 },
  
  // BANTAMWEIGHT
  { firstName: 'Petr', lastName: 'Yan', nickname: 'No Mercy', age: 31, height: 67, weight: 135, reach: 67, stance: 'Orthodox', style: 'boxer', weightClass: 'bantamweight', rank: 0, isChampion: true, wins: 18, losses: 5 },
  { firstName: 'Merab', lastName: 'Dvalishvili', nickname: 'The Machine', age: 34, height: 68, weight: 135, reach: 68, stance: 'Orthodox', style: 'wrestler', weightClass: 'bantamweight', rank: 1, wins: 18, losses: 4 },
  { firstName: 'Umar', lastName: 'Nurmagomedov', nickname: 'Young Eagle', age: 28, height: 68, weight: 135, reach: 70, stance: 'Southpaw', style: 'wrestler', weightClass: 'bantamweight', rank: 2, wins: 18, losses: 0 },
  { firstName: 'Sean', lastName: 'OMalley', nickname: 'Sugar', age: 30, height: 71, weight: 135, reach: 72, stance: 'Switch', style: 'boxer', weightClass: 'bantamweight', rank: 3, wins: 18, losses: 2 },
  { firstName: 'Cory', lastName: 'Sandhagen', nickname: 'The Sandman', age: 33, height: 71, weight: 135, reach: 70, stance: 'Switch', style: 'mma', weightClass: 'bantamweight', rank: 4, wins: 17, losses: 7 },

  // LIGHTWEIGHT
  { firstName: 'Islam', lastName: 'Makhachev', nickname: '', age: 33, height: 70, weight: 155, reach: 70, stance: 'Southpaw', style: 'wrestler', weightClass: 'lightweight', rank: 0, isChampion: true, wins: 28, losses: 1 },
  { firstName: 'Arman', lastName: 'Tsarukyan', nickname: 'Ahalkalakets', age: 28, height: 69, weight: 155, reach: 69, stance: 'Orthodox', style: 'wrestler', weightClass: 'lightweight', rank: 1, wins: 22, losses: 3 },
  { firstName: 'Charles', lastName: 'Oliveira', nickname: 'Do Bronx', age: 35, height: 70, weight: 155, reach: 74, stance: 'Orthodox', style: 'bjj', weightClass: 'lightweight', rank: 2, wins: 35, losses: 10 },
  { firstName: 'Max', lastName: 'Holloway', nickname: 'Blessed', age: 33, height: 71, weight: 155, reach: 69, stance: 'Orthodox', style: 'boxer', weightClass: 'lightweight', rank: 3, wins: 26, losses: 8 },
  { firstName: 'Justin', lastName: 'Gaethje', nickname: 'The Highlight', age: 36, height: 71, weight: 155, reach: 71, stance: 'Orthodox', style: 'wrestler', weightClass: 'lightweight', rank: 4, wins: 26, losses: 5 },

  // WELTERWEIGHT
  { firstName: 'Jack', lastName: 'Della Maddalena', nickname: '', age: 28, height: 71, weight: 170, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 1, wins: 18, losses: 2 },
  { firstName: 'Shavkat', lastName: 'Rakhmonov', nickname: 'Nomad', age: 30, height: 72, weight: 170, reach: 77, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 2, wins: 18, losses: 0 },
  { firstName: 'Ian', lastName: 'Machado Garry', nickname: 'The Future', age: 27, height: 75, weight: 170, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 3, wins: 15, losses: 0 },
  { firstName: 'Belal', lastName: 'Muhammad', nickname: 'Remember the Name', age: 37, height: 70, weight: 170, reach: 72, stance: 'Orthodox', style: 'wrestler', weightClass: 'welterweight', rank: 5, wins: 24, losses: 3 },
  { firstName: 'Kamaru', lastName: 'Usman', nickname: 'The Nigerian Nightmare', age: 38, height: 72, weight: 170, reach: 76, stance: 'Orthodox', style: 'wrestler', weightClass: 'welterweight', rank: 8, wins: 20, losses: 4 },

  // MIDDLEWEIGHT
  { firstName: 'Khamzat', lastName: 'Chimaev', nickname: 'Borz', age: 31, height: 74, weight: 185, reach: 75, stance: 'Orthodox', style: 'wrestler', weightClass: 'middleweight', rank: 0, isChampion: true, wins: 14, losses: 0 },
  { firstName: 'Dricus', lastName: 'Du Plessis', nickname: 'Stillknocks', age: 31, height: 73, weight: 185, reach: 76, stance: 'Southpaw', style: 'mma', weightClass: 'middleweight', rank: 1, wins: 22, losses: 2 },
  { firstName: 'Sean', lastName: 'Strickland', nickname: 'Tarzan', age: 34, height: 73, weight: 185, reach: 76, stance: 'Orthodox', style: 'boxer', weightClass: 'middleweight', rank: 3, wins: 29, losses: 6 },
  { firstName: 'Israel', lastName: 'Adesanya', nickname: 'The Last Stylebender', age: 36, height: 76, weight: 185, reach: 80, stance: 'Switch', style: 'muay_thai', weightClass: 'middleweight', rank: 6, wins: 24, losses: 4 },
  { firstName: 'Robert', lastName: 'Whittaker', nickname: 'The Reaper', age: 34, height: 72, weight: 185, reach: 73, stance: 'Orthodox', style: 'mma', weightClass: 'middleweight', rank: 9, wins: 26, losses: 8 },

  // LIGHT HEAVYWEIGHT
  { firstName: 'Alex', lastName: 'Pereira', nickname: 'Poatan', age: 37, height: 76, weight: 205, reach: 79, stance: 'Orthodox', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 0, isChampion: true, wins: 13, losses: 3 },
  { firstName: 'Jiri', lastName: 'Prochazka', nickname: 'Denisa', age: 33, height: 76, weight: 205, reach: 80, stance: 'Orthodox', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 1, wins: 31, losses: 5 },
  { firstName: 'Magomed', lastName: 'Ankalaev', nickname: '', age: 33, height: 75, weight: 205, reach: 75, stance: 'Orthodox', style: 'wrestler', weightClass: 'light_heavyweight', rank: 2, wins: 20, losses: 1 },
  { firstName: 'Jan', lastName: 'Blachowicz', nickname: 'Prince of Cieszyn', age: 42, height: 74, weight: 205, reach: 78, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 5, wins: 30, losses: 11 },
  { firstName: 'Jamahal', lastName: 'Hill', nickname: 'Sweet Dreams', age: 34, height: 76, weight: 205, reach: 79, stance: 'Orthodox', style: 'boxer', weightClass: 'light_heavyweight', rank: 7, wins: 12, losses: 2 },

  // HEAVYWEIGHT
  { firstName: 'Tom', lastName: 'Aspinall', nickname: '', age: 32, height: 77, weight: 255, reach: 78, stance: 'Orthodox', style: 'mma', weightClass: 'heavyweight', rank: 0, isChampion: true, wins: 15, losses: 3 },
  { firstName: 'Ciryl', lastName: 'Gane', nickname: 'Bon Gamin', age: 35, height: 76, weight: 247, reach: 81, stance: 'Switch', style: 'muay_thai', weightClass: 'heavyweight', rank: 1, wins: 12, losses: 2 },
  { firstName: 'Alexander', lastName: 'Volkov', nickname: 'Drago', age: 36, height: 79, weight: 255, reach: 80, stance: 'Orthodox', style: 'muay_thai', weightClass: 'heavyweight', rank: 2, wins: 38, losses: 11 },
  { firstName: 'Curtis', lastName: 'Blaydes', nickname: 'Razor', age: 34, height: 76, weight: 265, reach: 80, stance: 'Orthodox', style: 'wrestler', weightClass: 'heavyweight', rank: 4, wins: 18, losses: 5 },
  { firstName: 'Derrick', lastName: 'Lewis', nickname: 'The Black Beast', age: 40, height: 75, weight: 265, reach: 79, stance: 'Orthodox', style: 'boxer', weightClass: 'heavyweight', rank: 8, wins: 28, losses: 12 },
];

export default function AdminSeedScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuthState();
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleSeed = async () => {
    if (!user) {
      Alert.alert("Error", "You must be signed in to seed fighters");
      return;
    }

    Alert.alert(
      "Seed Database",
      `This will add ${SEED_FIGHTERS.length} real UFC fighters to the database. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Seed", 
          onPress: async () => {
            try {
              setSeeding(true);
              setProgress({ current: 0, total: SEED_FIGHTERS.length });

              let successCount = 0;
              let errorCount = 0;

              for (let i = 0; i < SEED_FIGHTERS.length; i++) {
                const fighterData = SEED_FIGHTERS[i];
                setProgress({ current: i + 1, total: SEED_FIGHTERS.length });

                try {
                  const fighter = makeFighter({
                    firstName: fighterData.firstName,
                    lastName: fighterData.lastName,
                    nickname: fighterData.nickname,
                    age: fighterData.age,
                    height: fighterData.height,
                    weight: fighterData.weight,
                    reach: fighterData.reach,
                    stance: fighterData.stance,
                    style: fighterData.style,
                    weightClass: fighterData.weightClass,
                    points: {}
                  }, user.id); // Use current user as owner

                  // Override with real stats
                  const realFighter = {
                    ...fighter,
                    wins: fighterData.wins,
                    losses: fighterData.losses,
                    rank: fighterData.rank === 0 ? undefined : fighterData.rank,
                    is_champion: fighterData.isChampion || false,
                    money: 100000 + (fighterData.rank === 0 ? 500000 : (15 - fighterData.rank) * 25000),
                    training_points: 10,
                    popularity: 50 + (15 - fighterData.rank) * 3,
                  };

                  const { error } = await supabase
                    .from('fighters')
                    .insert(realFighter);

                  if (error) {
                    console.error(`Error: ${fighterData.firstName} ${fighterData.lastName}:`, error.message);
                    errorCount++;
                  } else {
                    successCount++;
                  }
                } catch (err) {
                  console.error(`Exception: ${fighterData.firstName} ${fighterData.lastName}:`, err);
                  errorCount++;
                }
              }

              Alert.alert(
                "Seed Complete",
                `Success: ${successCount}\nErrors: ${errorCount}\nTotal: ${SEED_FIGHTERS.length}`,
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch (err) {
              Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
            } finally {
              setSeeding(false);
            }
          }
        }
      ]
    );
  };

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
              <Text className="text-2xl font-bold text-foreground">Admin Seed</Text>
              <Text className="text-sm text-muted">Populate database with real UFC fighters</Text>
            </View>
            <Pressable onPress={() => router.back()}>
              <Text className="text-primary font-semibold">Back</Text>
            </Pressable>
          </View>

          {/* Info Card */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-bold text-foreground mb-2">Database Seed</Text>
            <Text className="text-sm text-muted mb-4">
              This will add {SEED_FIGHTERS.length} real UFC fighters from all weight classes to make the game immediately playable.
            </Text>
            <View className="gap-2">
              <Text className="text-sm text-muted">• Flyweight: 5 fighters</Text>
              <Text className="text-sm text-muted">• Bantamweight: 5 fighters</Text>
              <Text className="text-sm text-muted">• Lightweight: 5 fighters</Text>
              <Text className="text-sm text-muted">• Welterweight: 5 fighters</Text>
              <Text className="text-sm text-muted">• Middleweight: 5 fighters</Text>
              <Text className="text-sm text-muted">• Light Heavyweight: 5 fighters</Text>
              <Text className="text-sm text-muted">• Heavyweight: 5 fighters</Text>
            </View>
          </View>

          {/* Progress */}
          {seeding && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Seeding... {progress.current} / {progress.total}
              </Text>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View 
                  className="h-full bg-primary"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </View>
            </View>
          )}

          {/* Seed Button */}
          <Pressable
            onPress={handleSeed}
            disabled={seeding}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View className={`rounded-lg py-4 ${seeding ? 'bg-border' : 'bg-primary'}`}>
              {seeding ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text className="text-background font-bold text-center text-lg">
                  Seed Database
                </Text>
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
