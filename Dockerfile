FROM node:current-alpine

RUN mkdir -p /usr/src/SimpBot
WORKDIR /usr/src/SimpBot
COPY . ./

RUN apk add --no-cache iputils python3 py3-pip build-base g++ cario-dev jpeg-dev pango-dev giflib-dev libjpeg-turbo-dev bash imagemagick libpng-dev
RUN yarn install
RUN yarn global add yayfetch
RUN pip3 install gTTS

CMD ["yarn", "start"]
