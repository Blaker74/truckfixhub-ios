import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AppScreen, BrandHeader, Notice, Panel, PrimaryButton, RowCard, SearchField, SectionHeading } from "@/components/brand-ui";
import { BRAND, ALL_SYMPTOMS, SAFETY_NOTE } from "@/constants/truckfixhub";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];
    return ALL_SYMPTOMS.filter((item) => `${item.title} ${item.system} ${item.description}`.toLowerCase().includes(term)).slice(0, 4);
  }, [search]);

  const goDiagnose = () => router.push("/(tabs)/diagnose" as Href);
  const openSymptom = (slug: string) => router.push({ pathname: "/symptom/[slug]", params: { slug } } as Href);

  return (
    <AppScreen contentStyle={{ paddingTop: 4 }}>
      <BrandHeader />
      <View style={{ gap: 7 }}>
        <Text style={{ color: BRAND.navy, fontSize: 29, lineHeight: 35, fontWeight: "900", textAlign: "center" }}>What is your truck doing?</Text>
        <Text style={{ color: BRAND.muted, fontSize: 15, lineHeight: 22, textAlign: "center" }}>Start with the symptom. Narrow the problem before replacing parts.</Text>
      </View>
      <SearchField value={search} onChangeText={setSearch} placeholder="Search a symptom or truck system" />
      {results.length ? (
        <Panel style={{ padding: 9, gap: 2 }}>
          {results.map((item) => (
            <Pressable key={item.slug} onPress={() => openSymptom(item.slug)} style={{ minHeight: 54, padding: 10, borderBottomWidth: 1, borderBottomColor: "#edf1f5", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="search-outline" size={17} color={BRAND.blue} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: BRAND.navy, fontSize: 14, fontWeight: "800" }}>{item.title}</Text>
                <Text style={{ color: BRAND.muted, fontSize: 12, marginTop: 2 }}>{item.system}</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={BRAND.muted} />
            </Pressable>
          ))}
        </Panel>
      ) : null}
      <PrimaryButton label="Browse symptom index" icon="arrow-forward" onPress={goDiagnose} />
      <Notice title="Diagnose before you replace" tone="yellow">{SAFETY_NOTE}</Notice>
      <View style={{ gap: 10 }}>
        <SectionHeading title="Popular starting points" action="See all" onAction={goDiagnose} />
        {ALL_SYMPTOMS.filter((item) => ["wont-crank", "low-power", "wont-regen", "overheating", "air-leak", "hot-hub"].includes(item.slug)).map((item) => (
          <RowCard key={item.slug} title={item.title} subtitle={item.system} icon="build-outline" onPress={() => openSymptom(item.slug)} />
        ))}
      </View>
      <View style={{ gap: 10 }}>
        <SectionHeading title="Your TruckFixHub" />
        <Panel style={{ backgroundColor: BRAND.navy, borderColor: BRAND.navy }}>
          <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "900" }}>A private toolbox for your trucks</Text>
          <Text style={{ color: "#d7e8f5", fontSize: 14, lineHeight: 20 }}>Keep VINs, parts, service notes, dates, and warranty records with your account.</Text>
          <PrimaryButton label="Open My Garage" icon="car-sport-outline" variant="warning" onPress={() => router.push("/(tabs)/garage" as Href)} />
        </Panel>
      </View>
      <RowCard title="Ask the truck community" subtitle="Share what you observed and what you tested." icon="chatbubbles-outline" onPress={() => router.push("/(tabs)/community" as Href)} />
    </AppScreen>
  );
}
