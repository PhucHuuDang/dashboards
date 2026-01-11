"use client";

import { useEffect, type ReactNode } from "react";

import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/animate-ui/components/radix/sheet";
import { Button } from "@/components/ui/button";

import { ColorPicker } from "./color-picker";
import { CssExportButton } from "./css-export-button";
import { FontSelector } from "./font-selector";
import { ModeToggle } from "./mode-toggle";
import { PresetSelector } from "./preset-selector";
import { RadiusSelector } from "./radius-selector";
import { applyTheme } from "./theme-applier";
import { useThemeState } from "./use-theme-state";

type ThemeSheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
};

type ThemeSheetState = ReturnType<typeof useThemeState>;

type ThemeSheetSectionProps = {
  children: ReactNode;
  className?: string;
};

type ThemeSheetContentProps = Omit<ThemeSheetState, "resetTheme">;

type ThemeSheetFooterProps = {
  config: ThemeSheetState["config"];
  onReset: () => void;
};

function ThemeSheetSection({ children, className }: ThemeSheetSectionProps) {
  return <div className={cn("relative", className)}>{children}</div>;
}

function ThemeSheetBody({
  config,
  setColorPreset,
  setRadius,
  setDarkMode,
  setFont,
  setPresetTheme,
}: ThemeSheetContentProps) {
  const sections = [
    {
      key: "preset",
      content: (
        <PresetSelector value={config.preset} onChange={setPresetTheme} />
      ),
    },
    {
      key: "color",
      content: (
        <ColorPicker value={config.colorPreset} onChange={setColorPreset} />
      ),
    },
    {
      key: "radius",
      content: <RadiusSelector value={config.radius} onChange={setRadius} />,
    },
    {
      key: "font",
      className: "z-20",
      content: <FontSelector value={config.font} onChange={setFont} />,
    },
    {
      key: "mode",
      content: <ModeToggle value={config.darkMode} onChange={setDarkMode} />,
    },
  ];

  return (
    <div className="grid flex-1 gap-4 overflow-y-auto px-4 py-2">
      {sections.map((section) => (
        <ThemeSheetSection key={section.key} className={section.className}>
          {section.content}
        </ThemeSheetSection>
      ))}
    </div>
  );
}

function ThemeSheetActions({ config, onReset }: ThemeSheetFooterProps) {
  return (
    <div className="flex items-center gap-2">
      <CssExportButton config={config} />
      <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
        <RotateCcw className="size-3.5" />
        <span>Reset</span>
      </Button>
    </div>
  );
}

export function ThemeSheet({ open, onOpenChange, trigger }: ThemeSheetProps) {
  const {
    config,
    setColorPreset,
    setRadius,
    setDarkMode,
    setFont,
    setPresetTheme,
    resetTheme,
  } = useThemeState();

  // Apply stored theme when the sheet opens
  useEffect(() => {
    if (open) {
      applyTheme(config);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="right"
        className="flex w-md flex-col gap-0 p-0 sm:max-w-lg mr-2 rounded-lg"
        showCloseButton
        classNameOverlay="bg-black/10"
      >
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-sm font-semibold">Setup Theme</SheetTitle>
          <SheetDescription className="sr-only">
            Configure your application theme settings
          </SheetDescription>
        </SheetHeader>

        <ThemeSheetBody
          config={config}
          setColorPreset={setColorPreset}
          setRadius={setRadius}
          setDarkMode={setDarkMode}
          setFont={setFont}
          setPresetTheme={setPresetTheme}
        />

        <SheetFooter className="border-t px-4 py-3">
          <ThemeSheetActions config={config} onReset={resetTheme} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ThemeSheet;
