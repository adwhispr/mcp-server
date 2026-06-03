# adwhispr-mcp-server

[![smithery badge](https://smithery.ai/badge/basil/adwhispr)](https://smithery.ai/servers/basil/adwhispr)

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

---

## Troubleshooting

**AdWhispr doesn't appear in Claude after install.**
Fully quit Claude Desktop (not just close the window) and reopen it — config is only read on startup. Confirm the entry exists in `claude_desktop_config.json` (paths above). On macOS/Linux make sure `npx` is on your `PATH`; if Claude can't find it, set the `command` to the absolute path from `which npx`.

**The browser sign-in window never opens, or login loops.**
The first tool call opens a browser to authorize via OAuth. If it doesn't appear, check that your default browser can open and that no firewall is blocking `localhost` callbacks. Clearing the stale auth cache fixes most loops:

```bash
rm -rf ~/.mcp-auth
```

Then restart Claude Desktop and trigger a tool call again.

**"Authentication required" or tools return an auth error.**
Your AdWhispr session expired or wasn't completed. Re-run the sign-in (clear `~/.mcp-auth` as above), or sign in directly at [adwhispr.com](https://adwhispr.com) first, then retry.

**A tool returns an upgrade / out-of-quota / "locked clone" message.**
That's expected on the Free tier (5 tool calls/month, 1 brand, 1 clone). The message includes an unlock link — open it to upgrade or buy a credit pack. Relay the link as-is; the clone is generated and waiting behind it.

**`add_brand` says a brand isn't found, or `search_brands` returns nothing.**
`add_brand` resolves brands from the Meta Ad Library by name — try the exact brand name as it appears on Facebook. After adding, ingestion runs in the background (~40s) before ads are queryable. `search_brands` only returns brands already tracked on your account.

**Node / `npx` errors on launch.**
Use Node 18+ (`node --version`). If an old cached package is misbehaving, force a fresh copy: `npx -y adwhispr-mcp-server@latest serve`.

**Connecting a non-Claude-Desktop client.**
Point any stdio MCP client at `npx -y adwhispr-mcp-server serve`, or connect directly to the remote endpoint `https://adwhispr.com/api/mcp` if your client supports remote MCP servers with OAuth.

Still stuck? Open an issue at [github.com/adwhispr/mcp-server/issues](https://github.com/adwhispr/mcp-server/issues) or email basil@adwhispr.com.

## Links

- Website: https://adwhispr.com
- Tutorial: *How to chat with any brand's Meta ads inside Claude in 90 seconds* — https://adwhispr.com/blog (coming soon)
- Issues: https://github.com/adwhispr/mcp-server/issues

## License

MIT © AdWhispr
