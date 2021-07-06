import os

prefix = input("Prefix: ")
token = input("Token: ")
email = input("Bot Email: ")
emailPass = input("Bot Email Password: ")
mongoURI = input("MongoDB URI: ")
mongoShard0 = input("First MongoDB Shard Domain: ")
mongoShard1 = input("Second MongoDB Shard Domain: ")
mongoShard2 = input("Third MongoDB Shard Domain: ")
embedColor = input("Embed Color (hex without the #): ")
lavalinkHost = input("Lavalink Host: ")

configJson = "{" + f"""
  \"prefix\": \"{prefix}\",
  \"token\": \"{token}\",
  \"email\": \"{email}\",
  \"emailPass\": \"{emailPass}\",
  \"mongoURI\": \"{mongoURI}\",
  \"mongoShards\": [
    \"{mongoShard0}\",
    \"{mongoShard1}\",
    \"{mongoShard2}\"
  ],
  \"embedColor\": \"0x{embedColor}\",
  \"lavalinkHost\": \"{lavalinkHost}\"
""" + "}"

config = open("config.json", "w")
config.write(configJson)
config.close()

config = open("config.json", "r")
print("config.json:")
print(config.read())
config.close()

os_name = os.name

if os_name == "posix":
  os.system("sudo yarn global add yayfetch")
else:
  os.system("yarn global add yayfetch")

os.system("yarn install")
