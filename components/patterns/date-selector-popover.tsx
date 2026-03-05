"use client";

import { useEffect, useState } from "react";

import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DateSelector,
  formatDateValue,
  type DateSelectorValue,
} from "@/components/reui/date-selector";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DateSelectorPopoverProps {
  value?: DateSelectorValue;
  onChange: (value: DateSelectorValue | undefined) => void;
  className?: string;
}
export function DateSelectorPopover({
  value,
  onChange,
  className,
}: DateSelectorPopoverProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<
    DateSelectorValue | undefined
  >(value);

  const formattedValue = value ? formatDateValue(value) : "";
  const displayText = formattedValue || "Select a date";

  useEffect(() => {
    if (open) {
      const timeOutId = setTimeout(() => {
        setInternalValue(value);
      }, 0);

      return () => clearTimeout(timeOutId);
    }
  }, [open, value]);

  const handleApply = () => {
    onChange(internalValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setInternalValue(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-56 justify-start", className)}
        >
          <CalendarIcon />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto gap-3 p-0" align="start" sideOffset={4}>
        <div className="p-3">
          <DateSelector
            value={internalValue}
            onChange={setInternalValue}
            allowRange={true}
            label="Due date"
            inputHint="Try: 2025, Q4, 05/10/2025"
          />
        </div>
        <Separator className="p-0" />
        <div className="flex justify-end gap-2 p-3 pt-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
