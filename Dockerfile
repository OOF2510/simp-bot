FROM node:latest

RUN mkdir -p /usr/src/SimpBot
WORKDIR /usr/src/SimpBot
COPY . ./

RUN apt update && apt install iputils-ping git python3 python3-pip clang build-essential python3-dev -y
RUN yarn install && sudo yarn global add yayfetch && python3 -m pip install gTTS

CMD ["yarn", "start"]
