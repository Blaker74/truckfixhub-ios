import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Linking, Text } from "react-native";

import { AppScreen, Notice, PageHeading, RowCard } from "@/components/brand-ui";
import { BRAND, RESOURCE_LINKS } from "@/constants/truckfixhub";

export default function ResourcesScreen() {
  const [opening, setOpening] = useState<string | null>(null);
  const open = async (url: string, title: string) => {
    setOpening(title);
    try { await Linking.openURL(url); }
    catch { Alert.alert("Couldn't open this resource", "Please try again or visit truckfixhub.com."); }
    finally { setOpening(null); }
  };

  return (
    <AppScreen>
      <PageHeading eyebrow="TruckFixHub library" title="Resources" subtitle="Go straight to the reference that matches your job. Full guides stay on TruckFixHub, where they can be kept current." />
      <Notice title="Use the guide as a reference" tone="blue">Verify safety-critical repairs, specifications, and procedures against current manufacturer service information.</Notice>
      {RESOURCE_LINKS.map((item) => (
        <RowCard key={item.title} title={item.title} subtitle={item.detail} icon={item.icon as never} trailing={opening === item.title ? <Text style={{ color: BRAND.muted, fontSize: 12 }}>Opening…</Text> : <Ionicons name="open-outline" size={18} color={BRAND.blue} />} onPress={() => void open(item.url, item.title)} />
      ))}
      <Text style={{ color: BRAND.muted, fontSize: 12, lineHeight: 18, textAlign: "center", paddingTop: 2 }}>TruckFixHub — diagnose before you replace parts.</Text>
    </AppScreen>
  );
}
