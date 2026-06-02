#!/usr/bin/env node
'use strict';

/**
 * @adwhispr/mcp-server
 *
 * One-command setup that connects Claude (Desktop and other MCP clients) to
 * the AdWhispr remote MCP server. Under the hood it bridges Claude's local
 * stdio transport to https://adwhispr.com/api/mcp using `mcp-remote`, which
 * also handles the OAuth sign-in (a browser window opens the first time).
 *
 * Usage:
 *   npx @adwhispr/mcp-server config   # add AdWhispr to Claude Desktop, then restart Claude
 *   npx @adwhispr/mcp-server serve    # run the stdio↔remote bridge (Claude calls this for you)
 *   npx @adwhispr/mcp-server help
 */

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const MCP_URL = process.env.ADWHISPR_MCP_URL || 'https://adwhispr.com/api/mcp';
const PKG = require('../package.json');

// ----------------------------------------------------------------------------
// Bridge: spawn mcp-remote (resolved from our own dependencies) pointed at the
// AdWhispr remote server. mcp-remote speaks stdio to Claude and HTTP+OAuth to
// us. We inherit stdio so the MCP protocol flows straight through.
// ----------------------------------------------------------------------------
function serve() {
  let binPath;
  try {
    const pkgJsonPath = require.resolve('mcp-remote/package.json');
    const remotePkg = require('mcp-remote/package.json');
    const binField = remotePkg.bin;
    const rel = typeof binField === 'string' ? binField : binField['mcp-remote'] || Object.values(binField)[0];
    binPath = path.join(path.dirname(pkgJsonPath), rel);
  } catch (err) {
    console.error('[adwhispr-mcp] Could not locate the mcp-remote bridge. Try reinstalling: npm i -g @adwhispr/mcp-server');
    process.exit(1);
  }

  const child = spawn(process.execPath, [binPath, MCP_URL], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code == null ? 0 : code));
  child.on('error', (err) => {
    console.error('[adwhispr-mcp] Failed to start bridge:', err.message);
    process.exit(1);
  });
}

// ----------------------------------------------------------------------------
// Claude Desktop config helpers
// ----------------------------------------------------------------------------
function claudeConfigPath() {
  const home = os.homedir();
  switch (process.platform) {
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    case 'win32':
      return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json');
    default: // linux and others
      return path.join(process.env.XDG_CONFIG_HOME || path.join(home, '.config'), 'Claude', 'claude_desktop_config.json');
  }
}

function config() {
  const cfgPath = claudeConfigPath();
  const dir = path.dirname(cfgPath);

  let existing = {};
  if (fs.existsSync(cfgPath)) {
    try {
      const raw = fs.readFileSync(cfgPath, 'utf8').trim();
      existing = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error(`[adwhispr-mcp] Your Claude config at ${cfgPath} isn't valid JSON, so I won't overwrite it.`);
      console.error('Add this block manually inside "mcpServers":');
      console.error(JSON.stringify(serverEntry(), null, 2));
      process.exit(1);
    }
  }

  if (!existing.mcpServers || typeof existing.mcpServers !== 'object') {
    existing.mcpServers = {};
  }
  const alreadyHad = Boolean(existing.mcpServers.adwhispr);
  existing.mcpServers.adwhispr = serverEntry().adwhispr;

  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(cfgPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  } catch (err) {
    console.error(`[adwhispr-mcp] Couldn't write ${cfgPath}: ${err.message}`);
    process.exit(1);
  }

  console.log('');
  console.log('  ✅ AdWhispr ' + (alreadyHad ? 'updated' : 'added') + ' in Claude Desktop.');
  console.log('     ' + cfgPath);
  console.log('');
  console.log('  Next:');
  console.log('   1. Fully quit and reopen Claude Desktop.');
  console.log('   2. Start a chat — a browser window will open once to sign in to AdWhispr.');
  console.log('   3. Ask: "Search AdWhispr for Nike\'s longest-running ads."');
  console.log('');
}

function serverEntry() {
  // Self-reference: Claude Desktop runs `npx -y @adwhispr/mcp-server`, which
  // lands in serve() (stdin is not a TTY when Claude launches us) and starts
  // the bridge. Keeping the package name here means future updates flow
  // through automatically.
  const entry = {
    command: 'npx',
    args: ['-y', '@adwhispr/mcp-server', 'serve'],
  };
  if (process.env.ADWHISPR_MCP_URL) {
    entry.env = { ADWHISPR_MCP_URL: process.env.ADWHISPR_MCP_URL };
  }
  return { adwhispr: entry };
}

function help() {
  console.log(`
  AdWhispr MCP — chat with any brand's Meta ads inside Claude.

  Usage:
    npx @adwhispr/mcp-server config    Add AdWhispr to Claude Desktop (then restart Claude)
    npx @adwhispr/mcp-server serve     Run the stdio↔remote bridge (Claude runs this for you)
    npx @adwhispr/mcp-server help       Show this help
    npx @adwhispr/mcp-server version    Print version

  Most people just run:  npx @adwhispr/mcp-server config

  Server: ${MCP_URL}
  Learn more: https://adwhispr.com
`);
}

// ----------------------------------------------------------------------------
// Dispatch
// ----------------------------------------------------------------------------
const cmd = process.argv[2];

switch (cmd) {
  case 'config':
  case 'install':
  case 'init':
    config();
    break;
  case 'serve':
  case 'start':
    serve();
    break;
  case 'version':
  case '--version':
  case '-v':
    console.log(PKG.version);
    break;
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  case undefined:
    // No subcommand. If a human ran this in a terminal, show help. If Claude
    // launched us (stdio is piped, not a TTY), behave as the server.
    if (process.stdin.isTTY) help();
    else serve();
    break;
  default:
    console.error(`[adwhispr-mcp] Unknown command: ${cmd}\n`);
    help();
    process.exit(1);
}
