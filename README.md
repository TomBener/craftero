# Zotero to Craft (Raycast)

Search Zotero items and sync them into a Craft collection.

## Setup

1. Create a Craft API token and note your Craft API base URL (for example `https://connect.craft.do/links/XXXX/api/v1`).
2. Choose Zotero mode: **Local (Zotero Desktop)** or **Web (Zotero API)**.
3. Fill the Raycast preferences for this extension.

## Where to fill in values

Open Raycast and go to **Extensions** → **Zotero to Craft** → **Preferences**. Fill the fields below. Raycast does not support hiding preferences based on a dropdown, so fields for the other mode remain visible; you can ignore them.

- **Zotero Mode**: default is **Local (Zotero Desktop)**. Web mode uses the Zotero API.
- **Zotero Path**: local Zotero database path (default `~/Zotero/zotero.sqlite`).
- **Cache Period (in minutes)**: how long to cache local DB reads.
- **Zotero User ID**: required only in Web mode; numeric id from your profile URL, e.g. `https://www.zotero.org/users/1234567`.
- **Zotero API Key**: required only in Web mode; create at `https://www.zotero.org/settings/keys`.
- **Zotero Collection ID**: Web mode only. Open the collection on zotero.org and copy the key from the URL segment `/collections/<KEY>`. Leave empty to search your full library.
- **Craft API Base URL**: your Craft API endpoint base, e.g. `https://connect.craft.do/links/<LINK_ID>/api/v1`. Use an **All Documents** connection.
- **Craft API Key**: create in Craft → Settings → Advanced → API Access. If your Craft API link is set to **Public**, you can leave this empty.
- **Craft Space ID**: optional, used for `craftdocs://` deep links.
- **Craft Collection ID**: use the Craft API `GET /collections` to list collections and copy the target `id`.
- **Craft Daily API Base URL**: optional. Add a **Daily Notes & Tasks** API connection to enable a clickable Reading Date link.
- **Craft Daily API Key**: optional, only needed if the Daily Notes API link is private.
- **Sync Notes**: include Zotero notes/annotations in the Craft item body (if present). When off, the item body is left empty.
- **Max Items**: number of results to fetch per search (default 10).

## Usage

Run the "Sync Zotero to Craft" command. Type in the search bar to search Zotero; then choose **Sync Item to Craft** or **Sync All Results** from the actions.

## Notes about content

By default, the extension only fills collection fields (metadata) and leaves the page body empty. If **Sync Notes** is enabled, any Zotero notes/annotations are added to the page body under a “Notes” heading.

Items are de-duplicated by normalized title; existing Craft items with the same title are updated instead of re-created.

Citation keys are read from the item’s **Extra** field (for example `Citation Key: foo2020`) in both modes. If no citation key is present in **Extra**, the field is left empty in Craft.

Local mode reads the Zotero SQLite database directly; no Better BibTeX plugin is required. If you see database-lock errors, quit Zotero and retry. Web mode uses the Zotero API.

If your Reading Date field is a link-to-block field, the extension only fills it when a Daily Notes API base URL is configured. Otherwise it remains empty. If you don’t need a link, change the field type to a Date field.

If you use a **Selected Documents** API connection (not All Documents), daily notes are outside the scope of that API. In that case the Reading Date link cannot be resolved and will be left empty. To make it clickable, use an **All Documents** connection or switch the field to a Date type.

## Field mapping

The sync tries to match Craft collection fields by name (case-insensitive) and fills them when available:

- Authors
- Year / Publication Year
- Journal / Publisher
- URL
- Zotero URI
- Date Added
- Publication Type
- Citation Key
- Abstract
- Tags
- Reading Status (if your options include values like "To Read" or "Waiting")

If your collection uses different field names, rename them or add aliases that match the list above.

## Development

```bash
npm install
npm run dev
```

Useful commands:

- `npm run lint`
- `npm run build`

## License

MIT
