import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuthState } from "@/hooks/use-auth-state";
import { supabase } from "@/lib/supabase-client";
import { WEIGHT_CLASSES, STYLES, STANCES, makeFighter } from "@/lib/game-utils";

const ATTRIBUTES = [
  { key: 'Striking', label: 'Striking', icon: '🥊' },
  { key: 'Grappling', label: 'Grappling', icon: '🤼' },
  { key: 'Stamina', label: 'Stamina', icon: '💪' },
  { key: 'Chin', label: 'Chin', icon: '🛡️' },
  { key: 'Power', label: 'Power', icon: '💥' },
];

const MAX_POINTS = 90;
const MAX_PER_ATTRIBUTE = 30;

export default function CreateFighterScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuthState();
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    age: 25,
    height: 70,
    weight: 170,
    reach: 72,
    stance: 'Orthodox',
    style: 'mma',
    weightClass: 'welterweight',
    points: {} as Record<string, number>,
  });
  
  const [loading, setLoading] = useState(false);

  // Calculate remaining points
  const usedPoints = Object.values(form.points).reduce((sum, val) => sum + (val || 0), 0);
  const remainingPoints = MAX_POINTS - usedPoints;

  const handleSliderChange = (attr: string, value: number) => {
    const roundedValue = Math.round(value);
    const current = form.points[attr] || 0;
    const diff = roundedValue - current;
    
    // Check if we have enough points
    if (remainingPoints - diff >= 0 && roundedValue >= 0 && roundedValue <= MAX_PER_ATTRIBUTE) {
      setForm({
        ...form,
        points: { ...form.points, [attr]: roundedValue }
      });
    }
  };

  const handleIncrement = (attr: string) => {
    const current = form.points[attr] || 0;
    if (remainingPoints > 0 && current < MAX_PER_ATTRIBUTE) {
      setForm({
        ...form,
        points: { ...form.points, [attr]: current + 1 }
      });
    }
  };

  const handleDecrement = (attr: string) => {
    const current = form.points[attr] || 0;
    if (current > 0) {
      setForm({
        ...form,
        points: { ...form.points, [attr]: current - 1 }
      });
    }
  };

  const create = async () => {
    if (!form.firstName || !form.lastName) {
      Alert.alert("Error", "Please fill in first and last name");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be signed in to create a fighter");
      return;
    }

    if (usedPoints !== MAX_POINTS) {
      Alert.alert("Error", `Please allocate all ${MAX_POINTS} attribute points`);
      return;
    }

    try {
      setLoading(true);
      const fighter = makeFighter(form, user.id);
      
      const { error } = await supabase
        .from('fighters')
        .insert(fighter);
      
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Fighter created successfully!", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
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
            <View>
              <Text className="text-2xl font-bold text-foreground">Create Fighter</Text>
              <Text className="text-sm text-muted">Build your MMA champion</Text>
            </View>
            <Pressable onPress={() => router.back()}>
              <Text className="text-primary font-semibold">Cancel</Text>
            </Pressable>
          </View>

          {/* Basic Info */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-sm font-semibold text-muted uppercase">Basic Info</Text>
            
            <View className="flex-row gap-2">
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#9BA1A6"
                value={form.firstName}
                onChangeText={(text) => setForm({ ...form, firstName: text })}
                className="flex-1 bg-background border border-border p-3 text-foreground rounded"
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#9BA1A6"
                value={form.lastName}
                onChangeText={(text) => setForm({ ...form, lastName: text })}
                className="flex-1 bg-background border border-border p-3 text-foreground rounded"
              />
            </View>

            <TextInput
              placeholder="Nickname (optional)"
              placeholderTextColor="#9BA1A6"
              value={form.nickname}
              onChangeText={(text) => setForm({ ...form, nickname: text })}
              className="bg-background border border-border p-3 text-foreground rounded"
            />

            <View>
              <Text className="text-xs text-muted mb-2">Weight Class</Text>
              <View className="bg-background border border-border rounded overflow-hidden">
                <Picker
                  selectedValue={form.weightClass}
                  onValueChange={(value) => setForm({ ...form, weightClass: value })}
                >
                  {WEIGHT_CLASSES.map((wc) => (
                    <Picker.Item key={wc.id} label={wc.name} value={wc.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text className="text-xs text-muted mb-2">Stance</Text>
              <View className="bg-background border border-border rounded overflow-hidden">
                <Picker
                  selectedValue={form.stance}
                  onValueChange={(value) => setForm({ ...form, stance: value })}
                >
                  {STANCES.map((stance) => (
                    <Picker.Item key={stance} label={stance} value={stance} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Fighting Style */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-sm font-semibold text-muted uppercase">Fighting Style</Text>
            <View className="flex-row flex-wrap gap-2">
              {STYLES.map((style) => (
                <Pressable
                  key={style.id}
                  onPress={() => setForm({ ...form, style: style.id })}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="flex-1 min-w-[100px]"
                >
                  <View
                    className={`p-3 rounded border items-center ${
                      form.style === style.id
                        ? 'bg-primary border-primary'
                        : 'bg-background border-border'
                    }`}
                  >
                    <Text className="text-2xl mb-1">{style.icon}</Text>
                    <Text
                      className={`text-xs font-semibold ${
                        form.style === style.id ? 'text-background' : 'text-foreground'
                      }`}
                    >
                      {style.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Attributes with Sliders */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-muted uppercase">Attributes</Text>
              <View className="bg-background px-3 py-2 rounded border border-border">
                <Text className={`text-lg font-bold ${
                  remainingPoints === 0 ? 'text-success' : 
                  remainingPoints < 10 ? 'text-warning' : 
                  'text-foreground'
                }`}>
                  {remainingPoints}/{MAX_POINTS} pts
                </Text>
              </View>
            </View>

            {remainingPoints > 0 && (
              <View className="bg-warning/10 border border-warning rounded p-3">
                <Text className="text-warning text-xs font-semibold">
                  ⚠️ Allocate all {remainingPoints} remaining points before creating
                </Text>
              </View>
            )}

            {ATTRIBUTES.map((attr) => {
              const value = form.points[attr.key] || 0;
              const percentage = (value / MAX_PER_ATTRIBUTE) * 100;
              
              return (
                <View key={attr.key} className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl">{attr.icon}</Text>
                      <Text className="text-sm font-semibold text-foreground">{attr.label}</Text>
                    </View>
                    <Text className="text-lg font-bold text-primary">
                      {value}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Pressable
                      onPress={() => handleDecrement(attr.key)}
                      disabled={value === 0}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <View className={`w-10 h-10 rounded items-center justify-center ${
                        value === 0 ? 'bg-border/50' : 'bg-error'
                      }`}>
                        <Text className={`font-bold text-lg ${
                          value === 0 ? 'text-muted' : 'text-background'
                        }`}>−</Text>
                      </View>
                    </Pressable>

                    <View className="flex-1">
                      <Slider
                        value={value}
                        onValueChange={(val: number) => handleSliderChange(attr.key, val)}
                        minimumValue={0}
                        maximumValue={MAX_PER_ATTRIBUTE}
                        step={1}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.border}
                        thumbTintColor={colors.primary}
                      />
                      {/* Progress bar visual */}
                      <View className="h-1 bg-border rounded-full mt-1">
                        <View 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </View>
                    </View>

                    <Pressable
                      onPress={() => handleIncrement(attr.key)}
                      disabled={value >= MAX_PER_ATTRIBUTE || remainingPoints === 0}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <View className={`w-10 h-10 rounded items-center justify-center ${
                        value >= MAX_PER_ATTRIBUTE || remainingPoints === 0 ? 'bg-border/50' : 'bg-success'
                      }`}>
                        <Text className={`font-bold text-lg ${
                          value >= MAX_PER_ATTRIBUTE || remainingPoints === 0 ? 'text-muted' : 'text-background'
                        }`}>+</Text>
                      </View>
                    </Pressable>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-xs text-muted">Min: 0</Text>
                    <Text className="text-xs text-muted">Max: {MAX_PER_ATTRIBUTE}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Create Button */}
          <Pressable
            onPress={create}
            disabled={!form.firstName || !form.lastName || usedPoints !== MAX_POINTS || loading}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View className={`rounded-lg py-4 items-center ${
              !form.firstName || !form.lastName || usedPoints !== MAX_POINTS || loading
                ? 'bg-border'
                : 'bg-primary'
            }`}>
              <Text className="text-background font-bold text-base">
                {loading ? 'Creating...' : 
                 usedPoints !== MAX_POINTS ? `Allocate ${remainingPoints} more points` :
                 'Create Fighter'}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
