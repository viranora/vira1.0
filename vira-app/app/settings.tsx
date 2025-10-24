import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Config';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { token, updateUser } = useAuth();
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim() || !currentPassword.trim()) {
      Alert.alert("Hata", "Tüm alanları doldurun.");
      return;
    }
    try {
      const response = await axios.patch(`${API_URL}/api/auth/users/${token}/username`, {
        currentPassword, newUsername
      });
      await updateUser(response.data);
      Alert.alert("Başarılı", "Kullanıcı adın güncellendi.");
      resetStatesAndClose();
    } catch (error: any) {
      Alert.alert("Hata", error.response?.data?.message || "Bir sorun oluştu.");
    }
  };

  const handleUpdatePassword = async () => {
     if (!newPassword.trim() || !currentPassword.trim()) {
      Alert.alert("Hata", "Tüm alanları doldurun.");
      return;
    }
    try {
      await axios.patch(`${API_URL}/api/auth/users/${token}/password`, {
        currentPassword, newPassword
      });
      Alert.alert("Başarılı", "Şifren güncellendi.");
      resetStatesAndClose();
    } catch (error: any) {
      Alert.alert("Hata", error.response?.data?.message || "Bir sorun oluştu.");
    }
  };
  
  const resetStatesAndClose = () => {
      setUsernameModalVisible(false);
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      setIsCurrentPasswordVisible(false);
      setIsNewPasswordVisible(false);
  };

  return (
    <ScreenBackground>
       <View style={styles.container}>
         <StyledText type="title" style={{color: Colors.light.text}}>Ayarlar</StyledText>
         <View style={styles.listContainer}>
          <TouchableOpacity style={styles.settingItem} onPress={() => setUsernameModalVisible(true)}>
            <StyledText style={styles.settingText}>Kullanıcı Adı Değiştir</StyledText>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => setPasswordModalVisible(true)}>
            <StyledText style={styles.settingText}>Şifre Değiştir</StyledText>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <StyledText style={styles.settingText}>Tema Değiştir</StyledText>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
          </TouchableOpacity>
         </View>

         {/* Kullanıcı Adı Değiştirme Modalı */}
         <Modal visible={usernameModalVisible} transparent={true} animationType="fade">
           <Pressable style={styles.modalOverlay} onPress={resetStatesAndClose}>
             <Pressable style={styles.modalContent}>
               <TouchableOpacity style={styles.closeButton} onPress={resetStatesAndClose}>
                  <Ionicons name="close-circle" size={30} color={Colors.light.tabIconDefault} />
               </TouchableOpacity>

               <StyledText style={styles.modalTitle}>Kullanıcı Adı Değiştir</StyledText>
               
               <View style={styles.inputContainer}>
                 <TextInput 
                   style={styles.textInput} 
                   placeholder="Yeni Kullanıcı Adı" 
                   value={newUsername} 
                   onChangeText={setNewUsername} 
                   placeholderTextColor={Colors.light.tabIconDefault} 
                   autoCapitalize="none"
                 />
               </View>
               
               <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.textInput} 
                    placeholder="Mevcut Şifren" 
                    value={currentPassword} 
                    onChangeText={setCurrentPassword} 
                    secureTextEntry={!isCurrentPasswordVisible} 
                    placeholderTextColor={Colors.light.tabIconDefault}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}>
                      <Ionicons name={isCurrentPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.light.tabIconDefault} />
                  </TouchableOpacity>
               </View>

               <StyledButton title="Güncelle" onPress={handleUpdateUsername} style={{marginTop: 10}}/>
             </Pressable>
           </Pressable>
         </Modal>
         
         {/* Şifre Değiştirme Modalı */}
         <Modal visible={passwordModalVisible} transparent={true} animationType="fade">
           <Pressable style={styles.modalOverlay} onPress={resetStatesAndClose}>
             <Pressable style={styles.modalContent}>
               <TouchableOpacity style={styles.closeButton} onPress={resetStatesAndClose}>
                  <Ionicons name="close-circle" size={30} color={Colors.light.tabIconDefault} />
               </TouchableOpacity>

               <StyledText style={styles.modalTitle}>Şifre Değiştir</StyledText>

               <View style={styles.inputContainer}>
                  <TextInput style={styles.textInput} placeholder="Mevcut Şifren" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={!isCurrentPasswordVisible} placeholderTextColor={Colors.light.tabIconDefault}/>
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}>
                      <Ionicons name={isCurrentPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.light.tabIconDefault} />
                  </TouchableOpacity>
               </View>
               
               <View style={styles.inputContainer}>
                  <TextInput style={styles.textInput} placeholder="Yeni Şifre" value={newPassword} onChangeText={setNewPassword} secureTextEntry={!isNewPasswordVisible} placeholderTextColor={Colors.light.tabIconDefault}/>
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                      <Ionicons name={isNewPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.light.tabIconDefault} />
                  </TouchableOpacity>
               </View>

               <StyledButton title="Güncelle" onPress={handleUpdatePassword} style={{marginTop: 10}}/>
             </Pressable>
           </Pressable>
         </Modal>
       </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 10, backgroundColor: 'transparent', paddingHorizontal: 20},
    listContainer: { width: '100%', marginTop: 30 },
    settingItem: { 
      backgroundColor: Colors.light.cardBackground, 
      borderWidth: 1,
      borderColor: Colors.light.cardBorder, 
      paddingVertical: 20, paddingHorizontal: 16, borderRadius: 10, marginBottom: 12, 
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' 
    },
    settingText: { fontSize: 16, color: Colors.light.text },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { 
      backgroundColor: Colors.light.background, 
      borderColor: 'rgba(0,0,0,0.1)', 
      borderWidth: 1,
      padding: 22, paddingTop: 45, borderRadius: 20, width: '90%', position: 'relative' 
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.light.text, marginBottom: 20, textAlign: 'center' },
    eyeIcon: { padding: 4, },
    closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 1, },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)', 
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)', 
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 14,
    },
    textInput: { 
        flex: 1, 
        color: Colors.light.text, 
        fontSize: 16,
        paddingVertical: 14,
    },
});