FROM node:18.20.2-alpine3.19

RUN apk update
RUN apk add git

WORKDIR /
COPY src/ src/
COPY utils/ utils/
COPY Run.sh Run.sh
COPY package* /
RUN npm ci

CMD ["/Run.sh"]
