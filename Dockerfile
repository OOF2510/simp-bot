FROM node:current-alpine

RUN mkdir -p /usr/src/SimpBot
WORKDIR /usr/src/SimpBot
COPY . ./

RUN apk add --no-cache iputils python3 py3-pip clang cairo pango pkgconfig libpng libjpeg giflib-dev librsvg-dev
RUN yarn install
RUN yarn global add yayfetch
RUN pip3 install gTTS

CMD ["yarn", "start"]
