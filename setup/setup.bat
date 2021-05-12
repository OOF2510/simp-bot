@echo off

set /P prefix="Prefix: "
set /P token="Bot Token: "
set /P email="Bot Email: "
set /P emailPass="Bot Email Password: "
set /P mongoURI="MongoDB URI: "
set /P mongoShard0="First MongoDB Shard Domain: "
set /P mongoShard1="Second MongoDB Shard Domain: "
set /P mongoShard2="Third MongoDB Shard Domain: "

type nul > config.json

(
echo {
echo "prefix": "%prefix%",
echo "token": "%token%",
echo "email": "%email%",
echo "emailPass": "%emailPass%",
echo "mongoURI": "%mongoURI%",
echo "mongoShards": [
echo    "%mongoShard0%",
echo    "%mongoShard1%",
echo    "%mongoShard2%"
echo   ]
echo }
) > config.json

echo config.json:
type config.json

yarn global add yayfetch
yarn install

exit
