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
  \"dashboardURL\": $dashboardURL
}" > ./config.json

echo "config.json:"
cat config.json

yarn install

exit
