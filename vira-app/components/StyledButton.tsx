import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

type StyledButtonProps = TouchableOpacityProps & {
  title: string;
  type?: 'primary' | 'secondary';
};

export function StyledButton({ title, style, type = 'primary', ...rest }: StyledButtonProps) {
  // Koyu tema için renkler
  const isPrimary = type === 'primary';
  // Primary: Beyaz buton, koyu yazı
  // Secondary: Şeffaf buton, beyaz yazı
  const textColor = isPrimary ? Colors.dark.background : Colors.dark.text; // Primary için koyu yazı
  const backgroundColor = isPrimary ? Colors.dark.tint : 'transparent'; // Primary için beyaz arka plan
  const borderColor = Colors.dark.tint; // Kenar her zaman beyaz

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14, 
    paddingHorizontal: 24,
    borderRadius: 10, 
    borderWidth: 1.5,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});