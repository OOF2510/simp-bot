import os

token = input("Token: ")
clientID = input("Bot Client ID: ")
devCmdServerID = input("Your Server ID: ")
sqlIP = input("MySQL host IP/Domain: ")
sqlPort = input("MySQL Port: ")
sqlUser = input("MySQL Username: ")
sqlPass = input("MySQL Password: ")
sqlSchema = input("MySQL Schema Name: ")
embedColor = input("Embed Color (hex without the #): ")
hfKey = input("Huggingface API Key: ")
openaiKey = input("OpenAI API Key: ")
uID = input("Your Discord User ID: ")
bug = input("Bug channel ID: ")
sug = input("Suggestion channel ID: ")

configJson = "{" + f"""
  \"token\": \"{token}\",
  \"clientID\": \"{clientID}\",
  \"devCmdServerID\": \"{devCmdServerID}\",
  \"mysql\":""" + "{" + f"""
    \"ip\": \"{sqlIP}\",
    \"port\": \"{sqlPort}\",
    \"user\": \"{sqlUser}\",
    \"password\": \"{sqlPass}\",
    \"schema\": \"${sqlSchema}\"
  """ + "}," + f"""
  \"embedColor\": \"0x{embedColor}\",
  \"hfKey\": \"{hfKey}\",
  \"openaiApiKey\": \"{openaiKey}\",
  \"allowed\": [
    \"{uID}\"
  ],
  \"feedbackChannels\":""" + "{" + f"""
    \"bugs\": \"{bug}\",
    \"sug\": \"{sug}\"
  """ + "}" + f"""
""" + "}"

config = open("config.json", "w")
config.write(configJson)
config.close()

config = open("config.json", "r")
print("config.json:")
print(config.read())
config.close()

os.system("yarn install")

os.system("python3 -m pip install gTTS")
