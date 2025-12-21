# Craftero

<div align="center">
  <img src="assets/command-icon.png" alt="Craftero command icon" width="160" />
</div>

<div align="center">
  <p><strong>A Raycast extension to sync Zotero items to Craft collections</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#configuration">Configuration</a> •
    <a href="#development">Development</a>
  </p>
</div>

---

## Overview

Craftero bridges your research workflow between Zotero and Craft. It enables fast, fuzzy searching of your Zotero library directly from Raycast and syncs items into structured Craft collections with intelligent field mapping.

### Key Highlights

- **Local-first**: Reads directly from your Zotero SQLite database (no cloud API required)
- **Fuzzy search**: Powered by Fuse.js for fast, typo-tolerant searches
- **Smart field mapping**: Automatically maps Zotero metadata to Craft collection fields
- **Citation key support**: Extracts citation keys from the Extra field
- **Notes & annotations**: Optionally sync Zotero notes and PDF annotations to Craft
- **Deduplication**: Updates existing items instead of creating duplicates
- **Daily note linking**: Link items to daily notes for reading dates

## Features

### Search & Sync
- Search Zotero items by title, authors, tags, DOI, abstract, and citation keys
- Tag filtering with `.tag1 .tag2` syntax
- Sync individual items or all search results at once
- Open synced items directly in Craft or Zotero

### Field Mapping
Automatically maps Zotero fields to Craft collection fields (case-insensitive):

| Zotero Field | Craft Field Synonyms |
|--------------|---------------------|
| Creators | Authors, Author, Creators |
| Date | Year, Publication Year |
| Publication/Publisher/Journal | Journal, Publisher |
| URL/DOI | URL, Link, DOI |
| Item Type | Publication Type, Item Type, Type |
| Citation Key | Citation Key, CiteKey |
| Abstract | Abstract, Summary |
| Tags | Tags, Tag |
| Date Added | Date Added, Added |
| Zotero Link | Zotero Link, Zotero URI |

### AI Integration
Generate prompts for AI summarization with Cmd+S, copying a formatted prompt to your clipboard for use with Claude, ChatGPT, or other AI assistants.

## Installation

### Prerequisites
- macOS
- [Raycast](https://raycast.com/) installed
- [Zotero](https://www.zotero.org/) with a local library
- [Craft](https://www.craft.do/) with a collection set up

### Install from Raycast Store
1. Open Raycast
2. Search for "Craftero" in the store
3. Click Install

### Manual Installation
```bash
git clone https://github.com/yourusername/craftero.git
cd craftero
npm install
npm run build
```

Then import the extension into Raycast.

## Configuration

Open Raycast → Extensions → Craftero → Preferences:

### Zotero Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Zotero Path** | Path to your Zotero SQLite database | `~/Zotero/zotero.sqlite` |
| **Cache Period** | Minutes to cache database reads | `10` |
| **Collection ID** | Optional: Filter to a specific Zotero collection | - |

> **Note**: If you see database lock errors, quit Zotero and retry.

### Craft Settings

| Setting | Description | Required |
|---------|-------------|----------|
| **API Base URL** | Your Craft API endpoint (e.g., `https://connect.craft.do/links/XXXX/api/v1`) | Yes |
| **API Key** | Craft API token (leave empty if your link is public) | No |
| **Space ID** | For deep links (`craftdocs://`) | No |
| **Collection ID** | Target collection ID | Yes |

> **Getting your Craft API endpoint**: Create a connection in Craft → Settings → Connections → Create → All Documents, then copy the API endpoint.

> **Getting Collection ID**: Use the Craft API `GET /collections` to list collections and copy the target `id`.

### Other Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Sync Notes** | Include Zotero notes/annotations in synced items | `false` |
| **Max Items** | Maximum search results to display | `10` |

## Usage

1. Open Raycast and search for **Craftero**
2. Type your search query (title, author, tag, etc.)
3. Use tag filters: `.deep-learning .transformers` finds items with both tags
4. Select an item and choose an action:

### Actions

| Action | Shortcut | Description |
|--------|----------|-------------|
| **Sync Item to Craft** | Enter | Sync selected item |
| **Sync & Open in Craft** | Cmd+Return | Sync and open in Craft |
| **Sync & AI Summarize** | Cmd+S | Copy AI summarization prompt |
| **Open in Zotero** | Cmd+Shift+Z | Open item in Zotero |
| **Delete from Craft** | Cmd+Shift+D | Remove from Craft collection |
| **Sync All Results** | Cmd+Shift+A | Sync all visible results |

## Project Structure

```
craftero/
├── src/
│   ├── commandSyncZoteroToCraft.tsx  # Main Raycast command UI
│   └── lib/
│       ├── types.ts                   # TypeScript type definitions
│       ├── localZotero.ts             # SQLite database reader
│       ├── craft.ts                   # Craft API client
│       ├── mapping.ts                 # Field mapping logic
│       └── zotero.ts                  # Zotero utility functions
├── assets/
│   └── command-icon.png               # Extension icon
├── package.json                       # Extension manifest
└── README.md
```

### Core Modules

#### `commandSyncZoteroToCraft.tsx`
Main React component providing the Raycast UI, search interface, and sync orchestration.

#### `lib/localZotero.ts`
- Reads Zotero's SQLite database using sql.js
- Implements fuzzy search with Fuse.js
- Caches database reads for performance
- Supports Better BibTeX citation keys

#### `lib/craft.ts`
- REST API client for Craft
- Handles collection schema, items, and blocks
- Manages item creation, updates, and deletion
- Daily note resolution for reading dates

#### `lib/mapping.ts`
- Maps Zotero fields to Craft collection properties
- Normalizes field names with synonym matching
- Handles dates, tags, and select options
- Extracts citation keys from Extra field

#### `lib/zotero.ts`
- Utility functions for formatting Zotero data
- Author formatting, year extraction, item type conversion

## Development

### Setup
```bash
npm install
npm run dev
```

### Commands
```bash
npm run build      # Build extension
npm run lint       # Run ESLint and Prettier
npm publish        # Publish to Raycast store
```

### Tech Stack
- **TypeScript** - Type-safe development
- **React** - UI framework (via Raycast API)
- **sql.js** - SQLite database access
- **Fuse.js** - Fuzzy search
- **Raycast API** - Extension framework

## How It Works

1. **Search**: Craftero loads your Zotero database and indexes items with Fuse.js
2. **Field Mapping**: When syncing, it fetches the Craft collection schema and intelligently maps Zotero fields
3. **Deduplication**: Checks existing items by Zotero URI to update instead of creating duplicates
4. **Notes Processing**: If enabled, extracts and formats notes/annotations with HTML entity decoding
5. **Daily Note Linking**: Resolves the current daily note and creates a block link for the Reading Date field

## Citation Keys

Citation keys are extracted from the Zotero **Extra** field. Format:
```
Citation Key: yourkey2024
```

Better BibTeX users: Citation keys are automatically detected.

## Field Types

Craftero supports all Craft field types:
- Text, Number, URL, Email, Phone
- Date fields
- Single/Multi-select (with fuzzy option matching)
- Tags (multi-select)
- Block links (for daily notes)

## Troubleshooting

### Database locked
**Issue**: "Database is locked" error
**Solution**: Quit Zotero and retry. Zotero locks the database while running.

### Daily note not found
**Issue**: Reading Date field is empty
**Solution**: The daily note for today doesn't exist yet. Create it in Craft or the field will be skipped.

### Field not mapping
**Issue**: Zotero data not appearing in Craft
**Solution**: Check that your Craft collection has a field with a matching name (see [Field Mapping](#field-mapping)). Field names are case-insensitive.

### No results found
**Issue**: Search returns no results
**Solution**:
- Check that Zotero database path is correct
- Try a simpler query
- Check cache period settings

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

- Built with [Raycast API](https://developers.raycast.com/)
- Uses [Craft API](https://developer.craft.do/)
- Zotero database access via [sql.js](https://github.com/sql-js/sql.js/)
- Fuzzy search powered by [Fuse.js](https://fusejs.io/)

---

<div align="center">
  <p>Made with ❤️ for researchers</p>
  <p>
    <a href="https://github.com/yourusername/craftero">GitHub</a> •
    <a href="https://github.com/yourusername/craftero/issues">Issues</a> •
    <a href="https://github.com/yourusername/craftero/blob/main/LICENSE">License</a>
  </p>
</div>
