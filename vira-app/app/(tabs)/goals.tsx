import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Config';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type Goal = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
};

export default function GoalsScreen() {
  const { token, user, updateUserCategories } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const categories = user?.categories || [];
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Tümü');
  const [activeSort, setActiveSort] = useState<'yeni' | 'eski'>('yeni');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Genel');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => { if (token) fetchGoals(); }, [token]);

  const fetchGoals = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/goals/${token}`);
      setGoals(response.data);
    } catch (error) { console.error("Hedefler getirilemedi:", error); }
  };

  const handleDelete = (goalId: string) => {
    Alert.alert("Sil", "Bu hedefi silmek istediğine emin misin?", [
      { text: "Hayır" },
      { text: "Evet", onPress: async () => {
        try {
          await axios.delete(`${API_URL}/api/goals/delete/${goalId}`);
          fetchGoals();
        } catch (error) { Alert.alert("Hata", "Hedef silinemedi."); }
      }}
    ]);
  };

  const handleAddGoal = async () => {
    if (!title.trim() || !token) return;
    try {
      await axios.post(`${API_URL}/api/goals/add`, {
        userId: token, title, description, category: selectedCategory, deadline,
      });
      setModalVisible(false);
      fetchGoals();
      setTitle(''); setDescription(''); setSelectedCategory('Genel');
    } catch (error) { Alert.alert("Hata", "Hedef eklenemedi."); }
  };
  
  const toggleComplete = async (goal: Goal) => {
    try {
      await axios.patch(`${API_URL}/api/goals/update/${goal._id}`, {
        completed: !goal.completed,
      });
      fetchGoals();
    } catch (error) { Alert.alert("Hata", "Hedef güncellenemedi."); }
  };

  const handleAddNewCategory = () => {
    setNewCategoryName(''); 
    setCategoryModalVisible(true);
  };

  const handleSaveNewCategory = async () => {
    if (newCategoryName && newCategoryName.trim()) {
      const trimmedName = newCategoryName.trim();
      if (categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
        Alert.alert("Hata", "Bu kategori zaten mevcut.");
      } else {
        const newCategories = [...categories, trimmedName];
        try {
          await updateUserCategories(newCategories);
          setCategoryModalVisible(false);
        } catch (error) { Alert.alert("Hata", "Kategori eklenemedi."); }
      }
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    Alert.alert("Kategoriyi Sil", `'${categoryToDelete}' kategorisini silmek istediğine emin misin?`,
      [{ text: "Hayır" },
       { text: "Evet",
         onPress: async () => {
           const newCategories = categories.filter(cat => cat !== categoryToDelete);
           try {
             await updateUserCategories(newCategories); 
             if (selectedCategory === categoryToDelete) setSelectedCategory('Genel');
           } catch (error) { Alert.alert("Hata", "Kategori silinemedi."); }
         },
       }],
    );
  };

  const displayedGoals = useMemo(() => {
    let filtered = [...goals];

    if (activeCategoryFilter !== 'Tümü') {
      filtered = filtered.filter(goal => goal.category === activeCategoryFilter);
    }

    filtered.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
      if (activeSort === 'yeni') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return filtered;
  }, [goals, activeCategoryFilter, activeSort]);

  return (
    <ScreenBackground>
      <FlatList
        data={displayedGoals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <TouchableOpacity onPress={() => toggleComplete(item)}>
              <Ionicons name={item.completed ? "checkbox" : "square-outline"} size={24} color={item.completed ? Colors.dark.tint : Colors.dark.tabIconDefault} />
            </TouchableOpacity>
            <View style={styles.goalDetails}>
              <StyledText style={[styles.goalText, item.completed && styles.completedText]}>{item.title}</StyledText>
              <View style={styles.tagsContainer}>
                <View style={styles.categoryTag}><StyledText style={styles.tagText}>{item.category}</StyledText></View>
                {item.deadline && <StyledText style={styles.dateTag}>{new Date(item.deadline).toLocaleDateString('tr-TR')}</StyledText>}
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Ionicons name="trash-outline" size={22} color={Colors.dark.tabIconDefault} />
            </TouchableOpacity>
          </View>
        )}
        style={styles.listStyle}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={(
          <>
            <StyledText type="title" style={styles.title}>Hedefler</StyledText>
            <View style={styles.controlsContainer}>
              <StyledText style={styles.label}>Filtrele:</StyledText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Tümü', 'Genel', ...categories].map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.filterChip, activeCategoryFilter === cat && styles.activeFilterChip]}
                    onPress={() => setActiveCategoryFilter(cat)}
                  >
                    <StyledText style={activeCategoryFilter === cat ? styles.activeFilterText : styles.filterText}>{cat}</StyledText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.sortContainer}>
                <StyledText style={styles.label}>Sırala:</StyledText>
                <TouchableOpacity onPress={() => setActiveSort('yeni')} style={[styles.sortButton, activeSort === 'yeni' && styles.activeSortButton]}>
                   <StyledText style={activeSort === 'yeni' ? styles.activeSortText : styles.sortText}>Yeniden Eskiye</StyledText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveSort('eski')} style={[styles.sortButton, activeSort === 'eski' && styles.activeSortButton]}>
                   <StyledText style={activeSort === 'eski' ? styles.activeSortText : styles.sortText}>Eskiden Yeniye</StyledText>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={<StyledText style={styles.emptyText}>Henüz bir hedef eklemedin.</StyledText>}
      />
      
      {/* Yeni Hedef Modalı */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <BlurView intensity={90} tint="dark" style={styles.modalContent}>
            <ScrollView>
              <StyledText type="title" style={styles.modalTitle}>Yeni Hedef</StyledText>
              <StyledText style={styles.label}>Hedef Adı*</StyledText>
              <BlurView intensity={50} tint="dark" style={styles.inputOuterContainer}>
                <TextInput style={styles.textInput} value={title} onChangeText={setTitle} placeholder="Örn: 10 dakika yürüyüş yap" placeholderTextColor={Colors.dark.tabIconDefault} />
              </BlurView>
              <StyledText style={styles.label}>Açıklama</StyledText>
              <BlurView intensity={50} tint="dark" style={[styles.inputOuterContainer, { height: 100 }]}>
                <TextInput style={[styles.textInput, styles.textAreaInput]} value={description} onChangeText={setDescription} multiline placeholder="Detaylar..." placeholderTextColor={Colors.dark.tabIconDefault}/>
              </BlurView>
              
              <StyledText style={styles.label}>Kategori</StyledText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                {['Genel', ...categories].map(cat => (
                  <TouchableOpacity 
                    key={cat} style={[styles.categoryChip, selectedCategory === cat && styles.selectedCategoryChip]} 
                    onPress={() => setSelectedCategory(cat)}>
                    <StyledText style={selectedCategory === cat ? styles.selectedCategoryText : styles.categoryText}>{cat}</StyledText>
                    {cat !== 'Genel' && (
                      <TouchableOpacity style={styles.deleteChipIcon} onPress={() => handleDeleteCategory(cat)}>
                        <Ionicons name="close-circle" size={18} color={selectedCategory === cat ? Colors.dark.background : Colors.dark.tabIconDefault} />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.addCategoryChip} onPress={handleAddNewCategory}>
                    <Ionicons name="add" size={18} color={Colors.dark.text} />
                    <StyledText style={styles.categoryText}> Yeni Ekle</StyledText>
                </TouchableOpacity>
              </ScrollView>
              
              <StyledText style={styles.label}>Tarih</StyledText>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <StyledText style={{color: Colors.dark.text}}>{deadline.toLocaleDateString('tr-TR')}</StyledText>
              </TouchableOpacity>
              {showDatePicker && (<DateTimePicker value={deadline} mode="date" display="default" themeVariant='dark' // Koyu tema için
                  onChange={(event, selectedDate) => { setShowDatePicker(false); setDeadline(selectedDate || deadline); }}/>)}
              <StyledButton title="Ekle" onPress={handleAddGoal} style={{marginTop: 24}}/>
            </ScrollView>
          </BlurView>
        </Pressable>
      </Modal>

      {/* Yeni Kategori Modalı */}
      <Modal
        animationType="fade" transparent={true} visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}>
        <Pressable style={styles.smallModalOverlay} onPress={() => setCategoryModalVisible(false)}>
          <BlurView intensity={90} tint="dark" style={styles.smallModalContent}>
            <StyledText type="title" style={styles.modalTitleSmall}>Yeni Kategori Ekle</StyledText>
             <BlurView intensity={50} tint="dark" style={styles.inputOuterContainer}>
                <TextInput
                  style={styles.textInput} placeholder="Kategori Adı (Örn: Spor)"
                  placeholderTextColor={Colors.dark.tabIconDefault} value={newCategoryName}
                  onChangeText={setNewCategoryName}
                />
             </BlurView>
            <StyledButton title="Ekle" onPress={handleSaveNewCategory} style={{marginTop: 10}}/>
          </BlurView>
        </Pressable>
      </Modal>

      {/* Ekle Butonu */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color={Colors.dark.background} />
      </TouchableOpacity>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  title: {
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 12,
    color: Colors.dark.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  listStyle: { flex: 1, width: '100%', paddingTop: 10 },

  // 🔹 Hedef Kartları
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  goalDetails: { flex: 1, marginLeft: 12 },
  goalText: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'rgba(200,200,200,0.5)',
  },
  tagsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  tagText: { color: Colors.dark.text, opacity: 0.8, fontSize: 12 },
  dateTag: { color: 'rgba(180,180,200,0.8)', fontSize: 12 },

  // 🔹 Filtreler & Sıralama
  controlsContainer: { paddingHorizontal: 16, marginBottom: 12 },
  label: {
    color: 'rgba(200,200,200,0.7)',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 14,
    letterSpacing: 0.2,
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
    shadowColor: Colors.dark.tint,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  filterText: { color: Colors.dark.text },
  activeFilterText: { color: Colors.dark.background, fontWeight: '700' },
  sortContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  sortButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
    shadowColor: Colors.dark.tint,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  sortText: { color: Colors.dark.text },
  activeSortText: { color: Colors.dark.background, fontWeight: '700' },
  emptyText: {
    textAlign: 'center',
    color: 'rgba(200,200,200,0.6)',
    marginTop: 60,
    fontSize: 15,
  },

  // 🔹 Ekle Butonu
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: Colors.dark.tint,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.tint,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
  },

  // 🔹 Modal Arka Planı
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    padding: 24,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
    color: Colors.dark.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  inputOuterContainer: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
    overflow: 'hidden',
  },
  textInput: {
    color: Colors.dark.text,
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  // 🔹 Kategori Chip'leri
  categoryScrollView: { flexDirection: 'row', paddingVertical: 6 },
  categoryChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  selectedCategoryChip: {
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
  },
  categoryText: { color: Colors.dark.text, fontSize: 14 },
  selectedCategoryText: { color: Colors.dark.background, fontWeight: '700' },
  deleteChipIcon: { marginLeft: 6, padding: 2 },
  addCategoryChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 🔹 Küçük Modal
  smallModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  smallModalContent: {
    padding: 22,
    borderRadius: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  modalTitleSmall: {
    fontSize: 20,
    marginBottom: 16,
    color: Colors.dark.text,
    fontWeight: '800',
    textAlign: 'center',
  },
});
