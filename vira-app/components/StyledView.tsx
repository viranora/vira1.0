import { useThemeColor } from '@/hooks/use-theme-color';
import { View, type ViewProps } from 'react-native';

export type StyledViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function StyledView({ style, lightColor, darkColor, ...otherProps }: StyledViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}