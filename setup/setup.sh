#!/usr/bin/env bash
read -p "Prefix: " prefix
read -p "Bot Token: " token
read -p "Bot Client ID: " clientID
read -p "Client Secret: " clientSecret
read -p "Random String (session secret): " sessionSecret
read -p "Bot Email: " email
read -p "Bot Email Password: " emailPass
read -p "WebServer Port: " port
read -p "Dashboard URL: " dashboardURL
read -p "MongoDB URI: " mongoURI
read -p "First MongoDB Shard Domain: " mongoShard0
read -p "Second MongoDB Shard Domain: " mongoShard1
read -p "Third MongoDB Shard Domain: " mongoShard2

touch config.json

echo "{
  \"prefix\": \"$prefix\",
  \"token\": \"$token\",
  \"clientID\": \"$clientID\",
  \"clientSecret\": \"$clientSecret\",
  \"sessionSecret\": \"$sessionSecret\",
  \"email\": \"$email\",
  \"emailPass\": \"$emailPass\",
  \"port\": $port,
  \"dashboardURL\": \"$dashboardURL\",
  \"mongoURI\": \"$mongoURI\",
  \"mongoShards\": [
    \"$mongoShard0\",
    \"$mongoShard1\",
    \"$mongoShard2\"
  ]
}" > ./config.json

echo "config.json:"
cat config.json

sudo yarn global add yayfetch
yarn install

exit
