# MCP Server Setup Guide
## Remote Server Access + Web Browsing with Claude

This guide shows how to set up MCP (Model Context Protocol) servers to:
1. **Execute commands on remote servers via SSH**
2. **Browse and interact with web pages**
3. **Use Claude to analyze results**

---
nano ~/.config/Claude/claude_code_config.json 

## Option 1: SSH MCP Server (Remote Command Execution)

### Install SSH MCP Server
```bash
npm install -g @modelcontextprotocol/server-ssh
```

# Add filesystem access
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem

# Add PostgreSQL integration
claude mcp add postgres npx@modelcontextprotocol/server-postgres

# Add GitHub integration
claude mcp add github npx @modelcontextprotocol/server-github

# Add pupeeter
claude mcp add puppeteer npx @modelcontextprotocol/server-puppeteer

# Add ssh
claude mcp add ssh npx @modelcontextprotocol/server-ssh

# Add fetch
claude mcp add fetch npx @modelcontextprotocol/server-fetch

# Add gemini
claude mcp add gemini npx @modelcontextprotocol/mcp-server-gemini

# Add n8n
claude mcp add n8n-mcp \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -- npx n8n-mcp

# Add chrome
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest

# Add playwrigth
claude mcp add playwright npx '@playwright/mcp@latest'

### Configure in Claud`

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"]
    },
    "ssh-server": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-ssh",
        "ssh://username@your-server-ip:22"
      ],
      "env": {
        "SSH_PRIVATE_KEY_PATH": "/home/galo/.ssh/id_rsa"
      }
    }
  }
}
```

### Usage Example:
Once configured, you can ask Claude:
- "Connect to my server and check if Docker is running"
- "Execute 'docker ps' on my production server"
- "Check the status of nginx on the server"

---

## Option 2: Puppeteer MCP Server (Web Browsing)

### Install Puppeteer MCP Server
```bash
npm install -g @modelcontextprotocol/server-puppeteer
```

### Configure in Claude Desktop

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"]
    },
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    }
  }
}
```

### Usage Example:
- "Navigate to http://localhost:3060 and take a screenshot"
- "Open my admin panel and check if products are loading"
- "Browse to the frontend and verify the checkout page works"

---

## Option 3: Combined Setup (SSH + Puppeteer)

### Full Configuration

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"]
    },
    "ssh-production": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-ssh",
        "ssh://username@production-server-ip:22"
      ],
      "env": {
        "SSH_PRIVATE_KEY_PATH": "/home/galo/.ssh/id_rsa"
      }
    },
    "puppeteer-browser": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    }
  }
}
```

---

## Alternative: Use Fetch MCP Server (Simpler Web Access)

For basic web page access without full browser automation:

### Install Fetch MCP Server
```bash
npm install -g @modelcontextprotocol/server-fetch
```

### Configure
```json
{
  "mcpServers": {
    "web-fetch": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch"
      ]
    }
  }
}
```

### Usage:
- "Fetch http://localhost:3060 and analyze the HTML"
- "Check if the API at http://localhost:3062/api/health is responding"

---

## Recommended Setup for Your Use Case

Based on your needs (access server + web pages), I recommend:

### 1. Install Required Packages
```bash
# SSH access to your production server
npm install -g @modelcontextprotocol/server-ssh

# Web browsing capabilities
npm install -g @modelcontextprotocol/server-puppeteer

# Simple HTTP requests
npm install -g @modelcontextprotocol/server-fetch
```

### 2. Configure Claude Desktop
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"]
    },
    "production-ssh": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-ssh",
        "ssh://your-username@your-production-server:22"
      ],
      "env": {
        "SSH_PRIVATE_KEY_PATH": "/home/galo/.ssh/id_rsa"
      }
    },
    "web-browser": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    },
    "web-fetch": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop
After updating the config, restart Claude Desktop to load the new MCP servers.

---

## Usage Examples

### Execute Commands on Server
```
You: "Connect to production server and run 'docker ps'"
Claude: *uses SSH MCP to execute command and shows results*
```

### Check Web Application
```
You: "Open http://localhost:3060 and verify products are showing"
Claude: *uses Puppeteer to browse, take screenshot, and analyze*
```

### API Health Check
```
You: "Fetch http://localhost:3062/api/health and tell me the status"
Claude: *uses Fetch MCP to get response and analyze*
```

### Combined Workflow
```
You: "Deploy to production, then verify the website is working"
Claude:
1. Uses SSH to run deployment commands
2. Uses Puppeteer to browse the site
3. Provides comprehensive report
```

---

## Security Notes

1. **SSH Key Security**: Ensure your SSH private key has proper permissions (600)
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

2. **Production Access**: Consider creating a dedicated SSH key for MCP access
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/mcp_access_key
   ```

3. **Firewall**: Ensure your server allows SSH connections from your IP

---

## Troubleshooting

### MCP Server Not Loading
- Restart Claude Desktop completely
- Check `~/.config/Claude/claude_desktop_config.json` for syntax errors
- Verify npm packages are installed globally: `npm list -g`

### SSH Connection Fails
- Test SSH manually: `ssh -i ~/.ssh/id_rsa username@server`
- Check SSH key permissions: `ls -la ~/.ssh/id_rsa`
- Verify server allows SSH on specified port

### Puppeteer Fails
- Ensure Chrome/Chromium is installed
- Check if ports are accessible (e.g., localhost:3060)

---

## Next Steps

1. Decide which MCP servers you need
2. Install them with npm
3. Update Claude Desktop config
4. Restart Claude Desktop
5. Test by asking Claude to perform tasks

**Want me to help you configure this now?**
