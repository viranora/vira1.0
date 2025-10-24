import { API_URL } from '@/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  _id: string;
  username: string;
  categories: string[];
  status: string;
  profileImageUrl?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (data: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => void;
  updateUser: (newUser: User) => Promise<void>;
  updateUserCategories: (newCategories: string[]) => Promise<void>;
  updateUserStatus: (newStatus: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user_token');
        const storedUser = await AsyncStorage.getItem('user_data');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) { 
        console.error("Hafızadan veri yüklenemedi", e); 
      } finally { 
        setLoading(false); 
      }
    };
    loadDataFromStorage();
  }, []);
  
  const handleAuthResponse = async (response: any) => {
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    await AsyncStorage.setItem('user_token', newToken);
    await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
    router.replace('/(tabs)/pano');
  };

  const signUp = async (data: any) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, data);
    await handleAuthResponse(response);
  };

  const signIn = async (data: any) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, data);
    await handleAuthResponse(response);
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_data');
    router.replace('/(auth)');
  };
  
  const updateUser = async (newUser: User) => {
    setUser(newUser);
    await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
  };

  const updateUserCategories = async (newCategories: string[]) => {
    if (!token || !user) return;
    try {
      await axios.patch(`${API_URL}/api/auth/users/${token}/categories`, { categories: newCategories });
      const updatedUser = { ...user, categories: newCategories };
      await updateUser(updatedUser);
    } catch (error) {
      console.error("Kategoriler sunucuya kaydedilemedi:", error);
      throw error;
    }
  };

  const updateUserStatus = async (newStatus: string) => {
    if (!token || !user) return;
    try {
      const response = await axios.patch(`${API_URL}/api/auth/users/${token}/status`, { status: newStatus });
      await updateUser(response.data);
    } catch (error) {
      console.error("Durum sunucuya kaydedilemedi:", error);
      throw error;
    }
  };

  if (loading) { return null; }

  return (
    <AuthContext.Provider value={{ token, user, loading, signIn, signUp, signOut, updateUser, updateUserCategories, updateUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
};