import { framer } from "framer-plugin";
import { useState, useCallback, useEffect } from "react";
import { Label } from "./components/label";
import { Input } from "./components/input";
import { Checkbox } from "./components/checkbox";
import { useCustomCode } from "./hooks/use-custom-code";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { createScript } from "./lib/script";
import { parseSettings, type Settings } from "@/lib/settings";

framer.showUI({
  position: "top right",
  width: 400,
  height: 600,
});

export function App() {
  const customCode = useCustomCode();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    parseSettings().then((settings) => {
      setSettings(settings);
    });
  }, []);
  
  const isInstalled = customCode?.bodyEnd !== null;

  const updateScript = useCallback(async () => {
    await framer.setCustomCode({
      html: await createScript(),
      location: "bodyEnd",
    });
  }, []);

  const removeScript = useCallback(async () => {
    await framer.setCustomCode({
      html: null,
      location: "bodyEnd",
    });
  }, []);

  useEffect(() => {
    updateScript();
  }, [settings, updateScript]);

  useEffect(() => {
    if (isInstalled) {
      return;
    }

    updateScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="grid p-[15px]">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 grid grid-cols-subgrid gap-4">
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="setting-auto-collect-events">
                Collect automated events:
              </Label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="flex flex-col items-stretch max-w-full w-64  gap-2">
                      <p className="text-muted-foreground text-xs text-wrap">
                        It will track outbound links, email addresses clicks,
                        and amount of downloads for common files (pdf, csv,
                        docx, xlsx).
                      </p>
                      <p className="text-muted-foreground text-xs text-wrap">
                        Events will appear on your events page on
                        simpleanalytics.com. (default: on)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="setting-auto-collect-events"
              defaultChecked={
                settings?.["setting-auto-collect-events"] !== "false"
              }
              onChange={(e) => {
                const isDefault = e.target.value === "true";

                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "data-auto-collect": isDefault ? undefined : "false",
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Enable or disable automated events collection. (default: on)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="setting-custom-domain">Custom domain:</Label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        A custom domain can help with by-passing ad-blockers.
                        It's not required and if you don't know what it is, just
                        leave it empty. (default: empty)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              className="col-span-2 self-center justify-self-end"
              id="setting-custom-domain"
              value={settings?.["setting-custom-domain"] ?? ""}
              onChange={(e) => {
                const isDefault = e.target.value.trim() === "";

                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "setting-custom-domain": isDefault ? undefined : e.target.value,
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Use a custom domain to bypass ad-blockers. (default: empty)
              </p>
            </div>
          </div>
        </div>
        <Separator className="col-span-4" />
        <h2 className="text-lg font-semibold col-span-4">Advanced settings</h2>
        <div className="col-span-4 grid grid-cols-subgrid gap-4 pb-2">
          
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="data-collect-dnt">
                Collect Do Not Track visits:
              </Label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        The Do Not Track setting requests that a web application
                        disables either its tracking or cross-site user tracking
                        of an individual user. We don't do that ever, so you can
                        select to collect those visits as well. (default: off)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="data-collect-dnt"
              defaultChecked={settings?.["data-collect-dnt"] === "true"}
              onChange={(e) => {
                const isDefault = e.target.value === "false";

                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "data-collect-dnt": isDefault ? "true" : undefined,
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Enable analytics for users with Do Not Track enabled. (default: off)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="data-auto-collect">Collect page views:</Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        Enable or disable page view collection. (default: on)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="data-auto-collect"
              defaultChecked={
                settings?.["data-auto-collect"] !== "false"
              }
              onChange={(e) => {
                const isDefault = e.target.value === "true";
                
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "data-auto-collect": isDefault ? undefined : "false",
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Enable or disable page view collection. (default: on)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="data-ignore-pages">Ignored pages:</Label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        Not want to run Simple Analytics on certain pages? Enter
                        them here. You can use asterisks (*) to specify multiple
                        pages, example: /page1,/page2,/admin/* (default: empty)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              className="col-span-2 self-center justify-self-end"
              id="data-ignore-pages"
              value={settings?.["data-ignore-pages"] ?? ""}
              onChange={(e) => {
                const isDefault = e.target.value.trim() === "";
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "data-ignore-pages": isDefault ? undefined : e.target.value,
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Disable Simple Analytics on certain pages. (default: empty)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="data-hostname">Overwrite domain:</Label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        Are you running your website on a different domain than
                        what is listed in Simple Analytics? Overwrite your
                        domain name here. (default: empty)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              className="col-span-2 self-center justify-self-end"
              id="data-hostname"
              value={settings?.["data-hostname"] ?? ""}
              onChange={(e) => {
                const isDefault = e.target.value.trim() === "";

                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "data-hostname": isDefault ? undefined : e.target.value,
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Overwrite your domain name here. (default: empty)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="data-mode">Enable hash mode:</Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        Enable hash mode to track URLs with hashes as separate
                        page views. (default: false)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="data-mode"
              defaultChecked={settings?.["data-mode"] === "hash"}
              onChange={(e) => {
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "data-mode": e.target.checked
                          ? "hash"
                          : undefined,
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Enable hash mode to track URLs with hashes as separate page
                views. (default: false)
              </p>
            </div>
          </div>
        </div>
        <Separator className="col-span-4" />
        <h2 className="text-lg font-semibold">Events</h2>
        <div className="col-span-4 grid grid-cols-subgrid gap-4">
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="auto-event-partial-collect-outbound-links">
                Collect outbound links:
              </Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        It will track clicks on links to other websites.
                        (default: on)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="auto-event-partial-collect-outbound-links"
              defaultChecked={
                settings?.["auto-event-partial-collect-outbound-links"] !== "false"
              }
              onChange={(e) => {
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "auto-event-partial-collect-outbound-links": e.target.checked
                          ? undefined
                          : "false",
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                It will track clicks on links to other websites. (default: on)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="auto-event-partial-collect-email-clicks">
                Collect email clicks:
              </Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        It will track clicks on email addresses. (default: on)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="auto-event-partial-collect-email-clicks"
              defaultChecked={
                settings?.["auto-event-partial-collect-email-clicks"] !== "false"
              }
              onChange={(e) => {
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "auto-event-partial-collect-email-clicks": e.target.checked
                          ? undefined
                          : "false",
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                It will track clicks on email addresses. (default: on)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="auto-event-partial-collect-downloads">
                Collect downloads:
              </Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        It will track downloads of certain files. (default: on)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="auto-event-partial-collect-downloads"
              defaultChecked={
                settings?.["auto-event-partial-collect-downloads"] !== "false"
              }
              onChange={(e) => {
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "auto-event-partial-collect-downloads": e.target.checked
                          ? undefined
                          : "false",
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                It will track downloads of certain files. (default: on)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="auto-event-data-extensions">Collect downloads extensions:</Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        (default: 'pdf,csv,docx,xlsx,zip,doc,xls')
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Input
              className="col-span-2 self-center justify-self-end"
              id="auto-event-data-extensions"
              defaultValue={settings?.["auto-event-data-extensions"] ?? "pdf,csv,docx,xlsx,zip,doc,xls"}
              placeholder="pdf,csv,docx,xlsx,zip,doc,xls"
              onChange={(e) => {
                const isDefault = e.target.value === "pdf,csv,docx,xlsx,zip,doc,xls" || e.target.value.trim() === "";
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "auto-event-data-extensions": isDefault ? undefined : e.target.value,
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Extensions to enable download tracking for.
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="auto-event-data-use-title">Use page title:</Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        Enable or disable title collection. (default: on)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="auto-event-data-use-title"
              defaultChecked={
                settings?.["auto-event-data-use-title"] !== "false"
              }
              onChange={(e) => {
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "auto-event-data-use-title": e.target.checked
                          ? undefined
                          : "false",
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Enable or disable title collection. (default: on)
              </p>
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <Label htmlFor="auto-event-data-full-urls">Collect full URLs:</Label>
              {/* <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="w-full" side="top" align="center">
                    <div className="space-y-1 max-w-full w-64 text-wrap">
                      <p className="text-muted-foreground text-xs text-wrap">
                        Enable or disable full URL collection. (default: off)
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Checkbox
              className="col-span-2 self-center justify-self-end"
              id="auto-event-data-full-urls"
              defaultChecked={settings?.["auto-event-data-full-urls"] === "true"}
              onChange={(e) => {
                setSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        "auto-event-data-full-urls": e.target.checked
                          ? "true"
                          : undefined,
                      }
                    : null,
                );
              }}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground text-xs">
                Enable or disable full URL collection. (default: off)
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4 pb-[15px]">
          <button
            className="framer-button-secondary"
            onClick={isInstalled ? removeScript : updateScript}
          >
            {isInstalled ? "Remove Script" : "Insert Script"}
          </button>
        </div>
      </div>
    </main>
  );
}
