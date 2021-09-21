FROM node:current-alpine

RUN mkdir -p /usr/src/SimpBot
WORKDIR /usr/src/SimpBot
COPY . ./

RUN apk add --no-cache iputils python3 py3-pip ffmpeg libsodium build-base g++ cairo-dev pango-dev giflib-dev libjpeg-turbo-dev libpng-dev \
&& yarn install \
&& yarn cache clean \
&& yarn global add yayfetch \
&& pip3 install --no-cache-dir gTTS \
&& apk del build-base g++ cairo-dev pango-dev giflib-dev libjpeg-turbo-dev libpng-dev

CMD ["yarn", "start"]
