import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { ActionModal } from '@/components/ui/ActionModal';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { TabItem } from '@/components/ui/TabItem';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const getColor = (focused: boolean) => {
    return focused ? Colors[colorScheme ?? 'light'].tabIconSelected
      : Colors[colorScheme ?? 'light'].tabIconDefault;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, size, focused }) => (
              <TabItem color={getColor(focused && !isModalVisible)} focused={focused && !isModalVisible}>
                <Entypo name="home" size={32} color={getColor(focused && !isModalVisible)} />
              </TabItem>
            ),
            tabBarButton: ({ children, style, onPress, onPressIn }) => (
              <Pressable
                style={style}
                onPress={onPress}
                onPressIn={onPressIn}
              >
                {children}
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, size, focused }) => (
              <TabItem color={getColor(isModalVisible)} focused={isModalVisible}>
                <Ionicons name="add" size={32} color={getColor(isModalVisible)} style={{ height: 30, marginTop: 1 }} />
              </TabItem>
            ),
            tabBarButton: ({ children, style }) => (
              <Pressable
                onPress={toggleModal}
                style={style}
              >
                {children}
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="usuario"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, size, focused }) => (
              <TabItem color={getColor(focused && !isModalVisible)} focused={focused && !isModalVisible}>
                <FontAwesome name="user" size={32} color={getColor(focused && !isModalVisible)} />
              </TabItem>
            ),
            tabBarButton: ({ children, style, onPress, onPressIn }) => (
              <Pressable
                style={style}
                onPress={onPress}
                onPressIn={onPressIn}
              >
                {children}
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen name="minhasHabilidades" options={{ href: null }} />
        <Tabs.Screen name="projetos" options={{ href: null }} />
        <Tabs.Screen name="metas" options={{ href: null }} />
        <Tabs.Screen name="cursos" options={{ href: null }} />
        <Tabs.Screen name="cadastroHabilidade" options={{ href: null }} />
        <Tabs.Screen name="cadastroProjeto" options={{ href: null }} />
        <Tabs.Screen name="cadastroMeta" options={{ href: null }} />
        <Tabs.Screen name="cadastroCurso" options={{ href: null }} />
        <Tabs.Screen name="cadastroUsuario" options={{ href: null }} />
        <Tabs.Screen name="recomendacoesCursos" options={{ href: null }} />
        <Tabs.Screen name="notificacoes" options={{ href: null }} />
      </Tabs>
      <ActionModal isVisible={isModalVisible} onClose={toggleModal} />
    </View>
  );
}
