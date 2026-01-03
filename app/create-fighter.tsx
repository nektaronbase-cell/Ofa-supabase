import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import { ScreenContainer } from "@/components/screen-container";
import { useAuthState } from "@/hooks/use-auth-state";
import { createFighter } from "@/lib/supabase-client";
import { WEIGHT_CLASSES, STYLES, STANCES, ATTRIBUTE_CATEGORIES, makeFighter, clamp } from "@/lib/game-utils";

export default function CreateFighterScreen() {
  const router = useRouter();
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
  const [pts, setPts] = useState(90);
  const [loading, setLoading] = useState(false);

  const handlePt = (attr: string, value: number) => {
    const current = form.points[attr] || 0;
    const diff = value - current;
    
    if (pts - diff >= 0 && value >= 0 && value <= 15) {
      setForm({
        ...form,
        points: { ...form.points, [attr]: value }
      });
      setPts(pts - diff);
    }
  };

  const create = async () => {
    if (!form.firstName || !form.lastName || !user) {
      Alert.alert("Error", "Please fill in first and last name");
      return;
    }

    try {
      setLoading(true);
      const fighter = makeFighter(form, user.id);
      const { error } = await createFighter(fighter);
      
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Fighter created successfully!");
        router.back();
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

          {/* Attributes */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-muted uppercase">Attributes</Text>
              <Text className={`text-lg font-bold ${pts === 0 ? 'text-success' : 'text-warning'}`}>
                {pts}/90 pts
              </Text>
            </View>

            {Object.entries(ATTRIBUTE_CATEGORIES).map(([category, attrs]) => (
              <View key={category} className="gap-2">
                <Text className="text-xs text-muted">{category}</Text>
                {attrs.map((attr) => (
                  <View key={attr} className="flex-row items-center justify-between bg-background p-2 rounded">
                    <Text className="text-sm text-foreground flex-1">{attr}</Text>
                    <View className="flex-row items-center gap-2">
                      <Pressable
                        onPress={() => handlePt(attr, (form.points[attr] || 0) - 1)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <View className="w-8 h-8 bg-border rounded items-center justify-center">
                          <Text className="text-foreground font-bold">−</Text>
                        </View>
                      </Pressable>
                      <Text className="text-foreground font-bold w-8 text-center">
                        {form.points[attr] || 0}
                      </Text>
                      <Pressable
                        onPress={() => handlePt(attr, (form.points[attr] || 0) + 1)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <View className="w-8 h-8 bg-border rounded items-center justify-center">
                          <Text className="text-foreground font-bold">+</Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Create Button */}
          <Pressable
            onPress={create}
            disabled={!form.firstName || !form.lastName || loading}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View className={`rounded-lg py-4 items-center ${
              !form.firstName || !form.lastName || loading
                ? 'bg-border'
                : 'bg-primary'
            }`}>
              <Text className="text-background font-bold text-base">
                {loading ? 'Creating...' : 'Create Fighter'}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
