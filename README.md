# adwhispr-mcp-server

Chat with any brand's Meta ads inside Claude. This connects [Claude](https://claude.ai) to **[AdWhispr](https://adwhispr.com)** — research a competitor's Facebook/Instagram ad library, find their longest-running winners, and clone the creative for your own brand, all from a Claude conversation.

It's a thin, open-source bridge to the AdWhispr remote MCP server (`https://adwhispr.com/api/mcp`). Sign-in happens automatically through your browser the first time.

---

## Install (Claude Desktop) — 3 steps

```bash
npx adwhispr-mcp-server config
```

1. Run the command above. It adds AdWhispr to your Claude Desktop config.
2. **Fully quit and reopen Claude Desktop.**
3. Start a chat — a browser window opens once to sign in to AdWhispr. Done.

Then try:

> *"Search AdWhispr for Nike's longest-running ads."*
> *"What hooks is Hims using in their Meta ads?"*
> *"Clone Cal AI's top ad for my brand at example.com."*

### Manual setup

Prefer to edit the config yourself? Add this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "adwhispr": {
      "command": "npx",
      "args": ["-y", "adwhispr-mcp-server", "serve"]
    }
  }
}
```

Config file location:
- **macOS** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux** `~/.config/Claude/claude_desktop_config.json`

### Other MCP clients

Any MCP client that runs a stdio command works — point it at `npx -y adwhispr-mcp-server serve`, or connect directly to the remote endpoint `https://adwhispr.com/api/mcp` if your client supports remote MCP servers with OAuth.

---

## Tools

| Tool | What it does |
|------|--------------|
| `search_brands` | Find brands tracked in AdWhispr by name (returns ad counts + IDs). |
| `get_brand_ads` | Get a brand's ads with hooks, formats, performance signals, and creative links. |
| `get_brand_stats` | Aggregated stats for a brand: ad counts, hook/format distributions, spend ranges. |
| `search_ads` | Semantic search across a brand's ads by concept ("before/after", "social proof"). |
| `compare_brands` | Compare 2–3 brands side by side. |
| `add_brand` | Start tracking a new competitor brand (kicks off Meta ingestion). |
| `clone_ad` | Clone a competitor's winning ad for your brand — a real generated image for image ads, a scene-by-scene script for video ads. |

---

## Pricing

- **Free** — 5 tool calls/month, 1 tracked brand, 1 free clone.
- **Pro** — $29/mo (3-day free trial): unlimited tool calls, 3 brands, 10 clones/month.
- **Agency** — $149/mo: 10+ brands, 50 clones/month, cross-brand comparison.

Start a trial at [adwhispr.com/upgrade](https://adwhispr.com/upgrade).

---

## How it works

Claude Desktop launches `npx -y adwhispr-mcp-server serve`, which runs [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) pointed at `https://adwhispr.com/api/mcp`. That bridges Claude's local stdio transport to the AdWhispr server over HTTP and handles the OAuth login. Your ad data and account live on AdWhispr; this package stores nothing.

To point at a different server (self-hosting/testing), set `ADWHISPR_MCP_URL`.

## Links

- Website: https://adwhispr.com
- Tutorial: *How to chat with any brand's Meta ads inside Claude in 90 seconds* — https://adwhispr.com/blog (coming soon)
- Issues: https://github.com/basilnas/mcp-server/issues

## License

MIT © AdWhispr
