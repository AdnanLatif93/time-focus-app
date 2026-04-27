import React, { useState } from 'react';
import {
  TextInput,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import useStyles from '@hooks/useStyles';
import { useTheme } from '@hooks/useTheme';
import ThemedText from './ThemedText';

interface ThemedInputProps {
  label?:         string;
  placeholder?:   string;
  value:          string;
  onChangeText:   (text: string) => void;
  error?:         string;
  multiline?:     boolean;
  rightIcon?:     React.ReactNode;
  style?:         StyleProp<ViewStyle>;
  inputStyle?:    StyleProp<TextStyle>;
  secureTextEntry?: boolean;
}

const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline    = false,
  rightIcon,
  style,
  inputStyle,
  secureTextEntry = false,
}) => {
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();

  const styles = useStyles((t) => ({
    wrapper: {
      gap: t.spacing.xs,
    },
    inputRow: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: t.colors.surface.card,
      borderRadius:    t.radius.md,
      borderWidth:     1,
      borderColor: error
        ? t.colors.feedback.danger.border
        : focused
          ? t.colors.brand.primary
          : t.colors.surface.border,
      paddingHorizontal: t.spacing.md,
      paddingVertical:   t.spacing.md,
    },
    input: {
      flex:       1,
      color:      t.colors.text.primary,
      fontSize:   t.typography.scale.body.fontSize,
      fontFamily: t.typography.fonts.sans,
      padding:    0, // Remove default Android padding
      minHeight:  multiline ? 80 : undefined,
      textAlignVertical: multiline ? 'top' : 'center',
    },
    iconWrapper: {
      marginLeft: t.spacing.sm,
    },
    errorText: {
      marginTop: t.spacing.xs,
    },
  }));

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <ThemedText variant="caption" color="secondary">
          {label}
        </ThemedText>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.muted}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
      </View>

      {error && (
        <ThemedText variant="caption" color="danger" style={styles.errorText}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};

export default ThemedInput;
