import {
  ZoteroCollection,
  ZoteroConfig,
  ZoteroItem,
  ZoteroItemData,
} from "./types";

const ZOTERO_API_BASE = "https://api.zotero.org";

export class ZoteroClient {
  private config: ZoteroConfig;

  constructor(config: ZoteroConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      "Zotero-API-Key": this.config.apiKey,
      "Zotero-API-Version": "3",
    };
  }

  private getItemsBasePath(collectionId?: string | null): string {
    const targetCollection = collectionId ?? this.config.collectionId;
    if (targetCollection) {
      return `/users/${this.config.userId}/collections/${targetCollection}/items/top`;
    }

    return `/users/${this.config.userId}/items/top`;
  }

  async getCollectionItems(
    limit = 20,
    collectionId?: string | null,
  ): Promise<ZoteroItem[]> {
    const url = `${ZOTERO_API_BASE}${this.getItemsBasePath(collectionId)}?limit=${limit}&sort=dateModified&direction=desc`;

    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Zotero items: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as ZoteroItem[];
  }

  async searchCollectionItems(
    query: string,
    limit = 20,
    collectionId?: string | null,
  ): Promise<ZoteroItem[]> {
    const encoded = encodeURIComponent(query);
    const url = `${ZOTERO_API_BASE}${this.getItemsBasePath(collectionId)}?limit=${limit}&q=${encoded}&qmode=everything`;

    const response = await fetch(url, { headers: this.getHeaders() });
    if (!response.ok) {
      throw new Error(
        `Failed to search Zotero items: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as ZoteroItem[];
  }

  async getCollections(limit = 200): Promise<ZoteroCollection[]> {
    const all: ZoteroCollection[] = [];
    const seen = new Set<string>();

    const fetchCollectionPage = async (
      path: string,
      start: number,
      parentKey?: string,
    ): Promise<ZoteroCollection[]> => {
      const url = `${ZOTERO_API_BASE}${path}?limit=${limit}&start=${start}`;
      const response = await fetch(url, { headers: this.getHeaders() });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Zotero collections: ${response.status} ${response.statusText}`,
        );
      }

      const items = (await response.json()) as Array<{
        key: string;
        data?: { name?: string; parentCollection?: string };
      }>;

      return items
        .map((item) => ({
          key: item.key,
          name: item.data?.name || "",
          parentCollection: item.data?.parentCollection || parentKey,
        }))
        .filter((item) => item.name);
    };

    const fetchRecursive = async (parentKey?: string) => {
      const path = parentKey
        ? `/users/${this.config.userId}/collections/${parentKey}/collections`
        : `/users/${this.config.userId}/collections`;
      let start = 0;
      while (true) {
        const page = await fetchCollectionPage(path, start, parentKey);
        if (page.length === 0) break;
        for (const collection of page) {
          if (seen.has(collection.key)) continue;
          seen.add(collection.key);
          all.push(collection);
        }
        if (page.length < limit) break;
        start += page.length;
      }

      const children = all.filter(
        (collection) => collection.parentCollection === parentKey,
      );
      for (const child of children) {
        await fetchRecursive(child.key);
      }
    };

    await fetchRecursive();
    return all;
  }

  async getItemNotes(itemKey: string): Promise<string[]> {
    const url = `${ZOTERO_API_BASE}/users/${this.config.userId}/items/${itemKey}/children`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Zotero notes: ${response.status} ${response.statusText}`,
      );
    }

    const items = (await response.json()) as ZoteroItem[];
    const notes: string[] = [];

    for (const item of items) {
      if (!item.data?.itemType) continue;
      const itemType = item.data.itemType;

      if (itemType === "note") {
        const text = stripNoteHtml(item.data.note);
        if (text) notes.push(text);
      }

      if (itemType === "annotation") {
        const annotationParts = [
          item.data.annotationText,
          item.data.annotationComment,
          item.data.annotationPageLabel
            ? `Page ${item.data.annotationPageLabel}`
            : "",
        ]
          .filter(Boolean)
          .join(" - ");
        const annotationText = annotationParts.trim();
        if (annotationText) notes.push(annotationText);
      }
    }

    return notes;
  }

  static formatAuthors(creators: ZoteroItemData["creators"]): string {
    if (!creators || creators.length === 0) return "Unknown Author";
    return creators
      .map(
        (creator) =>
          creator.name ||
          `${creator.firstName || ""} ${creator.lastName || ""}`.trim(),
      )
      .join(", ");
  }

  static extractYear(dateString?: string): string {
    if (!dateString) return "";
    const match = dateString.match(/\d{4}/);
    return match ? match[0] : dateString;
  }

  static formatItemType(type?: string): string {
    if (!type) return "";
    return type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}

function stripNoteHtml(note?: string): string {
  return note?.trim() || "";
}
