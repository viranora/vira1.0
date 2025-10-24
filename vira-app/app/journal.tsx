import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Config';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type JournalEntry = {
  _id: string;
  content: string;
  date: string;
};

export default function JournalScreen() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (token) {
        fetchEntries();
    }
  }, [token]);

  const fetchEntries = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/journal/${token}`);
      setEntries(response.data);
    } catch (error) {
      console.error("Günlükler getirilemedi:", error);
      Alert.alert("Hata", "Günlükler sunucudan alınamadı.");
    }
  };

  const handleSave = async () => {
    if (!content.trim() || !token) return;
    try {
      await axios.post(`${API_URL}/api/journal/add`, { userId: token, content });
      setContent('');
      fetchEntries();
    } catch (error) {
      Alert.alert("Hata", "Günlük kaydedilemedi.");
    }
  };

  const handleDelete = (entryId: string) => {
    Alert.alert("Yazıyı Sil", "Bu yazıyı silmek istediğine emin misin?", [
      { text: "Hayır", style: "cancel" },
      { text: "Evet", onPress: async () => {
        try {
          await axios.delete(`${API_URL}/api/journal/delete/${entryId}`);
          fetchEntries();
        } catch (error) {
          Alert.alert("Hata", "Yazı silinemedi.");
        }
      }}
    ]);
  };

  return (
    <ScreenBackground>
       <View style={styles.container}>
         <StyledText type="title" style={{color: Colors.light.text}}>Günlük</StyledText>
         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{width: '100%'}}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Bugün içinden geçenler..."
            placeholderTextColor={Colors.light.tabIconDefault}
            value={content}
            onChangeText={setContent}
            selectionColor={Colors.light.text}
          />
          <StyledButton title="Kaydet" onPress={handleSave} style={{marginTop: 12}} />
         </KeyboardAvoidingView>
         <FlatList
           data={entries}
           keyExtractor={(item) => item._id}
           renderItem={({ item }) => (
             <View style={styles.entryItem}>
               <StyledText style={styles.entryContent}>{item.content}</StyledText>
               <View style={styles.entryFooter}>
                  <StyledText style={styles.entryDate}>{new Date(item.date).toLocaleDateString('tr-TR')}</StyledText>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                      <Ionicons name="trash-outline" size={20} color={Colors.light.tabIconDefault} />
                  </TouchableOpacity>
               </View>
             </View>
           )}
           style={{width: '100%', marginTop: 20}}
         />
       </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 10, backgroundColor: 'transparent', paddingHorizontal: 20 },
    input: {
      backgroundColor: Colors.light.cardBackground,
      borderWidth: 1,
      borderColor: Colors.light.cardBorder,
      color: Colors.light.text, 
      width: '100%', minHeight: 120,
      borderRadius: 10, padding: 16, fontSize: 16, marginTop: 20, textAlignVertical: 'top'
    },
    entryItem: {
      backgroundColor: Colors.light.cardBackground,
      borderWidth: 1,
      borderColor: Colors.light.cardBorder,
      padding: 16, borderRadius: 10,
      marginTop: 16
    },
    entryContent: { fontSize: 16, color: Colors.light.text },
    entryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    entryDate: { color: Colors.light.tabIconDefault, fontSize: 12 },
});