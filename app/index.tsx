import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Image, ScrollView, FlatList, KeyboardAvoidingView, TextInput, Platform, Keyboard, Alert } from 'react-native';
import tw from 'twrnc';

import { ThemedButton } from '@/components/ThemedButton'
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { DropdownComponent as Dropdown } from '@/components/Dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function index() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const dropdownData = [
    {label: 'Berdoa', value: 'doa'},
    {label: 'Mengsholatkan', value: 'sholat'},
    {label: 'Mengaji', value: 'ngaji'}
  ]

  const [initialLoad, setInitialLoad] = useState(true);
  const [accordion, setAccordion] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now()));
  const [ibadahType, setIbadahType] = useState<{ label: string; value: any } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const saveable = title.trim().length >= 3 && ibadahType;
  const [ibadahItems, setIbadahItems] =
  useState<{
    id: string;
    title: string;
    deadline: Date;
    ibadahType: any;
    state: boolean;
  }[]>([]);

  // Load Ibadah ketika halaman di mount
  useEffect(() => {
    loadIbadah();
  }, []);
  // Save Ibadah ketika ibadahItems berubah
  useEffect(() => {
    if (!initialLoad) {saveIbadah();setInitialLoad(false)}
  }, [ibadahItems]);

  const handleAddIbadah = () => {
    if (saveable) {
      Keyboard.dismiss();
      const newIbadah = {
        id: Date.now().toString(),
        title: title.trim(),
        deadline: deadline,
        ibadahType: ibadahType.value,
        state: false
      }

      setIbadahItems([...ibadahItems, newIbadah]);
      Alert.alert(
        'Berhasil menambah!',
        `ibadah: ${newIbadah.title}\ntipe: ${newIbadah.ibadahType}\ntanggal: ${new Date(newIbadah.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        `
      )
    }
  }

  const saveIbadah = async () => {
    try {
      const jsonIbadah = JSON.stringify(ibadahItems);
      await AsyncStorage.setItem('ibadahs', jsonIbadah);
      // if(ibadahItems.length > 0)
      // {
      //   console.log('Berhasil save:', ibadahItems)
      // } else {
      //   console.log('Tidak ada yang di save.')
      // }
    } catch (err) {
      console.log(err);
    }
  }

  const loadIbadah = async () => {
    try {
      const jsonIbadah = await AsyncStorage.getItem('ibadahs');
      const loadedIbadah = jsonIbadah ? JSON.parse(jsonIbadah) : [];
      setIbadahItems(loadedIbadah);
    } catch (err) {
      console.log(err)
    } finally {
      setInitialLoad(false);
    }
  }

  const startEdit = (item:any) => {
    console.log('starting edit on:', item.id)
    setIbadahType(item.ibadahType);
    setTitle(item.title);
    setDeadline(new Date(item.deadline));
    setIsEditing(true);
    setEditId(item.id);
  }

  const handleEdit = () => {
    const updated = ibadahItems.map(item =>
      item.id === editId
        ? {
            ...item,
            ibadahType: ibadahType?.value || '',
            title: title?.trim() || '',
            deadline: deadline
          }
        : item
    );
    
    resetInputs();
    setIbadahItems(updated);
    setIsEditing(false);
    setEditId('');
    Alert.alert('Berhasil edit!')
  };

  const completeIbadah = (id:string) => {
    const itemsCopy = ibadahItems.filter(ibadah => ibadah.id !== id);
    setIbadahItems(itemsCopy);
    const updatedHomeworks = ibadahItems.map(ibadah => {
      if (ibadah.id === id) {
        return { ...ibadah, state: !ibadah.state };
      }
      return ibadah;
    });
    setIbadahItems(updatedHomeworks);  }

  const deleteIbadah = (id: string) => {
    const itemsCopy = ibadahItems.filter(ibadah => ibadah.id !== id);
    setIbadahItems(itemsCopy);
    console.log('Deleted:', id)
  }

  const resetInputs = () => {
    setTitle('');
    setDeadline(new Date());
    setIbadahType(null);
  };

  return (
    <ThemedView darkColor='#151515' lightColor='white' style={tw`flex-1`}>
        <View style={tw`flex-1 w-full`}>
          <ThemedView style={tw`w-full pt-12 px-4 pb-4 bg-[${colors.tint}]`}>
            <ThemedText style={tw`text-xl font-bold text-white`}>
              Selamat datang kembali!
            </ThemedText>
            <ThemedText style={tw`text-white`}>
              Ibadah apa yang ingin dilakukan hari ini?
            </ThemedText>
          </ThemedView>
         
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`w-full flex-col justify-around pt-4 self-center gap-3 px-4`}
        >
          <ThemedButton onPress={() => setAccordion(!accordion)}>
            <ThemedText style={tw`text-xl font-bold`}>
              🕌 Ibadah Harian
            </ThemedText>
          </ThemedButton>

      {accordion && <View style={tw`mb-12`}>
        <View style={tw`flex-col gap-1 h-16`}>
          <ThemedText>
            Nama Ibadah
          </ThemedText>
          <TextInput style={tw`px-4 py-2 border border-${colorScheme == 'light' ? 'neutral-300' : 'neutral-600'} rounded-lg flex-1 text-[${colors.text}] text-sm bg-[${colors.secondary}]`}
            placeholder='Ibadah (contoh: hafalan al mulk)'
            placeholderTextColor={colors.textSecondary}
            onChangeText={(text) => setTitle(text)}
            value={title || ''}
          />
        </View>
        
        <View style={tw`flex-col gap-1 h-16 mb-1`}>
          <ThemedText>
            Tipe Ibadah
          </ThemedText>
          <Dropdown
          data={dropdownData}
          value={ibadahType?.value}
          onConfirm={(item) => setIbadahType(item)}
          />
        </View>
        
        <View style={tw`flex-col gap-1 h-16`}>
          <ThemedText>
            Tanggal Deadline
          </ThemedText>
          <View style={tw`flex-row gap-2 justify-between`}>
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (event.type === 'set' && selectedDate) {
                    setDeadline(selectedDate);
                  }
                  setShowDatePicker(false);
                }}
              />
            )}
            <ThemedButton style={tw`p-4 bg-[${colors.secondary}]`} onPress={() => setShowDatePicker(true)}>
              <ThemedText>
                Pilih Tanggal
              </ThemedText>
            </ThemedButton>
        
            <ThemedText>{new Date(deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</ThemedText>
            <ThemedButton style={tw`p-4 bg-[${colors.secondary}]`} onPress={isEditing ? handleEdit : handleAddIbadah  }>
              <ThemedText>
                Tambah
              </ThemedText>
            </ThemedButton>
          </View>
        </View>
      </View>}

        </KeyboardAvoidingView>

        <FlatList
          scrollEnabled={true}
          data={ibadahItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ThemedButton style={tw`px-4`} onPress={() => completeIbadah(item.id)}>
              <View style={tw`px-2 py-2 rounded-lg flex-row justify-between items-center bg-[${colors.secondary}]`}>
                <View style={tw`flex-row items-center justify-between flex-1`}>
                  <View style={tw`flex-row gap-4 items-center`}>
                    <Feather name={item.state ? 'check-square' : 'square'} size={24} color={colors.text}/>
                    <View style={tw`flex-col gap-1`}>
                      <ThemedText style={tw`text-[${item.state ? colors.textSecondary : colors.text}] font-bold text-lg`}>{item.title}</ThemedText>
                      <ThemedText style={tw`text-[${item.state ? colors.textSecondary : colors.text}]`}>📕 {item.ibadahType}</ThemedText>
                      <ThemedText style={tw`text-[${item.state ? colors.textSecondary : colors.text}]`}>
                        🗓️ {new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={tw`flex-row gap-1`}>
                    <ThemedButton style={tw`p-2 bg-[${'#032a4e'}]`} onPress={() => startEdit(item)}>
                      <FontAwesome5 name='pen' size={20} color='white'/>
                    </ThemedButton>
                    <ThemedButton style={tw`p-2 bg-[${'#8b1a10'}]`} onPress={() => deleteIbadah(item.id)}>
                      <FontAwesome5 name='trash-alt' size={20} color='white'/>
                    </ThemedButton>
                  </View>
                </View>
              </View>
            </ThemedButton>
          )}
        />
        </View>
    </ThemedView>
  );
};
