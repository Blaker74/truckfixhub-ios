import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { AppScreen, ErrorText, FormField, LoadingState, Notice, PageHeading, Panel, PrimaryButton, SectionHeading } from "@/components/brand-ui";
import { BRAND } from "@/constants/truckfixhub";
import { useAuth } from "@/lib/auth-context";
import { PRIVATE_TOOLS, rowSubtitle, rowTitle, ToolId } from "@/lib/private-tools";
import { createPrivateRecord, deletePrivateRecord, loadPrivateRows } from "@/lib/truckfixhub-data";

export default function PrivateToolScreen() {
  const { tool: rawTool } = useLocalSearchParams<{ tool: string }>();
  const tool = useMemo(() => (rawTool && Object.prototype.hasOwnProperty.call(PRIVATE_TOOLS, rawTool) ? rawTool as ToolId : null), [rawTool]);
  const config = tool ? PRIVATE_TOOLS[tool] : null;
  const { user } = useAuth();
  const recordsQuery = useQuery({
    queryKey: ["truckfixhub", "private-tool", tool, user?.id],
    queryFn: () => tool && user ? loadPrivateRows(tool, user.id) : Promise.resolve([]),
    enabled: Boolean(tool && user),
  });
  const rows = recordsQuery.data ?? [];
  const loading = recordsQuery.isLoading;
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [confirmRow, setConfirmRow] = useState<Record<string, any> | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const error = actionError || (recordsQuery.error instanceof Error ? recordsQuery.error.message : "");

  const save = async () => {
    if (!tool || !user) return;
    setSaving(true);
    setFormError("");
    try {
      const { error: insertError } = await createPrivateRecord(tool, user.id, values);
      if (insertError) throw insertError;
      setValues({});
      setShowForm(false);
      setNotice("Saved to your TruckFixHub account.");
      setActionError("");
      await recordsQuery.refetch();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save this record.");
    } finally { setSaving(false); }
  };

  const remove = async () => {
    if (!tool || !user || !confirmRow) return;
    try {
      await deletePrivateRecord(tool, user.id, confirmRow.id);
      setConfirmRow(null);
      setNotice("Record deleted.");
      setActionError("");
      await recordsQuery.refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not delete this record.");
      setConfirmRow(null);
    }
  };

  if (!tool || !config) return <AppScreen><PageHeading title="Tool not found" subtitle="Return to My Garage and choose a listed tool." /><PrimaryButton label="Back to My Garage" onPress={() => router.replace("/(tabs)/garage" as Href)} /></AppScreen>;
  if (!user) return <AppScreen><PageHeading title={config.title} subtitle="Sign in to view your private records." /><PrimaryButton label="Go to sign in" onPress={() => router.replace("/(tabs)/garage" as Href)} /></AppScreen>;

  return (
    <>
      <AppScreen>
        <PrimaryButton label="Back to My Garage" icon="arrow-back" variant="quiet" onPress={() => router.replace("/(tabs)/garage" as Href)} />
        <PageHeading eyebrow="My Garage" title={config.title} subtitle={config.subtitle} />
        {notice ? <Notice tone="blue">{notice}</Notice> : null}
        <PrimaryButton label={`Add ${tool === "trucks" ? "truck" : tool === "parts" ? "part" : tool === "calls" ? "call note" : tool === "calendar" ? "event" : "warranty record"}`} icon="add" onPress={() => { setValues({}); setFormError(""); setShowForm(true); }} />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <View style={{ gap: 10 }}>
          <SectionHeading title={loading ? "Loading records…" : `${rows.length} ${rows.length === 1 ? "record" : "records"}`} action={!loading ? "Refresh" : undefined} onAction={() => void recordsQuery.refetch()} />
          {loading ? <LoadingState /> : rows.length === 0 ? <Panel><Text style={{ color: BRAND.navy, fontWeight: "800", fontSize: 15 }}>Nothing saved yet</Text><Text style={{ color: BRAND.muted, fontSize: 13, lineHeight: 19 }}>Add the first record to keep it with your TruckFixHub account.</Text></Panel> : rows.map((row) => (
            <Panel key={String(row.id)} style={{ padding: 13 }}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ color: BRAND.navy, fontWeight: "900", fontSize: 15 }}>{rowTitle(tool, row)}</Text>
                  <Text style={{ color: BRAND.muted, fontSize: 13, lineHeight: 19 }}>{rowSubtitle(tool, row)}</Text>
                  {tool === "trucks" && row.year ? <Text style={{ color: BRAND.muted, fontSize: 12 }}>{[row.year, row.make, row.model].filter(Boolean).join(" ")}</Text> : null}
                  {tool === "warranty" && row.correction ? <Text style={{ color: BRAND.ink, fontSize: 13, lineHeight: 19, marginTop: 3 }}>{row.correction}</Text> : null}
                  {tool === "calendar" && row.notes ? <Text style={{ color: BRAND.ink, fontSize: 13, lineHeight: 19, marginTop: 3 }}>{row.notes}</Text> : null}
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${rowTitle(tool, row)}`} onPress={() => setConfirmRow(row)} hitSlop={10} style={{ padding: 5 }}>
                  <Ionicons name="trash-outline" size={19} color={BRAND.red} />
                </Pressable>
              </View>
            </Panel>
          ))}
        </View>
      </AppScreen>
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowForm(false)}>
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: BRAND.canvas }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 36, gap: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: BRAND.navy, fontSize: 23, fontWeight: "900", flex: 1 }}>Add {config.title.toLowerCase()}</Text>
              <Pressable onPress={() => setShowForm(false)} accessibilityLabel="Close form" hitSlop={10}><Ionicons name="close-circle" size={28} color={BRAND.muted} /></Pressable>
            </View>
            {tool === "trucks" ? <Notice tone="blue">Enter at least a unit number or VIN.</Notice> : null}
            {config.fields.map((field) => (
              <FormField
                key={field.key}
                label={field.label}
                value={values[field.key] ?? ""}
                onChangeText={(value) => setValues((old) => ({ ...old, [field.key]: value }))}
                placeholder={field.placeholder}
                multiline={field.multiline}
                keyboardType={field.keyboardType ?? "default"}
                autoCapitalize={field.capitalization ?? "sentences"}
                autoCorrect={!field.capitalization || field.capitalization === "sentences"}
              />
            ))}
            {formError ? <ErrorText>{formError}</ErrorText> : null}
            <PrimaryButton label={saving ? "Saving…" : "Save to My Garage"} icon="save-outline" disabled={saving} onPress={() => void save()} />
            <PrimaryButton label="Cancel" variant="secondary" onPress={() => setShowForm(false)} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <Modal visible={Boolean(confirmRow)} transparent animationType="fade" onRequestClose={() => setConfirmRow(null)}>
        <View style={{ flex: 1, justifyContent: "center", padding: 22, backgroundColor: "rgba(9,33,60,0.45)" }}>
          <Panel>
            <Text style={{ color: BRAND.navy, fontSize: 18, fontWeight: "900" }}>Delete this record?</Text>
            <Text style={{ color: BRAND.muted, fontSize: 14, lineHeight: 20 }}>{confirmRow ? rowTitle(tool, confirmRow) : ""} will be removed from your account.</Text>
            <PrimaryButton label="Delete record" icon="trash-outline" variant="warning" onPress={() => void remove()} />
            <PrimaryButton label="Keep record" variant="secondary" onPress={() => setConfirmRow(null)} />
          </Panel>
        </View>
      </Modal>
    </>
  );
}
