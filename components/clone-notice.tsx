"use client";

import { Popover } from "@base-ui/react";
import { InfoIcon } from "lucide-react";

export function CloneNotice({ sourceUrl }: { sourceUrl: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Over deze installatie"
        className="text-[#4A443D] transition-colors hover:text-[#E4593B] data-[popup-open]:text-[#E4593B]"
      >
        <InfoIcon className="size-5" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={10} align="end" collisionPadding={16} className="z-50">
          <Popover.Popup className="w-72 rounded-lg border border-[#EFE6DA] bg-white p-4 text-sm leading-relaxed text-[#4A443D] shadow-lg transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
            <Popover.Description>
              Dit is een zelf-gehoste installatie van de open-source applicatie{" "}
              <span className="font-medium text-[#221D18]">bezoekje.app</span>.
            </Popover.Description>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-medium text-[#E4593B] hover:underline"
            >
              Broncode op GitHub
            </a>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
