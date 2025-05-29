import { framer } from "framer-plugin";

const SETTING_KEYS = [
  "setting-auto-collect-events",
  "setting-custom-domain",
  "auto-event-partial-collect-downloads",
  "auto-event-partial-collect-outbound-links",
  "auto-event-partial-collect-email-clicks",
  "data-auto-collect",
  "data-collect-dnt",
  "data-hostname",
  "data-mode",
  "data-ignore-metrics",
  "data-ignore-pages",
  "data-allow-params",
  "data-non-unique-params",
  "data-strict-utm",
  "auto-event-data-extensions",
  "auto-event-data-use-title",
  "auto-event-data-full-urls",
] as const;

export interface Settings {
  "setting-auto-collect-events": string | undefined;
  "setting-custom-domain": string | undefined;

  // collect attribute
  "auto-event-partial-collect-downloads": string | undefined;
  "auto-event-partial-collect-outbound-links": string | undefined;
  "auto-event-partial-collect-email-clicks": string | undefined;

  // data attributes
  "data-auto-collect": string | undefined;
  "data-collect-dnt": string | undefined;
  "data-hostname": string | undefined;
  "data-mode": string | undefined;
  "data-ignore-metrics": string | undefined;
  "data-ignore-pages": string | undefined;
  "data-allow-params": string | undefined;
  "data-non-unique-params": string | undefined;
  "data-strict-utm": string | undefined;
  "auto-event-data-extensions": string | undefined;
  "auto-event-data-use-title": string | undefined;
  "auto-event-data-full-urls": string | undefined;
}

export async function parseSettings() {
  const settings: Partial<Settings> = {};

  for (const key of SETTING_KEYS) {
    const value = await framer.getPluginData(key);
    if (value) {
      settings[key as keyof Settings] = value;
    }
  }

  return settings as Settings;
}
