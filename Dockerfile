FROM node:22

# Install Python3, pip, and any other tools (e.g., nano if needed)
RUN apt-get update && apt-get install -y python3 python3-pip nano

WORKDIR /app

# Copy dependency definitions to leverage Docker caching
COPY package.json package-lock.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of your application files
COPY . .

# Start a shell (or change to your preferred startup command)
CMD ["sh"]
