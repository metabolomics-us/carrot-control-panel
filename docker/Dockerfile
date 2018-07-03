FROM node:8.11-alpine
MAINTAINER sajjan.s.mehta@gmail.com

# Create working directory
RUN mkdir -p /root/app

WORKDIR /root/app

# Add web application
ADD dist /root/app
ADD deploy-server.js package.json /root/app/

# Install server dependencies
RUN npm install --no-save

# Expose http port
EXPOSE 8080

# Run server
CMD ["node", "deploy-server.js"]
