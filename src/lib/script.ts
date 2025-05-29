import { framer } from "framer-plugin";

const DATA_ATTRIBUTES = [
  "data-auto-collect",
  "data-collect-dnt",
  "data-hostname",
  "data-mode",
  "data-ignore-metrics",
  "data-ignore-pages",
  "data-allow-params",
  "data-non-unique-params",
  "data-strict-utm",
];

async function createCollectAttribute() {
  const options: string[] = [];

  const collectDownloads = await framer.getPluginData("auto-event-partial-collect-downloads");
  const collectOutboundLinks = await framer.getPluginData("auto-event-partial-collect-outbound-links");
  const collectEmailClicks = await framer.getPluginData("auto-event-partial-collect-email-clicks");


  if (collectDownloads) {
    options.push(collectDownloads);
  }

  if (collectOutboundLinks) {
    options.push(collectOutboundLinks);
  }

  if (collectEmailClicks) {
    options.push(collectEmailClicks);
  }

  return options.length > 0 ? `data-collect=${options.join(",")}` : undefined;
}

async function createAutoEventsAttribute() {
  const options: string[] = [];

  const collectAttribute = await createCollectAttribute();

  if (collectAttribute) {
    options.push(collectAttribute);
  }

  const extensions = await framer.getPluginData("auto-event-data-extensions");

  if (extensions) {
    options.push(`data-extensions=${extensions}`);
  }

  const useTitle = await framer.getPluginData("auto-event-data-use-title");

  if (useTitle) {
    options.push(`data-use-title=${useTitle}`);
  }

  const fullUrls = await framer.getPluginData("auto-event-data-full-urls");

  if (fullUrls) {
    options.push(`data-full-urls=${fullUrls}`);
  }


  return options.length > 0 ? options.join(" ") : "";
}

async function createDataAttributes() {
  const options: string[] = [];

  for (const attribute of DATA_ATTRIBUTES) {
    const value = await framer.getPluginData(attribute);

    if (value) {
      options.push(`${attribute}=${value}`);
    }
  }

  return options.length > 0 ? options.join(" ") : "";
}

export async function createScript() {
  const data = await createDataAttributes();

  const domain = await framer.getPluginData("setting-custom-domain") ?? "scripts.simpleanalyticscdn.com";
// https://scripts.simpleanalyticscdn.com/auto-events.js

  const scripts = [`<script async src="https://${domain}/latest.js" ${data}></script>`];

  const autoCollectEvents = await framer.getPluginData("setting-auto-collect-events");

  if (autoCollectEvents !== "false") {
    const autoEventsAttribute = await createAutoEventsAttribute();

    scripts.push(`<script async src="https://${domain}/auto-events.js" ${autoEventsAttribute}></script>`);
  }

  return scripts.join("\n");
}