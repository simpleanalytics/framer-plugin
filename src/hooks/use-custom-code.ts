import { useEffect, useState } from "react";
import { CustomCode, framer } from "framer-plugin";

export function useCustomCode() {
  const [customCode, setCustomCode] = useState<CustomCode | null>(null);

  useEffect(() => framer.subscribeToCustomCode(setCustomCode), []);

  return customCode;
}
