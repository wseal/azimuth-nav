"use client";

import { useDebounce } from "@/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const route = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams() ?? "";

  const handleSearch = useDebounce((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    route.replace(`${path}?${params.toString()}`);

    onSearch(term);
  }, 300);

  return (
    <div className="my-2">
      <input
        // border-[#f4f5f7] bg-[#f4f5f7]
        className="dark:bg-dark-300 h-10 w-full rounded-sm border border-white bg-white p-4 text-lg text-[#8a92a6] outline-hidden hover:cursor-pointer hover:border-gray-500 focus:border-gray-500 dark:border-gray-300 dark:text-gray-800"
        type="search"
        placeholder="Please Input To Search "
        //   defaultValue={}
        onChange={(ev) => {
          handleSearch(ev.target.value);
        }}
      ></input>
    </div>
  );
}
