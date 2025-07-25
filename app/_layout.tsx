import { useColorScheme } from '@/hooks/useColorScheme';
import NetInfo from '@react-native-community/netinfo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {!isConnected && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            ⚠️ No estás conectado a internet
          </Text>
        </View>
      )}
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="SearchScreen" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 40,
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});
