import os

prefix = input("Prefix: ")
token = input("Token: ")
email = input("Bot Email: ")
emailPass = input("Bot Email Password: ")
port = input("WebServer Port: ")
mongoShard0 = input("First MongoDB Shard Domain: ")
mongoShard1 = input("Second MongoDB Shard Domain: ")
mongoShard2 = input("Third MongoDB Shard Domain: ")

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
  ]
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
