import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PanoScreen() {
  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.cardContainer}>
          
          {/* Günlük Kartı */}
          <TouchableOpacity style={styles.touchableCard} onPress={() => router.push('/journal')}>
             <BlurView intensity={50} tint="dark" style={styles.card}>
                <StyledText style={styles.cardTitle}>Günlük</StyledText>
                <StyledText style={styles.cardSubtitle}>Bugün içini dök.</StyledText>
             </BlurView>
          </TouchableOpacity>
          
          {/* İyi Hisset Kartı */}
          <TouchableOpacity style={styles.touchableCard} onPress={() => router.push('/motivation')}>
             <BlurView intensity={50} tint="dark" style={styles.card}>
                <StyledText style={styles.cardTitle}>İyi Hisset</StyledText>
                <StyledText style={styles.cardSubtitle}>Rastgele bir kart çek.</StyledText>
             </BlurView>
          </TouchableOpacity>

          {/* Zamanlayıcı Kartı */}
          <TouchableOpacity style={styles.touchableCard} onPress={() => router.push('/timer')}>
             <BlurView intensity={50} tint="dark" style={styles.card}>
                <StyledText style={styles.cardTitle}>Zamanlayıcı</StyledText>
                <StyledText style={styles.cardSubtitle}>Odaklan veya dinlen.</StyledText>
             </BlurView>
          </TouchableOpacity>
          
          {/* Kronometre Kartı */}
          <TouchableOpacity style={styles.touchableCard} onPress={() => router.push('/stopwatch')}>
             <BlurView intensity={50} tint="dark" style={styles.card}>
                <StyledText style={styles.cardTitle}>Kronometre</StyledText>
                <StyledText style={styles.cardSubtitle}>Süreyi ölç.</StyledText>
             </BlurView>
          </TouchableOpacity>

        </View>

        {/* Alıntı Kartı */}
        <BlurView intensity={50} tint="dark" style={styles.quoteCard}>
           <StyledText style={styles.quoteText}>"En karanlık gece bile sona erer ve güneş tekrar doğar."</StyledText>
        </BlurView>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
  paddingTop: 26, 
  paddingBottom: 100,
  backgroundColor: 'transparent',
},

  cardContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  marginTop: 26, 
},
  touchableCard: {
    width: '48%',
    marginBottom: 16, 
  },
  card: { 
    height: 180, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: Colors.dark.glassBorder, 
    padding: 20, 
    justifyContent: 'flex-end', 
    overflow: 'hidden',  
  },
   
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark.text,  
  },
   
  cardSubtitle: {
    fontSize: 14,
    color: Colors.dark.text,
    opacity: 0.7,
    marginTop: 4,
  },
 
  quoteCard: { 
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,  
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 4,
    overflow: 'hidden',  
  },
   
  quoteText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});