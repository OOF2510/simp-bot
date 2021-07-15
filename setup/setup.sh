#!/usr/bin/env bash
read -p "Prefix: " prefix
read -p "Bot Token: " token
read -p "Bot Client ID: " clientID
read -p "Bot Email: " email
read -p "Bot Email Password: " emailPass
read -p "MongoDB URI: " mongoURI
read -p "First MongoDB Shard Domain: " mongoShard0
read -p "Second MongoDB Shard Domain: " mongoShard1
read -p "Third MongoDB Shard Domain: " mongoShard2
read -p "Embed Color (hex without the #): " embedColor
read -p "Lavalink Host: " lavalinkHost

touch config.json

echo "{
  \"prefix\": \"$prefix\",
  \"token\": \"$token\",
  \"clientID\": \"$clientID\",
  \"email\": \"$email\",
  \"emailPass\": \"$emailPass\",
  \"mongoURI\": \"$mongoURI\",
  \"mongoShards\": [
    \"$mongoShard0\",
    \"$mongoShard1\",
    \"$mongoShard2\"
  ],
  \"embedColor\": \"0x$embedColor\",
  \"lavalinkHost\": \"$lavalinkHost\"
}" > ./config.json

echo "config.json:"
cat config.json

sudo yarn global add yayfetch
yarn install

python3 -m pip install gTTS

exit
