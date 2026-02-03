import { Stack } from "expo-router";

export default function HouseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="create-house" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="edit-house" />
    </Stack>
  );
}
