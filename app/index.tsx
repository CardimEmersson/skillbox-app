import { AuthContext } from "@/contexts/authContext";
import { Redirect } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Page() {
  const { userAuth, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size={"large"} /></View>;
  }

  if (userAuth) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
