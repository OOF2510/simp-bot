import json
import os


def prompt_list(prompt_text):
  raw = input(prompt_text)
  return [item.strip() for item in raw.split(",") if item.strip()]


token = input("Token: ")
clientID = input("Bot Client ID: ")
devCmdServerID = input("Your Server ID: ")
mongo_url = input("MongoDB connection string: ")
mongo_db = input("MongoDB database name: ")
embedColor = input("Embed Color (hex without the #): ")
openrouter_key = input("OpenRouter API Key: ")
groq_key = input("Groq API Key (for Whisper/transcription): ")
uID = input("Your Discord User ID: ")
bug_channels = prompt_list("Bug channel IDs (comma-separated for multiple): ")
sug_channels = prompt_list("Suggestion channel IDs (comma-separated for multiple): ")

config = {
  "token": token,
  "clientID": clientID,
  "devCmdServerID": devCmdServerID,
  "mongodb": {"url": mongo_url, "database": mongo_db},
  "embedColor": f"0x{embedColor}",
  "openrouterKey": openrouter_key,
  "groqKey": groq_key,
  "allowed": [uID],
  "feedbackChannels": {"bugs": bug_channels, "suggestions": sug_channels},
}

with open("config.json", "w") as f:
  json.dump(config, f, indent=2)

print("config.json:")
with open("config.json", "r") as f:
  print(f.read())

os.system("yarn install")
