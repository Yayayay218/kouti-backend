FROM node:6.11.0

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install -g pm2

ENV HOME=/home/app

COPY package.json $HOME/kouti-backend/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/kouti-backend
RUN npm install


USER root
COPY . $HOME/kouti-backend
RUN chown -R app:app $HOME/*
USER app

CMD ["pm2", "start", "--no-daemon", "processes.json"]