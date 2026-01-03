import { ScrollView, Text, View, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { supabase } from "@/lib/supabase-client";

export default function SignInScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        Alert.alert("Sign In Failed", error.message);
      } else if (data.user) {
        Alert.alert("Success", "Signed in successfully!", [
          { text: "OK", onPress: () => router.replace("/(tabs)") }
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
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-8">
          {/* Header */}
          <View className="items-center gap-3">
            <Text className="text-5xl font-bold text-primary">OFA</Text>
            <Text className="text-xl font-semibold text-foreground">Welcome Back</Text>
            <Text className="text-sm text-muted text-center">
              Sign in to manage your fighters and compete
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor="#9BA1A6"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                className="bg-surface border border-border p-4 text-foreground rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9BA1A6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-surface border border-border p-4 text-foreground rounded-lg"
              />
            </View>

            <Pressable
              onPress={() => router.push('/forgot-password')}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-primary text-sm text-right">Forgot Password?</Text>
            </Pressable>
          </View>

          {/* Sign In Button */}
          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View className={`rounded-lg py-4 items-center ${
              loading ? 'bg-border' : 'bg-primary'
            }`}>
              {loading ? (
                <ActivityIndicator color={colors.foreground} />
              ) : (
                <Text className="text-background font-bold text-base">Sign In</Text>
              )}
            </View>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center gap-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-xs text-muted">OR</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center gap-2">
            <Text className="text-muted">Don't have an account?</Text>
            <Pressable
              onPress={() => router.push('/sign-up')}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-primary font-semibold">Sign Up</Text>
            </Pressable>
          </View>

          {/* Guest Mode */}
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View className="bg-surface border border-border rounded-lg py-3 items-center">
              <Text className="text-foreground font-semibold">Continue as Guest</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
