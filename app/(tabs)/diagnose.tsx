import { Href, router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { AppScreen, Notice, PageHeading, RowCard, SearchField, SectionHeading } from "@/components/brand-ui";
import { BRAND, SAFETY_NOTE, SYMPTOM_GROUPS } from "@/constants/truckfixhub";

export default function DiagnoseScreen() {
  const [search, setSearch] = useState("");
  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return SYMPTOM_GROUPS;
    return SYMPTOM_GROUPS.map((group) => ({
      ...group,
      symptoms: group.symptoms.filter((item) => `${item.title} ${item.description} ${group.title}`.toLowerCase().includes(term)),
    })).filter((group) => group.symptoms.length > 0);
  }, [search]);

  return (
    <AppScreen>
      <PageHeading eyebrow="TruckFixHub diagnostic index" title="Start with the symptom" subtitle="Drivers and technicians describe the complaint first. Choose the closest match, then verify with current service information." />
      <SearchField value={search} onChangeText={setSearch} />
      <Notice title="A symptom is evidence" tone="yellow">{SAFETY_NOTE}</Notice>
      {!groups.length ? <Text style={{ color: BRAND.muted, fontSize: 14, paddingVertical: 12 }}>No matching symptoms. Try another word or browse by system.</Text> : null}
      {groups.map((group) => (
        <View key={group.id} style={{ gap: 9 }}>
          <SectionHeading title={group.title} />
          <Text style={{ color: BRAND.muted, fontSize: 13, lineHeight: 18, marginTop: -4 }}>{group.description}</Text>
          {group.symptoms.map((item) => (
            <RowCard
              key={item.slug}
              title={item.title}
              subtitle={item.description}
              icon={group.icon as never}
              onPress={() => router.push({ pathname: "/symptom/[slug]", params: { slug: item.slug } } as Href)}
            />
          ))}
        </View>
      ))}
    </AppScreen>
  );
}
