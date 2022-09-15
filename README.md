[![CodeFactor](https://www.codefactor.io/repository/github/oof2510/simp-bot-rewritten/badge)](https://www.codefactor.io/repository/github/oof2510/simp-bot-rewritten)
[![Maintainability](https://api.codeclimate.com/v1/badges/4c542ad2130b91018c63/maintainability)](https://codeclimate.com/github/OOF2510/simp-bot-rewritten/maintainability)
[![Forks](https://img.shields.io/github/forks/oof2510/simp-bot-rewritten.svg)](https://github.com/oof2510/simp-bot-rewritten)
[![Stars](https://img.shields.io/github/stars/oof2510/simp-bot-rewritten.svg)](https://github.com/oof2510/simp-bot-rewritten)
[![License](https://img.shields.io/github/license/oof2510/simp-bot-rewritten.svg)](https://github.com/oof2510/simp-bot-rewritten)
![Lines of code](https://img.shields.io/tokei/lines/github/oof2510/simp-bot-rewritten)
![GitHub repo size](https://img.shields.io/github/repo-size/oof2510/simp-bot-rewritten)
![GitHub last commit](https://img.shields.io/github/last-commit/oof2510/simp-bot-rewritten)
[![Build Docker Image](https://github.com/OOF2510/simp-bot-rewritten/actions/workflows/docker.yml/badge.svg)](https://github.com/OOF2510/simp-bot-rewritten/actions/workflows/docker.yml)

# Simp Bot

A Discord bot that is a simp

### [Invite the bot to your server](https://discord.com/api/oauth2/authorize?client_id=808822189905936405&permissions=8&scope=bot)

### [Join the support server!](https://discord.gg/zHtfa8GdPx)

### [Music Portion](https://github.com/OOF2510/sbmusic)

# Self-hosting the bot

## Universial

- Install git, nodejs, python3, python3-pip & yarn

```bash
 git clone https://github.com/OOF2510/simp-bot-rewritten.git
 cd simp-bot-rewritten
 yarn run setup
 yarn run start
```

## Docker (x86_64 only)

- Install docker
- Create a file named "config.json" using the format below:

```json
{
  "token": "your-bot-token",
  "clientID": "your-bot-clientid",
  "devCmdServerID": "your-server-id",
  "mysql": {
    "ip": "sql-host-ip/domain",
    "port": "sql-port",
    "username": "sql-username",
    "password": "sql-password",
    "schema": "sql-schema-name"
  },
  "embedColor": "hex-color-code",
  "lavalinkHost": "your-lavalink-host",
  "hfkey": "your-huggingface-api-key",
  "allowed": ["your-user-id"]
}
```

- Build and run the docker container

```bash
docker build -t simpbot .
docker run -it simpbot
```

# The original simp bot

I reworte [Simp bot 10000](https://discordbotlist.com/bots/simp-bot-10000) because it wouldn't let me add it to my server, I tried hosting it myself, but it
kept crashing, so I rewrote the code and added a bunch of stuff of my own onto it. Simp bot 10000 seems to be abandoned now and is never online.
