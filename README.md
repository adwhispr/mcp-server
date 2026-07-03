# adwhispr-mcp-server

[![smithery badge](https://smithery.ai/badge/basil/adwhispr)](https://smithery.ai/servers/basil/adwhispr)

Research any brand's ads, clone the winners, and launch them — from a chat. This connects [Claude](https://claude.ai) (or any MCP client) to **[AdWhispr](https://adwhispr.com/connect?ref=mcp_readme&utm_source=mcp_readme&utm_medium=readme&to=/)** — the full loop in one conversation:

1. **Research** a competitor's ad library (Meta + TikTok) and surface their longest-running, proven winners
2. **Clone** the winning creative — image or video — for your own brand
3. **Launch** it as a real campaign: Google Search and Performance Max (GA), TikTok (GA), Meta (beta)

> *"Find the longest-running ad from my biggest competitor, clone it for my brand, and launch it on TikTok with a $50/day budget."*

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
> *"Launch that clone on Google as a Search campaign, $30/day, paused."*

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

Any MCP client that runs a stdio command works — point it at `npx -y adwhispr-mcp-server serve`, or connect directly to the remote endpoint `https://adwhispr.com/api/mcp` if your client supports remote MCP servers with OAuth (Claude.ai, ChatGPT developer mode, Cursor, Claude Code).

---

## Tools (27)

### Research — competitor intelligence

| Tool | What it does |
|------|--------------|
| `search_brands` | Find brands tracked in AdWhispr by name (returns ad counts + IDs). |
| `add_brand` | Start tracking a new competitor brand (kicks off ad-library ingestion). |
| `get_brand_ads` | A brand's ads with hooks, formats, days-running, and creative links. |
| `get_brand_stats` | Aggregated stats: ad counts, hook/format distributions, spend ranges. |
| `search_ads` | Semantic search across a brand's ads by concept ("before/after", "social proof"). |
| `compare_brands` | Compare 2–3 brands side by side. |
| `generate_brief` | Competitive brief for a brand: longevity curve, top hooks, format mix, verdict. |
| `research_tiktok_ads` | Research a competitor's TikTok ads (video, thumbnails, run dates). |
| `research_keywords` | Google keyword intelligence: volume, competition, CPC ranges. |
| `research_competitor_keywords` | The keywords a competitor's domain ranks and bids on. |
| `get_my_brand` / `save_my_brand` | Remember your product/brand so research is personalized. |

### Creative — clone the winners

| Tool | What it does |
|------|--------------|
| `clone_ad` | Clone a competitor's winning Meta ad for your brand — a real generated image for image ads, a scene-by-scene script for video ads. |
| `clone_tiktok_ad` | Same, for a TikTok ad. |
| `list_my_creatives` | Your generated creatives, ready to launch. |

### Launch & manage — real campaigns

| Tool | What it does |
|------|--------------|
| `connect_ad_account` | OAuth-connect your Google, TikTok, or Meta ad account. |
| `list_ad_accounts` / `list_campaigns` | See what's connected and what's running. |
| `launch_search_campaign` | Launch a Google Search campaign (GA). |
| `launch_pmax_campaign` | Launch a Google Performance Max campaign, assets auto-generated (GA). |
| `launch_tiktok_campaign` | Launch a TikTok video campaign (GA). |
| `launch_campaign` / `launch_cloned_ad` | Launch a cloned creative in one step (Meta execution is **beta**). |
| `get_account_performance` | Real performance from your connected account. |
| `update_budget` / `pause_campaign` / `resume_campaign` | Manage what's live. |

Campaigns are created **paused by default** with an explicit confirm step before anything spends. AdWhispr never fabricates performance metrics — competitor research reports only signals that can be verified (days-running, not made-up ROAS).

---

## Pricing

Flat pricing — research tool calls are never metered on paid plans.

- **Free** — 5 tool calls/month, 1 tracked brand, 1 free clone. No card.
- **Pro** — $39/mo: unlimited research calls, 10 clones/month.
- **Agency** — $149/mo: multi-brand, 50 clones/month, cross-brand comparison.

Full limits + trial at [adwhispr.com/upgrade](https://adwhispr.com/connect?ref=mcp_readme&utm_source=mcp_readme&utm_medium=readme&to=/upgrade).

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
`add_brand` resolves brands from the public ad library by name — try the exact brand name as it appears on Facebook. After adding, ingestion runs in the background (~40s) before ads are queryable. `search_brands` only returns brands already tracked on your account.

**A launch tool says an ad account isn't connected.**
Run `connect_ad_account` first — it returns an OAuth link to connect Google, TikTok, or Meta. Campaigns are created paused; nothing spends until you confirm.

**Node / `npx` errors on launch.**
Use Node 18+ (`node --version`). If an old cached package is misbehaving, force a fresh copy: `npx -y adwhispr-mcp-server@latest serve`.

**Connecting a non-Claude-Desktop client.**
Point any stdio MCP client at `npx -y adwhispr-mcp-server serve`, or connect directly to the remote endpoint `https://adwhispr.com/api/mcp` if your client supports remote MCP servers with OAuth.

Still stuck? Open an issue at [github.com/adwhispr/mcp-server/issues](https://github.com/adwhispr/mcp-server/issues) or email basil@adwhispr.com.

## Links

- Website: https://adwhispr.com/connect?ref=mcp_directory
- Claude plugin: https://github.com/adwhispr/claude-plugin
- Blog / guides: https://adwhispr.com/blog
- Issues: https://github.com/adwhispr/mcp-server/issues

## License

MIT © AdWhispr
