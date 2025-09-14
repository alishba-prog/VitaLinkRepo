import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#ffffff' },
          animation: 'slide_from_right', // Smooth transitions between auth screens
        }}
      >
        {/* <Stack.Screen 
          name="SplashScreen" 

        /> */}
        <Stack.Screen 
          name="HomeScreen" 

        />
        <Stack.Screen 
          name="Login" 

        />
        <Stack.Screen 
          name="SignUpScreen" 

        />
        <Stack.Screen 
          name="Forgot" 
        />
        <Stack.Screen 
          name="UserScreen" 
        />
        
        
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
