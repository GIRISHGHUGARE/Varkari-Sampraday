import { Link } from "expo-router";
import { Text, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Poppins_400Regular" }}>Hello World! Girish</Text>
      <Link href={"/post"}>post</Link>
    </View>
  );
}
