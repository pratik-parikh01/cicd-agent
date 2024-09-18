FROM node:18.20.2-alpine3.19

RUN apk update
RUN apk add git 
# RUN apk add curl libcrypto3=3.1.4-r6 libssl3=3.1.4-r6

WORKDIR /
COPY src/ src/
COPY utils/ utils/
COPY Run.sh Run.sh
COPY package* /
RUN npm ci

# CMD ["/falkonryagent/Run.sh"]