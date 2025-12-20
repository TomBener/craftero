/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Zotero Mode - Local uses Zotero desktop; Web uses the Zotero API */
  "zotero_mode": "local" | "web",
  /** Zotero Path - Local Zotero database path */
  "zotero_db_path": string,
  /** Cache Period (in minutes) - Minutes after which cache must be updated */
  "cache_period": string,
  /** Zotero User ID (Web mode only) - Your Zotero user id (7 digits) */
  "zotero_user_id"?: string,
  /** Zotero API Key (Web mode only) - Zotero API key with library access */
  "zotero_api_key"?: string,
  /** Zotero Collection ID (Web mode only) - Leave empty to search the full library */
  "zotero_collection_id"?: string,
  /** Craft API Base URL - Example: https://connect.craft.do/links/XXXX/api/v1 */
  "craft_api_base": string,
  /** Craft API Key - Craft API token (leave empty if your Craft API link is public) */
  "craft_api_key"?: string,
  /** Craft Space ID - Used to open items via craftdocs:// deep links */
  "craft_space_id"?: string,
  /** Craft Collection ID - Craft collection to receive items */
  "craft_collection_id": string,
  /** Craft Daily API Base URL - Optional Daily Notes API base URL to link Reading Date */
  "craft_daily_api_base"?: string,
  /** Craft Daily API Key - Optional Daily Notes API key */
  "craft_daily_api_key"?: string,
  /** Max Items - Number of recent items to sync */
  "max_items": string,
  /** undefined - Include Zotero notes in the Craft item body */
  "sync_notes": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `commandSyncZoteroToCraft` command */
  export type CommandSyncZoteroToCraft = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `commandSyncZoteroToCraft` command */
  export type CommandSyncZoteroToCraft = {}
}

