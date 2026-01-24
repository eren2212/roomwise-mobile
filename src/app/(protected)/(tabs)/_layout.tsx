import { useColorScheme } from "react-native";
import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import COLORS from "@/theme/color";

export default function TabLayout() {
  const scheme = useColorScheme(); // "dark" | "light" | null

  const tabColor = scheme === "dark" ? "white" : "black";

  return (
    <NativeTabs
      labelStyle={{
        color: tabColor,
      }}
      tintColor={tabColor}
    >
      <NativeTabs.Trigger name="index" >
        <Label hidden />
        <Icon
          src={
            <VectorIcon
              family={MaterialIcons}
              name="swipe"
            />
          }
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Label hidden />
        <Icon
          sf={{ default: "magnifyingglass", selected: "magnifyingglass" }} drawable="search_drawable"
        />
      </NativeTabs.Trigger>

      
      <NativeTabs.Trigger name="home">
        <Label hidden />
        <Icon sf={{ default: "house.fill", selected: "house.fill" }} drawable="home_drawable" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="chat">
        <Label hidden />
        <Icon
          src={<VectorIcon
            family={MaterialIcons}
            name="chat-bubble"
          />}
        />
      </NativeTabs.Trigger>

      
      <NativeTabs.Trigger name="profile">
        <Label hidden />
        <Icon
          src={
            <VectorIcon
              family={FontAwesome5}
              name="user-alt"
            />
          }
        />
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
