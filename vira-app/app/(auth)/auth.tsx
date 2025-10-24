import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Alert, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const { signIn, signUp } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleAuth = async () => {
    if (!username || !password) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre boş bırakılamaz.');
      return;
    }
    try {
      if (isLogin) {
        await signIn({ username, password });
      } else {
        await signUp({ username, password });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Bir şeyler ters gitti.";
      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <ScreenBackground>
       <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.content}>
          <StyledText type="title" style={styles.title}>{isLogin ? "Giriş Yap" : "Kayıt Ol"}</StyledText>
          
          {/* Inputlar için BlurView sarmalayıcı */}
          <BlurView intensity={50} tint="dark" style={styles.inputOuterContainer}>
            <TextInput 
              style={styles.textInput} 
              placeholder="Kullanıcı Adı" 
              value={username} 
              onChangeText={setUsername} 
              autoCapitalize="none" 
              placeholderTextColor={Colors.dark.tabIconDefault} 
              selectionColor={Colors.dark.text}
            />
          </BlurView>

          <BlurView intensity={50} tint="dark" style={styles.inputOuterContainer}>
            <TextInput 
              style={styles.textInput} 
              placeholder="Şifre" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor={Colors.dark.tabIconDefault}
              selectionColor={Colors.dark.text}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.dark.tabIconDefault} />
            </TouchableOpacity>
          </BlurView>
          
          <StyledButton title={isLogin ? "Giriş Yap" : "Kayıt Ol"} onPress={handleAuth} style={styles.button} />
          
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <StyledText style={styles.toggleText}>
              {isLogin ? "Kayıt ol." : "Zaten bir hesabın var mı? Giriş yap."}
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'transparent' },
    content: { flex: 1, justifyContent: 'center' },
    title: { textAlign: 'center', marginBottom: 24, color: Colors.dark.text }, 
    button: { width: '100%', marginTop: 10 },
    toggleText: { textAlign: 'center', marginTop: 20, color: Colors.dark.tint }, 
    
    inputOuterContainer: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.dark.glassBorder, 
      marginBottom: 16,
      overflow: 'hidden', 
      flexDirection: 'row',
      alignItems: 'center', 
      paddingHorizontal: 14, 
    },

    textInput: {
        flex: 1, 
        color: Colors.dark.text, 
        fontSize: 16,
        paddingVertical: 14,
        backgroundColor: 'transparent',
    },
    eyeIcon: {
        paddingLeft: 10,
    }
});