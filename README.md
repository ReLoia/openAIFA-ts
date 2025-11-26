# Unofficial AIFA API Client

## Authentication & Token

**Important:** This client requires a **Basic Token** to initialize. 

This token is used internally by the official AIFA mobile app to exchange for a Bearer token. **This token is not included in this repository.**

To use this library, you must obtain the Basic Token yourself by reverse-engineering the official application or inspecting its network traffic. Do not commit this token to public repositories.

## Features

- **Full Database Search:** Downloads and caches the official medicine database for fast, offline-first searching.
- **Auto-Update:** Automatically checks the remote API version and updates the local cache if the database has changed.
- **Detailed Info:** Retrieve specific packaging details, reimbursement classes, and storage conditions using the AIC code.

## Usage

### Initialization

```typescript
import { AifaClient } from './client';

// The token you obtained from the official app
const client = new AifaClient('YOUR_OBTAINED_BASIC_TOKEN');
```

### Searching Medicines

The search runs against a local JSON database. If the database is missing or outdated, it will be downloaded automatically during the first request.

```typescript
const results = await client.searchMedicines('augmentin');
console.log(results);
```

### Getting Container Details

Fetch specific details about a medicine package using its AIC (Autorizzazione Immissione Commercio) code.

```typescript
const details = await client.getContainerInfo('026089019');
console.log(details);
```

### Manual Database Update

You can force a database update or check versions manually.

```typescript
// Get remote version string
const version = await client.getDatabaseVersion();

// Force re-download of the database ignoring cache
await client.fetchDatabase(true);
```

## Caching

The library creates a `./cache` directory in your project root.
- `aifa_db.json`: The decompressed full database (JSON).
- `version.txt`: The current version string of the local database.

Ensure your environment has write permissions for this directory.

# Disclaimer

This library is an unofficial wrapper and is not affiliated with, endorsed by, or connected to AIFA (Agenzia Italiana del Farmaco).  
It is intended for private, educational use and personal data interoperability. Use responsibly.
