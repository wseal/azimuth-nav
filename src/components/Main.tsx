"use client";

import SearchBar from "@/components/SearchBar";
import TagSelector from "@/components/TagSelector";
// import NavList, { NavItem } from "@/components/NavList";
import Card from "@/components/Card";

import { udata } from "@/data/udata";
// import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface NavItem {
  name: string;
  description: string;
  url: string;
  favicon: string | null;
}

export default function Main() {
  //   const searchParams = useSearchParams() ?? "";
  //   const params = new URLSearchParams(searchParams);
  //   const tag = params.get("tag") ?? "";
  //   const q = params.get("q") ?? "";
  const [navs, setNavs] = useState<NavItem[]>([]);

  useEffect(() => {
    onSelectTag("All");
  }, []);

  const tags = [
    "All",
    ...udata.map((item) => {
      return item.name;
    }),
  ];

  //   const tmpNavs: NavItem[] = [];
  //   udata.forEach((item) => {
  //     let filter = item.children;
  //     if (q.length > 0) {
  //       filter = item.children.filter((ch) => {
  //         return (
  //           ch.title.indexOf(q) > -1 ||
  //           ch.url.indexOf(q) > -1 ||
  //           ch.description.indexOf(q) > -1
  //         );
  //       });
  //     }

  //     const nv = filter.map((f) => {
  //       return {
  //         name: f.title,
  //         description: f.description,
  //         url: f.url,
  //         favicon: f.favicon,
  //       };
  //     });

  //     tmpNavs.push(...nv);
  //   });

  //   setNavs(tmpNavs);

  const onSearch = (q: string) => {
    const tmpNavs: NavItem[] = [];
    udata.forEach((item) => {
      let filter = item.children;
      if (q.length > 0) {
        filter = item.children.filter((ch) => {
          return (
            ch.title.indexOf(q) > -1 ||
            ch.url.indexOf(q) > -1 ||
            ch.description.indexOf(q) > -1
          );
        });
      }
      const nv = filter.map((f) => {
        return {
          name: f.title,
          description: f.description,
          url: f.url,
          favicon: f.favicon,
        };
      });
      tmpNavs.push(...nv);
    });
    setNavs(tmpNavs);
  };

  const onSelectTag = (tag: string) => {
    const tagNavs: NavItem[] = [];
    udata.forEach((item) => {
      if (item.name === tag || tag === "All") {
        const chs = item.children.map((ch) => {
          return {
            name: ch.title,
            description: ch.description,
            url: ch.url,
            favicon: ch.favicon,
          };
        });

        tagNavs.push(...chs);
      }
    });

    setNavs(tagNavs);
  };

  return (
    <>
      <main className="relative mt-4 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
        <div className="dark:bg-dark-900 sticky top-0 bg-gray-100 pb-4">
          <div className="mx-auto flex max-w-5xl flex-col gap-2">
            <SearchBar onSearch={onSearch} />
            <TagSelector tags={tags} onSelectTag={onSelectTag} />
            <div className="mt-2 border-t-1 border-gray-500"></div>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-2 sm:grid-cols-2 lg:grid-cols-3">
          {navs.map((item, index) => (
            <Card
              key={index}
              favicon={
                item.favicon && item.favicon?.length > 0
                  ? item.favicon
                  : "https://github.githubassets.com/favicons/favicon.svg"
              }
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
