FROM node:latest

RUN mkdir -p /usr/src/SimpBot
WORKDIR /usr/src/SimpBot
COPY . ./

RUN apt update 
RUN apt install iputils-ping git python3 python3-pip clang build-essential libjpeg-dev -y
RUN yarn install && yarn global add yayfetch && python3 -m pip install gTTS

CMD ["yarn", "start"]
