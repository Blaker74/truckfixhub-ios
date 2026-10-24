import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BRAND } from "@/constants/truckfixhub";

const LOGO: ImageSourcePropType = require("@/assets/images/truckfixhub-logo.jpeg");

export function AppScreen({ children, contentStyle }: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, contentStyle]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.brandHeader, compact && styles.brandHeaderCompact]}>
      <Image source={LOGO} resizeMode="contain" style={compact ? styles.logoCompact : styles.logo} accessibilityLabel="TruckFixHub semi truck logo" />
      <Text style={styles.brandTagline}>KEEPING TRUCKING SIMPLE</Text>
    </View>
  );
}

export function PageHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.pageHeading}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? <Pressable onPress={onAction} hitSlop={8}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function Panel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function PrimaryButton({ label, onPress, icon, variant = "primary", disabled = false, style }: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "warning" | "quiet";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, buttonVariants[variant], disabled && styles.buttonDisabled, pressed && !disabled && styles.buttonPressed, style]}
    >
      {icon ? <Ionicons name={icon} size={18} color={variant === "secondary" || variant === "quiet" ? BRAND.navy : BRAND.card} /> : null}
      <Text style={[styles.buttonText, (variant === "secondary" || variant === "quiet") && styles.buttonTextDark]}>{label}</Text>
    </Pressable>
  );
}

export function RowCard({ title, subtitle, icon, onPress, trailing }: {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  trailing?: ReactNode;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.rowCard, pressed && styles.cardPressed]}>
      {icon ? <View style={styles.rowIcon}><Ionicons name={icon} size={21} color={BRAND.blue} /></View> : null}
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ?? <Ionicons name="chevron-forward" size={18} color={BRAND.muted} />}
    </Pressable>
  );
}

export function SearchField({ value, onChangeText, placeholder = "Search symptoms, systems, or codes" }: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.searchWrap}>
      <Ionicons name="search-outline" size={20} color={BRAND.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7b8b98"
        returnKeyType="search"
        autoCapitalize="none"
        style={styles.searchInput}
        accessibilityLabel={placeholder}
      />
      {value ? <Pressable onPress={() => onChangeText("")} accessibilityLabel="Clear search"><Ionicons name="close-circle" size={19} color={BRAND.muted} /></Pressable> : null}
    </View>
  );
}

export function FormField({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#8b9aa7"
        style={[styles.input, props.multiline && styles.inputMultiline, props.style]}
      />
    </View>
  );
}

export function Notice({ title, children, tone = "blue" }: { title?: string; children: ReactNode; tone?: "blue" | "yellow" | "red" }) {
  return (
    <View style={[styles.notice, noticeTones[tone]]}>
      {title ? <Text style={styles.noticeTitle}>{title}</Text> : null}
      <Text style={styles.noticeText}>{children}</Text>
    </View>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <Text style={styles.loading}>{label}</Text>;
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <Text style={styles.error}>{children}</Text>;
}

const buttonVariants = StyleSheet.create({
  primary: { backgroundColor: BRAND.blue, borderColor: BRAND.navy },
  secondary: { backgroundColor: "#ffffff", borderColor: BRAND.border },
  warning: { backgroundColor: BRAND.yellow, borderColor: BRAND.navy },
  quiet: { backgroundColor: "transparent", borderColor: "transparent" },
});

const noticeTones = StyleSheet.create({
  blue: { backgroundColor: "#e9f4fc", borderLeftColor: BRAND.blue },
  yellow: { backgroundColor: "#fff7d5", borderLeftColor: "#d39a00" },
  red: { backgroundColor: "#fff0f0", borderLeftColor: BRAND.red },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BRAND.canvas },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28, gap: 18 },
  brandHeader: { alignItems: "center", paddingTop: 3, gap: 3 },
  brandHeaderCompact: { paddingTop: 0, gap: 0 },
  logo: { width: 215, height: 144 },
  logoCompact: { width: 118, height: 78 },
  brandTagline: { color: BRAND.navy, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginTop: -12 },
  pageHeading: { gap: 5 },
  eyebrow: { color: BRAND.blue, fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  pageTitle: { color: BRAND.navy, fontSize: 29, fontWeight: "900", letterSpacing: -0.5 },
  pageSubtitle: { color: BRAND.muted, fontSize: 15, lineHeight: 22, marginTop: 1 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  sectionTitle: { color: BRAND.navy, fontSize: 18, fontWeight: "800" },
  sectionAction: { color: BRAND.blue, fontSize: 14, fontWeight: "800" },
  panel: { backgroundColor: BRAND.card, borderColor: BRAND.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  button: { minHeight: 50, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 16, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center" },
  buttonText: { color: BRAND.card, fontSize: 15, fontWeight: "800" },
  buttonTextDark: { color: BRAND.navy },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.88 },
  rowCard: { minHeight: 68, backgroundColor: BRAND.card, borderColor: BRAND.border, borderWidth: 1, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 12 },
  rowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#e9f4fc", alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1, gap: 3 },
  rowTitle: { color: BRAND.navy, fontSize: 15, fontWeight: "800" },
  rowSubtitle: { color: BRAND.muted, fontSize: 13, lineHeight: 18 },
  cardPressed: { backgroundColor: "#f0f7fc" },
  searchWrap: { minHeight: 54, backgroundColor: BRAND.card, borderColor: BRAND.border, borderWidth: 1.5, borderRadius: 15, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, minHeight: 50, color: BRAND.ink, fontSize: 15, paddingVertical: 0 },
  fieldGroup: { gap: 6 },
  fieldLabel: { color: BRAND.navy, fontSize: 13, fontWeight: "800" },
  input: { minHeight: 48, borderWidth: 1, borderColor: BRAND.border, borderRadius: 12, backgroundColor: "#ffffff", paddingHorizontal: 12, paddingVertical: 11, color: BRAND.ink, fontSize: 15 },
  inputMultiline: { minHeight: 100, textAlignVertical: "top" },
  notice: { borderLeftWidth: 4, paddingVertical: 12, paddingHorizontal: 13, borderRadius: 10, gap: 4 },
  noticeTitle: { color: BRAND.navy, fontSize: 14, fontWeight: "900" },
  noticeText: { color: BRAND.ink, fontSize: 13, lineHeight: 19 },
  loading: { color: BRAND.muted, fontSize: 14, paddingVertical: 8 },
  error: { color: "#b4232d", fontSize: 13, lineHeight: 19 },
});
