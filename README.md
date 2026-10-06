# adwhispr-mcp-server

[![smithery badge](https://smithery.ai/badge/basil/adwhispr)](https://smithery.ai/servers/basil/adwhispr)

See who is running ads in your space, clone a winning ad for your brand, and launch it, all from a chat. This connects [Claude](https://claude.ai) (or any MCP client) to **[AdWhispr](https://adwhispr.com/connect?ref=mcp_readme&utm_source=mcp_readme&utm_medium=readme&to=/)**.

The whole loop happens in one conversation:

1. **Research.** Find the brands advertising in your space right now and see their longest-running ads.
2. **Clone.** Rebuild a winning ad for your own brand, as an image or a video.
3. **Launch.** Put it live as a real campaign on Meta, Google, TikTok, X, or ChatGPT Ads, and manage it from the same chat.

> *"Find the longest-running ad from my biggest competitor, clone it for my brand, and launch it on TikTok with a $50/day budget."*

This package is a thin, open-source bridge to the AdWhispr server at `https://adwhispr.com/api/mcp`. Sign-in happens in your browser the first time you use it.

---

## Install (Claude Desktop)

```bash
npx adwhispr-mcp-server config
```

1. Run the command above. It adds AdWhispr to your Claude Desktop config.
2. **Fully quit and reopen Claude Desktop.**
3. Start a chat. A browser window opens once so you can sign in to AdWhispr. Done.

Then try:

> *"Who is running ads in my space?"*
>
> *"Show me [competitor]'s longest-running ads."*
>
> *"Clone a winning ad for my brand."*
>
> *"Launch a new campaign from my creatives, paused until I OK it."*
>
> *"Optimize my ad spend."*

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

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

### Other apps

- **Apps that sign in for you** (Claude.ai, ChatGPT, Cursor, Claude Code, Grok): skip this package and connect straight to `https://adwhispr.com/api/mcp`.
- **Apps that run a local command:** point them at `npx -y adwhispr-mcp-server serve`.
- **DeepSeek Harness:** use the plugin [`dsh-plugin-adwhispr`](https://www.npmjs.com/package/dsh-plugin-adwhispr).
- **Pi:** use [`pi-adwhispr`](https://www.npmjs.com/package/pi-adwhispr).

Setup guides for each app: [adwhispr.com/integrations](https://adwhispr.com/integrations).

---

## What you can do

### Research competitors

- Find the brands confirmed to be advertising in your space right now, ranked by how many ads they are running.
- See any brand's ads with the hook, format, copy, how long each has been running, and the creative itself.
- Search a brand's ads by idea, such as "before and after" or "social proof".
- Compare brands side by side, or get a written brief on one brand's ad strategy.
- Research TikTok ads and Google keywords, including the keywords a competitor's site shows up for.
- Save your own brand and products once, so research and clones are tailored to you.

### Make your own creative

- Clone a competitor's winning image or video ad for your brand.
- Turn an Instagram reel, a TikTok, or your own video into an ad.
- Make a video ad from your own script or a plain-English idea.
- Review and change the script before anything is made. Nothing renders until you approve it.

### Launch and manage campaigns

- Connect your own ad accounts: Meta, Google, TikTok, X, and ChatGPT Ads.
- Launch campaigns from your creatives, including Google Search and Performance Max.
- Check real performance from your connected accounts.
- Change budgets, pause, and resume.

Campaigns are created **paused by default**, so nothing spends until you say go. AdWhispr never makes up performance numbers. Competitor research reports only what can be verified, such as how long an ad has been running.

---

## Pricing

Flat monthly plans. No per-call overage billing.

| Plan | Price | Agent calls / month | Image clones / month | Video credits / month |
| --- | --- | --- | --- | --- |
| **Free** | $0 | 15 | 1 free clone | 0 |
| **Pro** | $39/mo ($31/mo billed annually) | 150 | 10 | 15 |
| **Plus** | $69/mo ($55/mo billed annually) | 1,000 | 25 | 25 |
| **Agency** | $149/mo ($119/mo billed annually) | 3,000 | 50 | 40 |

Tracked brands are unlimited on every plan. Agency adds team seats.

Current plans and limits: [adwhispr.com/upgrade](https://adwhispr.com/connect?ref=mcp_readme&utm_source=mcp_readme&utm_medium=readme&to=/upgrade).

---

## How it works

Claude Desktop runs `npx -y adwhispr-mcp-server serve`, which starts [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) pointed at `https://adwhispr.com/api/mcp`. That connects Claude to the AdWhispr server and handles the browser sign-in. Your sign-in is kept on your own computer in `~/.mcp-auth`. Your ad data and account live on AdWhispr. This package stores nothing else.

To point at a different server for testing, set `ADWHISPR_MCP_URL`.

---

## Troubleshooting

**AdWhispr does not appear in Claude after install.**
Fully quit Claude Desktop (closing the window is not enough) and reopen it. The config is only read on startup. Confirm the entry exists in `claude_desktop_config.json` (paths above). On macOS and Linux, make sure `npx` is on your `PATH`. If Claude cannot find it, set `command` to the full path from `which npx`.

**The browser sign-in window never opens, or sign-in loops.**
The first request opens a browser so you can sign in. If it does not appear, check that your default browser can open and that no firewall is blocking `localhost`. Clearing the saved sign-in fixes most loops:

```bash
rm -rf ~/.mcp-auth
```

Then restart Claude Desktop and ask it something again.

**"Authentication required", or requests return a sign-in error.**
Your AdWhispr sign-in expired or was not completed. Clear `~/.mcp-auth` as above and sign in again, or sign in at [adwhispr.com](https://adwhispr.com) first and then retry.

**You see an upgrade or out-of-quota message.**
That is expected once you reach your plan's monthly limit. The message includes a link. Open it to upgrade or buy more credits.

**A brand is not found.**
Use the brand name exactly as it appears on its Facebook page. After a brand is added, its ads take a minute or two to load before you can ask about them.

**A launch says no ad account is connected.**
Ask the chat to connect your ad account. It gives you a link to connect Meta, Google, TikTok, X, or ChatGPT Ads. Campaigns are created paused, so nothing spends until you confirm.

**Node or `npx` errors on start.**
Use Node 18 or later (`node --version`). If an old cached copy is misbehaving, force a fresh one: `npx -y adwhispr-mcp-server@latest serve`.

Still stuck? Open an issue at [github.com/adwhispr/mcp-server/issues](https://github.com/adwhispr/mcp-server/issues) or email hello@adwhispr.com.

## Links

- Website: https://adwhispr.com/connect?ref=mcp_directory
- Setup guides for every app: https://adwhispr.com/integrations
- Claude plugin: https://github.com/adwhispr/claude-plugin
- Blog and guides: https://adwhispr.com/blog
- Issues: https://github.com/adwhispr/mcp-server/issues

## License

MIT © AdWhispr
