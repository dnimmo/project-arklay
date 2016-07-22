FROM node:latest

RUN mkdir /opt/project-arklay
COPY . /opt/project-arklay

WORKDIR /opt/project-arklay

EXPOSE 8080 80 443

CMD ["npm", "run", "serve"]
