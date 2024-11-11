# from node
FROM node:22

# Create app directory
WORKDIR /app

copy package*.json ./

# Bundle app source

COPY . .


# Install app dependencies

RUN npm install

# Expose port and start application

CMD ["npm", "run", "start:dev"]

# CMD ["tail", "-f", "/dev/null"]