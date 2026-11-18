import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#166534',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: false,

        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 20,
          right: 20,
          height: 66,
          borderRadius: 30,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,

          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: {
            width: 0,
            height: 8,
          },

          elevation: 10,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* SCAN */}
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: focused ? '#166534' : '#22C55E',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -2,

                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 5,
                },

                elevation: 8,
              }}
            >
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          ),
        }}
      />

      {/* CATEGORIES */}
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={25}
              color={color}
            />
          ),
        }}
      />

      {/* CATALOG */}
      <Tabs.Screen
        name="catalog"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'leaf' : 'leaf-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* FAVORITES */}
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* HISTORY */}
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* RUTAS OCULTAS */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}