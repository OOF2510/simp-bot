[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/OOF2510/simp-bot-rewritten/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/OOF2510/simp-bot-rewritten/?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/10f27f4ae9404b73bddb1e34f7754f6d)](https://app.codacy.com/gh/OOF2510/simp-bot-rewritten?utm_source=github.com&utm_medium=referral&utm_content=OOF2510/simp-bot-rewritten&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://img.shields.io/github/forks/oof2510/simp-bot-rewritten.svg)](https://github.com/oof2510/simp-bot-rewritten)
[![Build Status](https://img.shields.io/github/stars/oof2510/simp-bot-rewritten.svg)](https://github.com/oof2510/simp-bot-rewritten)
[![License](https://img.shields.io/github/license/oof2510/simp-bot-rewritten.svg)](https://github.com/oof2510/simp-bot-rewritten)
[![Maintainability](https://api.codeclimate.com/v1/badges/4c542ad2130b91018c63/maintainability)](https://codeclimate.com/github/OOF2510/simp-bot-rewritten/maintainability)
![Lines of code](https://img.shields.io/tokei/lines/github/oof2510/simp-bot-rewritten)
![GitHub repo size](https://img.shields.io/github/repo-size/oof2510/simp-bot-rewritten)
![GitHub last commit](https://img.shields.io/github/last-commit/oof2510/simp-bot-rewritten)

# Simp Bot

A Discord bot that is a simp

### [Invite the bot to your server](https://discord.com/api/oauth2/authorize?client_id=808822189905936405&permissions=8&scope=bot)

### [Join the support server!](https://discord.gg/zHtfa8GdPx)

### [Music Portion](https://github.com/OOF2510/simp-bot-music)

### [Website Source Code](https://github.com/OOF2510/simp-bot-site)

# Self-hosting the bot

## Linux

- Install git, nodejs, python3-pip & yarn

```bash
git clone https://github.com/OOF2510/simp-bot-rewritten.git
cd simp-bot-rewritten
yarn run setup:linux
yarn run start
```

## Docker

- Install docker
- Create a file named "config.json" using the format below:

```json
{
 "prefix": "your-bot-prefix",
 "token": "your-bot-token",
 "clientID": "your-bot-clientid",
 "email": "your-bot-email",
 "emailPass": "your-bot-email-password",
 "mongoURI": "your-mongodb-uri",
 "mongoShards": [
  "mongodb-shard-1",
  "mongodb-shard-2",
  "mongodb-shard-3"
 ],
 "embedColor": "hex-color-code",
 "lavalinkHost": "your-lavalink-host",
 "hfkey": "your-huggingface-api-key"
```

- Build and run the docker container

```bash
docker build -t simpbot .
docker run -d simpbot
```

## Windows

- Install git, nodejs, python3-pip & yarn

```bash
git clone https://github.com/OOF2510/simp-bot-rewritten.git
cd simp-bot-rewritten
yarn run setup:win
yarn run start
```

## Universial

- Install git, nodejs, python, python3-pip & yarn

```bash
 git clone https://github.com/OOF2510/simp-bot-rewritten.git
 cd simp-bot-rewritten
 yarn run setup
 yarn run start
```

# The original simp bot

I reworte [Simp bot 10000](https://discordbotlist.com/bots/simp-bot-10000) because it wouldn't let me add it to my server, I tried hosting it myself, but it
kept crashing, so I rewrote the code and added a bunch of stuff of my own onto it. Simp bot 10000 seems to be abandoned now and is never online.
