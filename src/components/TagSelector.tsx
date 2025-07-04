"use client";

import { useDebounce } from "@/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TagSelector({
  tags,
  onSelectTag,
}: {
  tags: string[];
  onSelectTag: (tag: string) => void;
}) {
  const route = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams() ?? "";
  const params = new URLSearchParams(searchParams);

  const [currTag, setCurrTag] = useState(params.get("tag") ?? "All");

  const handleSelect = useDebounce((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("tag", term);
    } else {
      params.delete("tag");
    }

    route.replace(`${path}?${params.toString()}`);
  }, 0);

  return (
    <div className="my-2 flex w-full flex-wrap gap-2">
      {tags.map((item) => {
        return (
          <span
            className={`box-border h-7 min-w-[80px] cursor-pointer rounded-xl border border-[#979797] px-4 text-center text-sm leading-7 text-[#8a92a6] transition-all hover:border-[#969696] hover:bg-[#969696] hover:text-white ${
              currTag === item ? "border-[#7c7c7c] bg-[#7c7c7c] text-white" : ""
            }`}
            key={`${item}-select-tag`}
            onClick={() => {
              setCurrTag(item);
              handleSelect(item);
              onSelectTag(item);
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}
