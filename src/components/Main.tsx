"use client";

import SearchBar from "@/components/SearchBar";
import TagSelector from "@/components/TagSelector";
import Card, { CardProps } from "@/components/Card";

import { BookmarkListItem, udata } from "@/data/udata";
import { useSearchParams } from "next/navigation";

export default function Main() {
  const searchParams = useSearchParams() ?? "";
  const params = new URLSearchParams(searchParams);
  const tag = params.get("tag") ?? "";
  const q = (params.get("q") ?? "").toLowerCase();

  const filter = (list: BookmarkListItem[], q: string) => {
    if (q.length < 1) {
      return list;
    }

    return list.filter((ch) => {
      return (
        ch.title.toLowerCase().indexOf(q) > -1 ||
        ch.url.toLocaleLowerCase().indexOf(q) > -1 ||
        ch.description.toLowerCase().indexOf(q) > -1
      );
    });
  };

  const tags = [
    "All",
    ...udata.map((item) => {
      return item.name;
    }),
  ];

  //
  const navs: CardProps[] = [];
  for (const item of udata) {
    if (tag !== "All" && tag.length > 0) {
      if (item.name !== tag) {
        continue;
      }

      const tmp = filter(item.children, q).map((ch) => {
        return {
          name: ch.title,
          description: ch.description,
          url: ch.url,
          favicon: ch.favicon ?? null,
        };
      });

      navs.push(...tmp);
      break;
    }

    const tmp = filter(item.children, q).map((ch) => {
      return {
        name: ch.title,
        description: ch.description,
        url: ch.url,
        favicon: ch.favicon ?? null,
      };
    });

    navs.push(...tmp);
  }

  return (
    <>
      <main className="no-scrollbar relative mt-4 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
        <div className="dark:bg-dark-900 sticky top-0 bg-gray-100">
          <div className="mx-auto flex max-w-5xl flex-col gap-2">
            <SearchBar value={q} />
            <TagSelector tags={tags} />
            <div className="mt-2 border-t-1 border-gray-500"></div>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 py-6 sm:grid-cols-2 sm:py-4 lg:grid-cols-3 lg:gap-6">
          {navs.map((item, index) => (
            <Card
              key={index}
              favicon={item.favicon}
              url={item.url}
              name={item.name}
              description={item.description}
            ></Card>
          ))}
        </div>
      </main>
    </>
  );
}
