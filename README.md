[![CodeFactor](https://www.codefactor.io/repository/github/oof2510/simp-bot/badge)](https://www.codefactor.io/repository/github/oof2510/simp-bot)
[![Maintainability](https://api.codeclimate.com/v1/badges/4c542ad2130b91018c63/maintainability)](https://codeclimate.com/github/OOF2510/simp-bot/maintainability)
[![Forks](https://img.shields.io/github/forks/oof2510/simp-bot.svg)](https://github.com/oof2510/simp-bot)
[![Stars](https://img.shields.io/github/stars/oof2510/simp-bot.svg)](https://github.com/oof2510/simp-bot)
[![License](https://img.shields.io/github/license/oof2510/simp-bot.svg)](https://github.com/oof2510/simp-bot)
![Lines of code](https://img.shields.io/tokei/lines/github/oof2510/simp-bot)
![GitHub repo size](https://img.shields.io/github/repo-size/oof2510/simp-bot)
![GitHub last commit](https://img.shields.io/github/last-commit/oof2510/simp-bot)
[![Build Docker Image](https://github.com/OOF2510/simp-bot/actions/workflows/docker.yml/badge.svg)](https://github.com/OOF2510/simp-bot/actions/workflows/docker.yml)

# Simp Bot

A Discord bot that is a simp

### [Invite the bot to your server](https://discord.com/api/oauth2/authorize?client_id=808822189905936405&permissions=8&scope=bot)

### [Join the support server!](https://discord.gg/zHtfa8GdPx)

# Contributing

Feel free to fork & open a pull request

# Self-hosting the bot

## Docker

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
  "hfkey": "your-huggingface-api-key",
  "allowed": ["your-user-id"],
  "feedbackChannels": {
    "bugs": ["bug-channel-id"],
    "suggestions": ["sug-channel-id"]
  }
}
```

- Build and run the docker container

```bash
docker build -t simpbot . --network=host
docker run --restart unless-stopped -it simpbot
```

## Manual

- Install git, nodejs, python3, python3-pip & yarn

```bash
 git clone https://github.com/OOF2510/simp-bot.git
 cd simp-bot
 yarn run setup
 yarn run start
```

# The original simp bot

I reworte [Simp bot 10000](https://glitch.com/~simpbota) because it wouldn't let me add it to my server, I tried hosting it myself, but it
kept crashing, so I rewrote the code and added a bunch of stuff of my own onto it. Simp bot 10000 seems to be abandoned now and is never online. I have reached out to the creator of Simp Bot 10000 via google fourms asking them if they would be interested in working on simp bot with me, no response yet.

ok
