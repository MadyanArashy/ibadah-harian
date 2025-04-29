import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import tw from 'twrnc';
import { ThemedText } from './ThemedText';

type ThemedButtonProps = {
  route?: any;
  LightColor?: string;
  DarkColor?: string;
  style?: StyleProp<ViewStyle>;
  inline?: boolean;
  transparent?: boolean;
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean | undefined;
}

const ThemedButton = ({LightColor = 'transparent', DarkColor = 'transparent', style, inline, route, transparent, children, onPress, disabled}: ThemedButtonProps) => {

  const bgColor = useThemeColor({ light: LightColor, dark: DarkColor }, 'text');
  const router = useRouter();
  let buttonContent = route && !onPress ? (
    <TouchableOpacity style={[tw`rounded-xl`]} onPress={() => router.push(route)} disabled={disabled}>
      <View style={[tw`rounded-lg py-3 bg-[${transparent ? 'transparent' : bgColor}] ${transparent ? 'border' : ''} border-[${transparent ? bgColor : 'none'}]`, style]}>
        {children}
      </View>
    </TouchableOpacity>
  ) : 
  <TouchableOpacity style={[tw`rounded-xl`]} onPress={onPress} disabled={disabled}>
    <View style={[tw`rounded-lg py-3 bg-[${transparent ? 'transparent' : bgColor}] ${transparent ? 'border' : ''} border-[${transparent ? bgColor : 'none'}]`, style]}>
      {children}
    </View>
  </TouchableOpacity>
  return inline ? (
    <Text style={tw`text-center`}>{buttonContent}</Text>
  ) : (
    buttonContent
  )
}
const styles = StyleSheet.create({
  default: {
    fontSize: 22,
    lineHeight: 24,
  },
})

export { ThemedButton };

