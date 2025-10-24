import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Config';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // BlurView import edildi
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from './StyledText';

export function Header() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    setMenuVisible(false);
    Alert.alert( "Kaleyi Terk Et", "Çıkış yapmak istediğine emin misin?",
      [ { text: "Hayır", style: "cancel" }, { text: "Evet", onPress: () => signOut() } ]
    );
  };

  const profileImageSource = user?.profileImageUrl 
    ? { uri: `${API_URL}${user.profileImageUrl}` } 
    : require('@/assets/images/default-pfp.png');

  return (
    // <View> yerine <BlurView> kullanıyoruz
    <BlurView 
      intensity={80} // Bulanıklık yoğunluğu
      tint="dark" // Koyu tema için ön ayar ('default', 'light', 'dark')
      style={styles.headerContainer}
    >
      <View style={styles.headerContent}> 
        <View /> 
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Image source={profileImageSource} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          {/* Menü için de BlurView kullanabiliriz */}
          <BlurView intensity={90} tint="dark" style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/profile'); }}>
              <Ionicons name="person-outline" size={20} color={Colors.dark.text} />
              <StyledText style={styles.menuText}>Profilim</StyledText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/settings'); }}>
              <Ionicons name="settings-outline" size={20} color={Colors.dark.text} />
              <StyledText style={styles.menuText}>Ayarlar</StyledText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={20} color={Colors.dark.text} />
              <StyledText style={styles.menuText}>Çıkış Yap</StyledText>
            </TouchableOpacity>
          </BlurView>
        </Pressable>
      </Modal>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { // BlurView'ın dış stil ayarları
    paddingTop: 50, // SafeArea için üst boşluk
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.glassBorder, // Cam kenarı
  },
  headerContent: { // İçerik için (BlurView'ın altındaki View)
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileImage: { 
    width: 36, 
    height: 36, 
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)', // Soluk dolgu
    borderColor: Colors.dark.glassBorder,
    borderWidth: 1,
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', // Karartma daha belirgin
    alignItems: 'flex-end' 
  },
  menuContainer: { // Menü artık BlurView stili
    marginTop: 90,
    marginRight: 16,
    // backgroundColor kaldırıldı, BlurView hallediyor
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder, 
    borderRadius: 10, // Daha yuvarlak
    padding: 8,
    width: 180,
    overflow: 'hidden', // BlurView için önemli
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 8 
  },
  menuText: { 
    color: Colors.dark.text, // Metin rengi açık
    fontSize: 16, 
    marginLeft: 12 
  },
});