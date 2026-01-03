import { ScrollView, Text, View, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { supabase } from "@/lib/supabase-client";

export default function SignUpScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        Alert.alert("Sign Up Failed", error.message);
      } else if (data.user) {
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email to verify your account.",
          [{ text: "OK", onPress: () => router.replace("/sign-in" as any) }]
        );
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
            <Text className="text-xl font-semibold text-foreground">Create Account</Text>
            <Text className="text-sm text-muted text-center">
              Join the Onchain Fighting Association
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
                placeholder="At least 6 characters"
                placeholderTextColor="#9BA1A6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-surface border border-border p-4 text-foreground rounded-lg"
              />
              <Text className="text-xs text-muted">
                Must be at least 6 characters long
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Confirm Password</Text>
              <TextInput
                placeholder="Re-enter your password"
                placeholderTextColor="#9BA1A6"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-surface border border-border p-4 text-foreground rounded-lg"
              />
            </View>
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignUp}
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
                <Text className="text-background font-bold text-base">Create Account</Text>
              )}
            </View>
          </Pressable>

          {/* Terms */}
          <Text className="text-xs text-muted text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>

          {/* Divider */}
          <View className="flex-row items-center gap-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-xs text-muted">OR</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center gap-2">
            <Text className="text-muted">Already have an account?</Text>
            <Pressable
              onPress={() => router.replace("/sign-in" as any)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-primary font-semibold">Sign In</Text>
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
