# Use a base image with both Node.js and Python installed
FROM nikolaik/python-nodejs:python3.8-nodejs14

# Set the working directory in the container
WORKDIR /usr/src/app

# Clone the yt-dlp repository
RUN git clone https://github.com/yt-dlp/yt-dlp.git

# Change back to the app directory
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run server.js when the container launches
CMD ["node", "server.js"]
