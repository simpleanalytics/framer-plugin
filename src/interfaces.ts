export interface EventDataAttributes {
  "data-collect": string | null;
  "data-extensions": string | null;
  "data-use-title": string | null;
  "data-full-urls": string | null;
}

export interface DataAttributes {
  "data-auto-collect": string | null;
  "data-collect-dnt": string | null;
  "data-hostname": string | null;
  "data-mode": string | null;
  "data-ignore-metrics": string | null;
  "data-ignore-pages": string | null;
  "data-allow-params": string | null;
  "data-non-unique-params": string | null;
  "data-strict-utm": string | null;
}

export interface Settings extends DataAttributes, EventDataAttributes {
  "setting-custom-domain": string;
  "setting-collect-downloads": string;
  "setting-collect-outbound-links": string;
  "setting-collect-email-clicks": string;
}
