FROM oof2510/discordbot-base:v1

RUN mkdir -p /usr/src/SimpBot

WORKDIR /usr/src/SimpBot
COPY . ./

RUN yarn install \
&& yarn cache clean \
&& pip3 install --no-cache-dir gTTS \
&& apk del build-base g++

CMD ["yarn", "start"]
