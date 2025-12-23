import Toast from "react-native-toast-message";


export function customToastError({
  text1 = "Error",
  text2,
}: {
  text1: string;
  text2?: string;
}) {
  return Toast.show({
    type: 'error',
    text1,
    text2,
    visibilityTime: 10000,
    autoHide: false,
    text2NumberOfLines: 100,
  } as any);
}