FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
