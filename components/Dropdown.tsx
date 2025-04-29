import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome5 } from '@expo/vector-icons';

type dropdownItems = {
  label: string;
  value: any;
}

type dropdownProps = {
  data: dropdownItems[];
  onConfirm: (value: any) => void;
  value: any;
}

const DropdownComponent = ({data, onConfirm, value}: dropdownProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isFocus, setIsFocus] = useState(false);


  return (
    <Dropdown 
    data={data}
    value={value}
    onChange={item => {
      onConfirm(item)
      setIsFocus(false);
    }}
    onFocus={() => setIsFocus(true)}
    onBlur={() => setIsFocus(false)}
    labelField={'label'}
    valueField={'value'}
    placeholder={isFocus ? 'Pilih opsi' : 'Tipe ibadah'}
    placeholderStyle={tw`text-[${colors.textSecondary}] text-sm`}
    selectedTextStyle={tw`text-[${colors.text}] text-sm`}
    style={tw`px-4 py-2 bg-[${colors.secondary}] rounded-xl border border-${colorScheme == 'light' ? 'neutral-300' : 'neutral-500'}`}
    containerStyle={tw`bg-[${colors.background}] border border-${colorScheme == 'light' ? 'neutral-300' : 'neutral-500'} shadow-lg text-[${colors.text}]`}
    activeColor={colors.secondary}
    renderLeftIcon={() => (
      <FontAwesome5 name={'pray'} color={isFocus ? colors.tabIconSelected : colors.tabIconDefault} style={tw`mr-2 `} size={24}/>
    )}
    renderItem={(item) => (
      <View
      style={tw`px-4 py-2`}
    >
      <Text style={tw`text-sm text-[${colors.text}]`}> {/* ganti warna teks */}
        {item.label}
      </Text>
    </View>
    )}
    />
  );
};

export { DropdownComponent };
