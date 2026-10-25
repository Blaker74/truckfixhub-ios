// Legacy deep links return to the app's existing Supabase sign-in screen.
import { Redirect } from "expo-router";
export default function LegacyCallback() {
  return <Redirect href="/(tabs)/garage" />;
}
