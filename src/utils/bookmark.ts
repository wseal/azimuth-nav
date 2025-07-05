/* eslint-disable @typescript-eslint/no-unused-vars */

import { BookmarkList, BookmarkListItem } from "@/data/udata";

//   Interfaces for bookmark structure
export interface BookmarkItem {
  type: "url" | "folder";
  id: number;
  index: number | null;
  parent_id: number;
  title: string;
  date_added?: string | null;
  date_modified?: string | null;
  special?: "main" | "toolbar" | "other_bookmarks" | null;
  url?: string;
  icon?: string | null;
  icon_uri?: string | null;
  tags?: string[];
  children?: BookmarkItem[];
}

// Indexer for bookmark items
const indexer = (item: BookmarkItem, index: number): number => {
  if (item.type === "url" || item.type === "folder") {
    item.index = index;
    index += 1;
  }
  return index;
};

// Parse <DT><A> URL tag
const parseUrl = (child: Element, parent_id: number): BookmarkItem => {
  const result: BookmarkItem = {
    type: "url",
    id: ID++,
    index: null,
    parent_id,
    url: child.getAttribute("href") || "",
    title: child.textContent?.trim() || "",
    date_added: child.getAttribute("add_date"),
    icon: child.getAttribute("icon"),
  };
  const iconUri = child.getAttribute("icon_uri");
  if (iconUri) result.icon_uri = iconUri;
  const tags = child.getAttribute("tags");
  if (tags) result.tags = tags.split(",");
  return result;
};

let ID = 1;

// Parse <DT><H3> folder tag
const parseFolder = (child: Element, parent_id: number): BookmarkItem => {
  const result: BookmarkItem = {
    type: "folder",
    id: ID++,
    index: null,
    parent_id,
    title: child.textContent?.trim() || "",
    date_added: child.getAttribute("add_date"),
    date_modified: child.getAttribute("last_modified"),
    special: null,
    children: [],
  };
  if (child.getAttribute("personal_toolbar_folder")) {
    result.special = "toolbar";
  }
  if (child.getAttribute("unfiled_bookmarks_folder")) {
    result.special = "other_bookmarks";
  }
  return result;
};

// Recursively parse <DL><p> lists and folders
const recursiveParse = (
  node: Element,
  parent_id: number,
): BookmarkItem[] | BookmarkItem => {
  let index = 0;
  if (node.tagName.toLowerCase() === "dt") {
    const folder = parseFolder(node.children[0], parent_id);
    const children = recursiveParse(
      node.children[1],
      folder.id,
    ) as BookmarkItem[];
    folder.children = children;
    return folder;
  } else if (node.tagName.toLowerCase() === "dl") {
    const data: BookmarkItem[] = [];
    for (const child of Array.from(node.children)) {
      const tag = child.children[0]?.tagName.toLowerCase();
      if (tag === "h3") {
        const folder = recursiveParse(child, parent_id) as BookmarkItem;
        index = indexer(folder, index);
        data.push(folder);
      } else if (tag === "a") {
        const url = parseUrl(child.children[0], parent_id);
        index = indexer(url, index);
        data.push(url);
      }
    }
    return data;
  }
  return [];
};

// Parse Chrome bookmark root
const parseRootChrome = (root: Element): BookmarkItem[] => {
  const otherBookmarks: BookmarkItem = {
    type: "folder",
    id: ID++,
    index: 1,
    parent_id: 0,
    title: "Other Bookmarks",
    date_added: null,
    date_modified: null,
    special: "other_bookmarks",
    children: [],
  };
  const result: BookmarkItem[] = [];
  let index = 0;
  for (const node of Array.from(root.children)) {
    if (node.tagName.toLowerCase() !== "dt") continue;
    const element = node.children[0];
    const tag = element.tagName.toLowerCase();
    if (tag === "a") {
      const url = parseUrl(element, otherBookmarks.id);
      index = indexer(url, index);
      otherBookmarks.children!.push(url);
    } else if (tag === "h3") {
      if (element.getAttribute("personal_toolbar_folder")) {
        const folder = recursiveParse(node, 0) as BookmarkItem;
        folder.index = 0;
        folder.special = "main";
        result[0] = folder;
      } else {
        const folder = recursiveParse(node, otherBookmarks.id) as BookmarkItem;
        index = indexer(folder, index);
        otherBookmarks.children!.push(folder);
      }
    }
  }
  if (otherBookmarks.children!.length > 0) {
    result.push(otherBookmarks);
  }
  return result;
};

// Parse Firefox bookmark root
const parseRootFirefox = (root: Element): BookmarkItem[] => {
  const bookmarks: BookmarkItem = {
    type: "folder",
    id: ID++,
    index: 0,
    parent_id: 0,
    title: "Bookmarks Menu",
    date_added: null,
    date_modified: null,
    special: "main",
    children: [],
  };
  let index = 0;
  let mainIndex = 1;
  const result: BookmarkItem[] = [bookmarks];
  for (const node of Array.from(root.children)) {
    if (node.tagName.toLowerCase() !== "dt") continue;
    const tag = node.children[0].tagName.toLowerCase();
    if (tag === "a") {
      const url = parseUrl(node.children[0], bookmarks.id);
      index = indexer(url, index);
      bookmarks.children!.push(url);
    } else if (tag === "h3") {
      const folder = recursiveParse(node, bookmarks.id) as BookmarkItem;
      if (folder.special) {
        folder.parent_id = 0;
        mainIndex = indexer(folder, mainIndex);
        result.push(folder);
      } else {
        index = indexer(folder, index);
        bookmarks.children!.push(folder);
      }
    }
  }
  return result;
};

// Main bookmark parsing function
export const parseBookmark = (htmlContent: string): BookmarkItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const heading = doc.querySelector("h1")?.textContent?.trim();
  const root = doc.querySelector("dl");
  if (!root) throw new Error("Invalid bookmark file: No <dl> tag found");
  ID = 1; // Reset ID counter
  if (heading === "Bookmarks") {
    return parseRootChrome(root);
  } else if (heading === "Bookmarks Menu") {
    return parseRootFirefox(root);
  } else {
    throw new Error("Unsupported bookmark file format");
  }
};

export const toBookmarkList = (data: BookmarkItem[]): BookmarkList[] => {
  const items: BookmarkItem[] = [...data];
  const result = new Map<string, BookmarkList>();

  for (; items.length > 0; ) {
    const it = items.pop();
    switch (it?.type) {
      case "folder":
        it.children?.forEach((ch, idx) => {
          switch (ch.type) {
            case "folder":
              items.push(ch);
              break;

            case "url":
              if (!ch.url || ch.url.length < 1) {
                return;
              }

              const tag = it.title;
              const d: BookmarkListItem = {
                favicon: ch.icon,
                faviconUri: ch.icon_uri,
                title: ch.title ?? "",
                description: "",
                url: ch.url,
                tag: tag,
              };

              let v = result.get(tag);
              if (!v) {
                v = {
                  id: ch.id,
                  name: tag,
                  children: [d],
                };

                result.set(tag, v);
              }

              v.children.push(d);

              break;

            default:
              console.warn("invalid children ", ch.type);
          }
        });

        break;

      case "url":
        if (!it.url || it.url.length < 1) {
          console.warn("bookmark no url");
          continue;
        }

        {
          const tag = "Something";
          const d: BookmarkListItem = {
            favicon: it.icon,
            faviconUri: it.icon_uri,
            title: it.title ?? "",
            description: "",
            url: it.url,
            tag: tag,
          };

          let v = result.get(tag);
          if (!v) {
            v = {
              id: it.id,
              name: tag,
              children: [d],
            };

            result.set(tag, v);
          }

          v.children.push(d);
        }
        break;

      default:
        console.warn("bookmark invalid type", it);
        break;
    }
  }

  const list: BookmarkList[] = [];
  result.forEach((v, _) => {
    list.push(v);
  });

  return list;
};

interface ScrapedData {
  url: string;
  title?: string;
  keywords?: string;
  description?: string;
  favicon?: string;
}

interface GroupedData {
  title: string;
  tag: "bookmark";
  children: ScrapedData[];
}

// Scrape website metadata
export const scrapeWebsite = async (url: string): Promise<ScrapedData> => {
  const CORS_PROXY = "https://corsproxy.io/?";
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(url), {
      // const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",

        // "Access-Control-Allow-Origin": "http://localhost:3000",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Headers": "*",
      },
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const content = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const result: ScrapedData = { url };
    const head = doc.querySelector("head");
    if (head) {
      const titleTag = head.querySelector("title");
      result.title = titleTag?.textContent?.trim() || "";

      const keywordsTag = head.querySelector('meta[name="keywords" i]');
      result.keywords = keywordsTag?.getAttribute("content")?.trim() || "";

      const descriptionTag = head.querySelector('meta[name="description" i]');
      result.description =
        descriptionTag?.getAttribute("content")?.trim() || "";

      let favicon = "";
      const faviconTags = head.querySelectorAll('link[rel*="icon" i]');
      for (const tag of faviconTags) {
        const href = tag.getAttribute("href") || "";
        if (href.endsWith(".svg")) {
          favicon = new URL(href, url).href;
          break;
        } else if (href.endsWith(".ico") && !favicon) {
          favicon = new URL(href, url).href;
        }
      }
      if (!favicon) {
        const defaultFavicon = new URL("/favicon.ico", url).href;
        try {
          const faviconResponse = await fetch(
            CORS_PROXY + encodeURIComponent(defaultFavicon),
          );
          if (faviconResponse.ok) favicon = defaultFavicon;
        } catch {}
      }
      result.favicon = favicon;
    }
    return result;
  } catch (e) {
    console.error(`Error scraping ${url}:`, e);
    return { url };
  }
};

// Fetch and format bookmarks
const fetchAndFormat = async (
  bookmarks: BookmarkItem[],
): Promise<GroupedData[]> => {
  const folder: BookmarkItem[] = [];
  for (const item of bookmarks) {
    if (item && item.type === "folder") folder.push(item);
  }

  const jdata: GroupedData[] = [];
  while (folder.length > 0) {
    const item = folder.shift()!;
    const group: ScrapedData[] = [];
    for (const ch of item.children || []) {
      if (ch.type === "folder") {
        folder.push(ch);
        continue;
      }
      const ret = await scrapeWebsite(ch.url!);
      group.push(ret);
    }
    jdata.push({ title: item.title, tag: "bookmark", children: group });
  }
  return jdata;
};
