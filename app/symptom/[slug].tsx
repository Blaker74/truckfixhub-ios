import { Href, router, useLocalSearchParams } from "expo-router";
import { Alert, Linking, Text, View } from "react-native";

import { AppScreen, Notice, PageHeading, Panel, PrimaryButton, SectionHeading } from "@/components/brand-ui";
import { BRAND, findSymptom, SAFETY_NOTE } from "@/constants/truckfixhub";

export default function SymptomDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const symptom = findSymptom(String(slug ?? ""));
  const observations = [
    "When does it happen—at idle, under load, at highway speed, or all the time?",
    "What warning lights or SPN/FMI codes are present?",
    "What changed recently, and what has already been tested?",
  ];

  const openGuide = async () => {
    if (!symptom) return;
    try { await Linking.openURL(symptom.url); }
    catch { Alert.alert("Couldn't open the guide", "Please try again or visit truckfixhub.com."); }
  };

  if (!symptom) {
    return <AppScreen><PageHeading title="Guide not found" subtitle="Return to Diagnose and choose a listed symptom." /></AppScreen>;
  }

  return (
    <AppScreen>
      <PrimaryButton label="Back to symptom index" icon="arrow-back" variant="quiet" onPress={() => router.replace("/(tabs)/diagnose" as Href)} />
      <PageHeading eyebrow={symptom.system} title={symptom.title} subtitle={symptom.description} />
      <Panel style={{ backgroundColor: BRAND.navy, borderColor: BRAND.navy }}>
        <Text style={{ color: BRAND.yellow, fontSize: 12, fontWeight: "900", letterSpacing: 1 }}>BEFORE YOU TEST</Text>
        <Text style={{ color: "#ffffff", fontSize: 16, lineHeight: 23, fontWeight: "700" }}>Capture the conditions around the complaint before choosing a component.</Text>
      </Panel>
      <View style={{ gap: 10 }}>
        <SectionHeading title="Useful observations" />
        {observations.map((line, index) => (
          <View key={line} style={{ flexDirection: "row", gap: 10, paddingVertical: 4 }}>
            <View style={{ width: 27, height: 27, borderRadius: 14, backgroundColor: "#e9f4fc", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: BRAND.blue, fontWeight: "900", fontSize: 13 }}>{index + 1}</Text>
            </View>
            <Text style={{ color: BRAND.ink, flex: 1, fontSize: 14, lineHeight: 21, paddingTop: 2 }}>{line}</Text>
          </View>
        ))}
      </View>
      <Notice title="Use the current repair guide" tone="yellow">{SAFETY_NOTE}</Notice>
      <PrimaryButton label="Open TruckFixHub guide" icon="open-outline" onPress={openGuide} />
      <Text style={{ color: BRAND.muted, textAlign: "center", fontSize: 12, lineHeight: 18 }}>The full guide opens outside the app so you can use the latest TruckFixHub reference.</Text>
    </AppScreen>
  );
}
