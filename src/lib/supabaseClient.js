import { createClient } from "@supabase/supabase-js";

export const DEFAULT_COUNTERS = {
  users_served: 0,
  credits_identified: 0,
  dollars_unlocked: 0,
};

let browserClient;
let hasWarnedInvalidConfig = false;

function isValidHttpUrl(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isValidHttpUrl(supabaseUrl)) {
    if (!hasWarnedInvalidConfig) {
      console.warn(
        "Supabase is not configured with a valid public URL/key. Falling back to local default counters."
      );
      hasWarnedInvalidConfig = true;
    }
    return null;
  }

  if (!browserClient) {
    try {
      browserClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (error) {
      if (!hasWarnedInvalidConfig) {
        console.warn("Unable to initialize Supabase client. Falling back to defaults.", error);
        hasWarnedInvalidConfig = true;
      }
      return null;
    }
  }

  return browserClient;
}

function normalizeCounters(counters) {
  return {
    users_served: Number(counters?.users_served ?? 0),
    credits_identified: Number(counters?.credits_identified ?? 0),
    dollars_unlocked: Number(counters?.dollars_unlocked ?? 0),
  };
}

export async function getCounters() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return DEFAULT_COUNTERS;
  }

  const { data, error } = await supabase
    .from("impact_counters")
    .select("users_served, credits_identified, dollars_unlocked")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    console.warn("Unable to load Supabase counters.", error);
    return DEFAULT_COUNTERS;
  }

  return normalizeCounters(data);
}

export function incrementCounters(creditsCount = 0, dollarsAmount = 0) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  void supabase
    .rpc("increment_impact_counters", {
      credits_count: Number(creditsCount) || 0,
      dollars_amount: Number(dollarsAmount) || 0,
    })
    .then(({ error }) => {
      if (error) {
        console.warn("Unable to increment Supabase counters.", error);
      }
    });
}
