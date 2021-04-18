import os

prefix = input("Prefix: ")
token = input("Token: ")
clientID = input("Bot Client ID: ")
clientSecret = input("Client Secret: ")
sessionSecret = input("Random String (session secret): ")
email = input("Bot Email: ")
emailPass = input("Bot Email Password: ")
port = input("WebServer Port: ")

configJson = "{" + f"""
  \"prefix\": \"{prefix}\",
  \"token\": \"{token}\",
  \"clientID\": \"{clientID}\",
  \"clientSecret\": \"{clientSecret}\",
  \"sessionSecret\": \"{sessionSecret}\",
  \"email\": \"{email}\",
  \"emailPass\": \"{emailPass}\",
  \"port\": \"{port}\"
""" + "}"

config = open("config.json", "w")
config.write(configJson)
config.close()

config = open("config.json", "r")
print("config.json:")
print(config.read())
config.close()

os.system("yarn install")
