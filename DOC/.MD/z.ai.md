########################## Z.AI API KEY
a3cb9c0b97824f63a93101cb325e5b0e.1CD9Mw1GYqLhnMk9

ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic ANTHROPIC_AUTH_TOKEN=a3cb9c0b97824f63a93101cb325e5b0e.1CD9Mw1GYqLhnMk9 claude

# GLM 4.6

<aside>
<img src="notion://custom_emoji/e2eac810-81a9-476e-9def-009dd686c495/25364e30-f82b-8043-bcee-007a7dc37acc" alt="notion://custom_emoji/e2eac810-81a9-476e-9def-009dd686c495/25364e30-f82b-8043-bcee-007a7dc37acc" width="40px" />

**Learn AI Coding ➜** [**https://buildersclub.co**](https://buildersclub.co/)

</aside>

<aside>
<img src="notion://custom_emoji/e2eac810-81a9-476e-9def-009dd686c495/13864e30-f82b-80f7-b0f6-007a44209e5f" alt="notion://custom_emoji/e2eac810-81a9-476e-9def-009dd686c495/13864e30-f82b-80f7-b0f6-007a44209e5f" width="40px" />

**Get your App built ➜** [**https://sprike.co**](https://sprike.co)

</aside>

## Use with Claude Code

1. Open `.claude/settings.json` and add:

```json
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.6",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.6"
  }
```

1. Launch Claude Code with:

```
ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic ANTHROPIC_AUTH_TOKEN=YOUR-ZAI-API-KEY claude
```

👆 Replace `YOUR-ZAI-API-KEY`

## Use with Droid

You can either use the Droid Code (GLM 4.6) model or create a custom model using your own Z.AI API key:

Open .factory/config.json

```json
{
  "custom_models": [
    {
      "model_display_name": "GLM-4.6 (Custom)",
      "model": "glm-4.6",
      "base_url": "https://api.z.ai/api/coding/paas/v4",
      "api_key": "YOUR_ZAI_API_KEY",
      "provider": "generic-chat-completion-api",
      "max_tokens": 32000
    }
  ]
}
```

👆 Replace `YOUR-ZAI-API-KEY`