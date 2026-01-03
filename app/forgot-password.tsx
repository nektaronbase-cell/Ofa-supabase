import { ScrollView, Text, View, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { supabase } from "@/lib/supabase-client";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: 'ofa://reset-password',
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <ScreenContainer>
        <View className="flex-1 px-6 justify-center items-center gap-6">
          <View className="w-20 h-20 bg-success/20 rounded-full items-center justify-center">
            <Text className="text-4xl">✉️</Text>
          </View>
          
          <View className="gap-3 items-center">
            <Text className="text-2xl font-bold text-foreground text-center">
              Check Your Email
            </Text>
            <Text className="text-sm text-muted text-center">
              We've sent password reset instructions to{'\n'}
              <Text className="text-foreground font-semibold">{email}</Text>
            </Text>
          </View>

          <View className="gap-4 w-full max-w-sm">
            <Pressable
              onPress={() => router.replace("/sign-in" as any)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View className="bg-primary rounded-lg py-4 items-center">
                <Text className="text-background font-bold text-base">Back to Sign In</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setSent(false)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-primary text-sm text-center">
                Didn't receive the email? Try again
              </Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-8">
          {/* Header */}
          <View className="gap-3">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-primary font-semibold">← Back</Text>
            </Pressable>
            
            <Text className="text-3xl font-bold text-foreground">Forgot Password?</Text>
            <Text className="text-sm text-muted">
              No worries! Enter your email address and we'll send you instructions to reset your password.
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
          </View>

          {/* Reset Button */}
          <Pressable
            onPress={handleResetPassword}
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
                <Text className="text-background font-bold text-base">Send Reset Link</Text>
              )}
            </View>
          </Pressable>

          {/* Info */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-2">
            <Text className="text-xs font-semibold text-foreground">💡 Tip</Text>
            <Text className="text-xs text-muted">
              Check your spam folder if you don't see the email within a few minutes.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
