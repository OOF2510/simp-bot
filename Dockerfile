FROM node:current-alpine

RUN mkdir -p /usr/src/SimpBot
WORKDIR /usr/src/SimpBot
COPY . ./

RUN apk add --no-cache iputils python3 py3-pip build-base g++ cairo-dev pango-dev giflib-dev libjpeg-turbo-dev libpng-dev \
&& yarn install \
&& yarn cache clean \
&& yarn global add yayfetch \
&& pip3 install --no-cache-dir gTTS

CMD ["yarn", "start"]
