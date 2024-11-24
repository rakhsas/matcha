# from node
FROM node:22

RUN apt update && apt install -y vim

# Create app directory
WORKDIR /app

COPY package*.json ./

# Bundle app source

COPY . .


# Install app dependencies

RUN npm install

# Expose port and start application

CMD ["npm", "run", "start:dev"]

# CMD ["tail", "-f", "/dev/null"]