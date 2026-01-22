import { useFonts } from 'expo-font'; 
import * as SplashScreen from 'expo-splash-screen'; 
import {useEffect} from 'react';
import { Slot } from 'expo-router';
import '../../global.css';


SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
 const [loaded, error] = useFonts({
   'victor-mono': require('../../assets/fonts/VictorMono-VariableFont_wght.ttf'),
   'victor-mono-italic': require('../../assets/fonts/VictorMono-Italic-VariableFont_wght.ttf'),
   'sans-code': require('../../assets/fonts/GoogleSansCode-VariableFont_wght.ttf'),
   'sans-code-italic': require('../../assets/fonts/GoogleSansCode-Italic-VariableFont_wght.ttf'),
   'wenkai-mono-bold': require('../../assets/fonts/LXGWWenKaiMonoTC-Bold.ttf'),
   'wenkai-mono-light': require('../../assets/fonts/LXGWWenKaiMonoTC-Light.ttf'),
   'wenkai-mono-regular': require('../../assets/fonts/LXGWWenKaiMonoTC-Regular.ttf'),
   


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
  <Slot />
 )
}
