import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useAuthState } from "@/hooks/use-auth-state";
import { supabase } from "@/lib/supabase-client";

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuthState();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              Alert.alert("Success", "Signed out successfully", [
                { text: "OK", onPress: () => router.replace("/(tabs)") }
              ]);
            } catch (error) {
              Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign out");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted">
              Manage your account and preferences
            </Text>
          </View>

          {/* Account Section */}
          {user ? (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">Account</Text>
              
              <View className="bg-surface border border-border rounded-lg p-4 gap-3">
                <View className="gap-1">
                  <Text className="text-xs font-semibold text-muted uppercase">Email</Text>
                  <Text className="text-base text-foreground">{user.email}</Text>
                </View>

                <View className="h-px bg-border" />

                <View className="gap-1">
                  <Text className="text-xs font-semibold text-muted uppercase">User ID</Text>
                  <Text className="text-xs text-muted font-mono">{user.id}</Text>
                </View>

                <View className="gap-1">
                  <Text className="text-xs font-semibold text-muted uppercase">Account Created</Text>
                  <Text className="text-sm text-muted">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Logout Button */}
              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-error rounded-lg py-4 items-center">
                  <Text className="text-background font-bold text-base">Sign Out</Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <View className="gap-4">
              <View className="bg-surface border border-border rounded-lg p-6 items-center gap-3">
                <Text className="text-2xl">👤</Text>
                <Text className="text-foreground font-semibold text-center">
                  Not Signed In
                </Text>
                <Text className="text-sm text-muted text-center">
                  Sign in to sync your fighters and compete online
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/sign-in' as any)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-primary rounded-lg py-4 items-center">
                  <Text className="text-background font-bold text-base">Sign In</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => router.push('/sign-up' as any)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View className="bg-surface border border-border rounded-lg py-4 items-center">
                  <Text className="text-foreground font-semibold text-base">Create Account</Text>
                </View>
              </Pressable>
            </View>
          )}

          {/* App Info Section */}
          <View className="gap-4 mt-6">
            <Text className="text-lg font-semibold text-foreground">About</Text>
            
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <View className="gap-1">
                <Text className="text-xs font-semibold text-muted uppercase">App Name</Text>
                <Text className="text-base text-foreground">OFA - Onchain Fighting Association</Text>
              </View>

              <View className="h-px bg-border" />

              <View className="gap-1">
                <Text className="text-xs font-semibold text-muted uppercase">Version</Text>
                <Text className="text-sm text-muted">1.0.0</Text>
              </View>

              <View className="h-px bg-border" />

              <View className="gap-1">
                <Text className="text-xs font-semibold text-muted uppercase">Description</Text>
                <Text className="text-sm text-muted">
                  Create fighters, train them, and compete in the ultimate MMA league simulator
                </Text>
              </View>
            </View>
          </View>

          {/* Help Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Support</Text>
            
            <View className="bg-surface border border-border rounded-lg overflow-hidden">
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="p-4 flex-row items-center justify-between">
                  <Text className="text-foreground">Help & FAQ</Text>
                  <Text className="text-muted">→</Text>
                </View>
              </Pressable>

              <View className="h-px bg-border mx-4" />

              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="p-4 flex-row items-center justify-between">
                  <Text className="text-foreground">Privacy Policy</Text>
                  <Text className="text-muted">→</Text>
                </View>
              </Pressable>

              <View className="h-px bg-border mx-4" />

              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="p-4 flex-row items-center justify-between">
                  <Text className="text-foreground">Terms of Service</Text>
                  <Text className="text-muted">→</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
