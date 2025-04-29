/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#33bdff';
const tintColorDark = '#0086ff';

export const Colors = {
  light: {
    default: '#000',
    secondary: '#e6e6e6',
    textSecondary: '#808080',
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    red: '#f74040'
  },
  dark: {
    default: '#fff',
    secondary: '#2a2a2a',
    textSecondary: '#999999',
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    red: '#f74040'
  },
};
