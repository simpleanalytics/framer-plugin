import type { ComponentPropsWithoutRef } from "react";

export function Label(props: ComponentPropsWithoutRef<"label">) {
  return <label className="font-semibold" {...props} />;
}
