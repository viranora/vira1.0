import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Config';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, token, updateUser, updateUserStatus } = useAuth();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusText, setStatusText] = useState(user?.status || 'Buraya durumunuzu girin');

  useEffect(() => {
    if (user) {
      setStatusText(user.status);
    }
  }, [user]);

  const handleSaveStatus = async () => {
    if (!user) return;
    try {
      await updateUserStatus(statusText);
      setIsEditingStatus(false); 
    } catch (error) {
      Alert.alert("Hata", "Durum güncellenemedi.");
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("İzin Gerekli", "Profil fotoğrafı seçmek için galeriye erişim izni vermen gerekiyor.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.5, 
    });

    if (pickerResult.canceled) {
      return;
    }
    
    const asset = pickerResult.assets[0];
    const formData = new FormData();
    formData.append('profileImage', {
        uri: asset.uri,
        name: `profile_${token}.jpg`,
        type: 'image/jpeg'
    } as any);

    try {
        const response = await fetch(`${API_URL}/api/upload/profile-picture/${token}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const updatedUser = await response.json();

        if (response.ok) {
            await updateUser(updatedUser);
            Alert.alert("Başarılı", "Profil fotoğrafın güncellendi.");
        } else {
            throw new Error(updatedUser.message || "Yükleme başarısız");
        }
    } catch (error) {
        console.error("Fotoğraf yükleme hatası:", error);
        Alert.alert("Hata", "Fotoğraf yüklenirken bir sorun oluştu.");
    }
  };

  if (!user) {
    return (
      <ScreenBackground>
        <View style={styles.container}><StyledText>Kullanıcı bilgileri yükleniyor...</StyledText></View>
      </ScreenBackground>
    );
  }

  const profileImageSource = user.profileImageUrl 
    ? { uri: `${API_URL}${user.profileImageUrl}` } 
    : require('@/assets/images/default-pfp.png');

  return (
    <ScreenBackground>
       <View style={styles.container}>
         <TouchableOpacity onPress={handlePickImage}>
          <Image 
            source={profileImageSource}
            style={styles.profileImage} 
          />
          <View style={styles.cameraIconContainer}>
              <Ionicons name="camera-outline" size={20} color={Colors.light.tint} />
          </View>
         </TouchableOpacity>
         
         <StyledText type="title" style={styles.username}>{user.username}</StyledText>
         
         <View style={styles.bioContainer}>
          {isEditingStatus ? (
            <>
              <TextInput
                style={styles.bioInput}
                value={statusText}
                onChangeText={setStatusText}
                autoFocus={true}
                maxLength={100}
                onBlur={handleSaveStatus}
                selectionColor={Colors.light.tint}
              />
              <TouchableOpacity style={styles.saveStatusButton} onPress={handleSaveStatus}>
                <StyledText style={{color: 'white'}}>Kaydet</StyledText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.bioTextContainer} onPress={() => setIsEditingStatus(true)}>
              <StyledText style={styles.bioText}>"{statusText}"</StyledText>
              <Ionicons name="pencil-outline" size={16} color={Colors.light.tabIconDefault} style={{marginLeft: 8}}/>
            </TouchableOpacity>
          )}
         </View>
       </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 40, backgroundColor: 'transparent' },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: Colors.light.cardBorder },
    cameraIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: Colors.light.background,
      borderRadius: 15,
      padding: 5,
      borderWidth: 1,
      borderColor: Colors.light.cardBorder,
    },
    username: { marginTop: 16, color: Colors.light.text },
    bioContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: Colors.light.cardBackground,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        borderRadius: 10,
        width: '90%',
        minHeight: 80,
        justifyContent: 'center'
    },
    bioTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bioText: {
      color: Colors.light.text,
      opacity: 0.8,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    bioInput: {
      color: Colors.light.text,
      fontSize: 16,
      textAlign: 'center',
    },
    saveStatusButton: {
      alignSelf: 'flex-end',
      marginTop: 8,
      backgroundColor: Colors.light.tint,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
});