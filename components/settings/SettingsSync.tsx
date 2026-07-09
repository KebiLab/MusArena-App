"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSettingsStore } from "@/store/settingsStore";

export function SettingsSync() {
  const hydrate = useSettingsStore((s) => s.hydrate);
  const setCrossfade = useSettingsStore((s) => s.setCrossfade);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !mounted) return;
        const { data } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data && mounted) {
          hydrate({ crossfade_duration: data.crossfade_duration ?? 0 });
        }
      } catch {
        // silent
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hydrate]);

  // Sync crossfade changes to Supabase
  const crossfade = useSettingsStore((s) => s.crossfadeDuration);
  useEffect(() => {
    (async () => {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase
          .from("user_settings")
          .upsert(
            {
              user_id: user.id,
              crossfade_duration: crossfade,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
      } catch {
        // silent
      }
    })();
  }, [crossfade, setCrossfade]);

  return null;
}
