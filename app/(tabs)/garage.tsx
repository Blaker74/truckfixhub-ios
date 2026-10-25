import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Text, View } from "react-native";

import { AppScreen, ErrorText, FormField, Notice, PageHeading, Panel, PrimaryButton, RowCard, SectionHeading } from "@/components/brand-ui";
import { BRAND } from "@/constants/truckfixhub";
import { useAuth } from "@/lib/auth-context";
import { PRIVATE_TOOLS, ToolId } from "@/lib/private-tools";
import { supabase } from "@/lib/supabase";

const PRIVACY_URL = "https://truckfixhub.com/privacy.html";
const SUPPORT_EMAIL = "support@truckfixhub.com";

export default function GarageScreen() {
  const { user, loading, signOut } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "create" | "forgot">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setMessage("");
    if (!email.trim()) { setError("Enter the email address for your TruckFixHub account."); return; }
    if (mode !== "forgot" && password.length < 6) { setError("Enter a password of at least 6 characters."); return; }
    setBusy(true);
    try {
      if (mode === "sign-in") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      } else if (mode === "create") {
        const { error: authError } = await supabase.auth.signUp({ email: email.trim(), password });
        if (authError) throw authError;
        setMessage("Check your email for a confirmation link, then return here to sign in.");
        setMode("sign-in");
        setPassword("");
      } else {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (authError) throw authError;
        setMessage("If that email has an account, TruckFixHub will send password-reset instructions.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const requestAccountDeletion = () => {
    if (!user) return;
    Alert.alert(
      "Request account deletion?",
      "This starts a request to permanently delete your TruckFixHub account and associated personal data that TruckFixHub is not legally required to retain. Community content associated with the account should also be included in the deletion request.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            const subject = encodeURIComponent("TruckFixHub account deletion request");
            const body = encodeURIComponent(`Please permanently delete my TruckFixHub account and associated personal data.\n\nAccount email: ${user.email ?? ""}\n\nPlease confirm when the deletion is complete.`);
            void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
          },
        },
      ],
    );
  };

  if (loading) return <AppScreen><PageHeading title="My Garage" subtitle="Checking your TruckFixHub account…" /></AppScreen>;

  if (!user) {
    const heading = mode === "sign-in" ? "Sign in to your toolbox" : mode === "create" ? "Create your account" : "Reset your password";
    return (
      <AppScreen>
        <PageHeading eyebrow="Private TruckFixHub tools" title="My Garage" subtitle="Your trucks, VINs, saved parts, and service notes stay tied to your account." />
        <Notice title="Use your existing TruckFixHub account" tone="blue">This app uses the same TruckFixHub sign-in as the website. Your private records are only loaded for the signed-in account.</Notice>
        <Panel>
          <Text style={{ color: BRAND.navy, fontSize: 19, fontWeight: "900" }}>{heading}</Text>
          <FormField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          {mode !== "forgot" ? <FormField label="Password" value={password} onChangeText={setPassword} placeholder={mode === "create" ? "At least 6 characters" : "Password"} secureTextEntry autoCapitalize="none" autoComplete={mode === "create" ? "new-password" : "current-password"} /> : null}
          {error ? <ErrorText>{error}</ErrorText> : null}
          {message ? <Text style={{ color: BRAND.success, fontSize: 13, lineHeight: 19 }}>{message}</Text> : null}
          <PrimaryButton label={busy ? "Please wait…" : mode === "sign-in" ? "Sign in" : mode === "create" ? "Create account" : "Send reset email"} icon={mode === "forgot" ? "mail-outline" : "lock-closed-outline"} disabled={busy} onPress={() => void submit()} />
          <View style={{ gap: 4 }}>
            {mode !== "sign-in" ? <PrimaryButton variant="quiet" label="Back to sign in" onPress={() => { setMode("sign-in"); setError(""); setMessage(""); }} /> : null}
            {mode === "sign-in" ? <PrimaryButton variant="quiet" label="Create a TruckFixHub account" onPress={() => { setMode("create"); setError(""); setMessage(""); }} /> : null}
            {mode === "sign-in" ? <PrimaryButton variant="quiet" label="Forgot password?" onPress={() => { setMode("forgot"); setError(""); setMessage(""); }} /> : null}
            <PrimaryButton variant="quiet" label="Privacy policy" onPress={() => void Linking.openURL(PRIVACY_URL)} />
          </View>
        </Panel>
        <Notice tone="yellow">Do not save private truck or VIN records on a shared device. Sign out when you are finished.</Notice>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <PageHeading eyebrow="Your private toolbox" title="My Garage" subtitle="TruckFixHub tools for your fleet, parts, service activity, and warranty records." />
      <Panel style={{ backgroundColor: BRAND.navy, borderColor: BRAND.navy }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: BRAND.yellow, alignItems: "center", justifyContent: "center" }}><Ionicons name="person-outline" size={22} color={BRAND.navy} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffffff", fontWeight: "900", fontSize: 15 }}>Signed in</Text>
            <Text style={{ color: "#d7e8f5", fontSize: 13, marginTop: 2 }}>{user.email ?? "TruckFixHub member"}</Text>
          </View>
        </View>
        <PrimaryButton label="Sign out" icon="log-out-outline" variant="secondary" onPress={() => void signOut()} />
      </Panel>
      <View style={{ gap: 10 }}>
        <SectionHeading title="Private tools" />
        {(Object.keys(PRIVATE_TOOLS) as ToolId[]).map((id) => {
          const tool = PRIVATE_TOOLS[id];
          return <RowCard key={id} title={tool.title} subtitle={tool.subtitle} icon={tool.icon as never} onPress={() => router.push({ pathname: "/garage/[tool]", params: { tool: id } } as Href)} />;
        })}
      </View>
      <Notice title="Your data stays yours" tone="blue">Private records load through your signed-in TruckFixHub account and are filtered to that account. Community posts are public to the community.</Notice>
      <Panel>
        <Text style={{ color: BRAND.navy, fontSize: 17, fontWeight: "900" }}>Account & privacy</Text>
        <Text style={{ color: BRAND.muted, fontSize: 13, lineHeight: 19 }}>Review the privacy policy or start a permanent account-deletion request from here.</Text>
        <PrimaryButton variant="secondary" label="Privacy policy" icon="shield-checkmark-outline" onPress={() => void Linking.openURL(PRIVACY_URL)} />
        <PrimaryButton variant="quiet" label="Request account deletion" icon="trash-outline" onPress={requestAccountDeletion} />
      </Panel>
    </AppScreen>
  );
}
