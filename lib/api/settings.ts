import { createClient } from "@/lib/supabase/server";

const HAS_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getUserSettingsServer(userId: string) {
  if (!HAS_SUPABASE) return { crossfade_duration: 0, theme: "dark" };
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data ?? { crossfade_duration: 0, theme: "dark" };
  } catch {
    return { crossfade_duration: 0, theme: "dark" };
  }
}
