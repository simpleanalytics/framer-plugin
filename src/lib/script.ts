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

async function createDataAttributes() {
  let options = "";

  for (const attribute of DATA_ATTRIBUTES) {
    const value = await framer.getPluginData(attribute);

    if (value) {
      options += `${attribute}=${value} `;
    }
  }

  return options;
}

export async function createScript() {
  const data = await createDataAttributes();

  return `<script async src="https://simpleanalytics.com" ${data}></script>`;
}
