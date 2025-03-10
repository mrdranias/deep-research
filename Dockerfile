FROM node:22

# Install Python3, pip, and any other tools
RUN apt-get update && apt-get install -y python3-full python3-pip nano

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm install

# Create a virtual environment and install Python dependencies using its pip
RUN python3 -m venv jupyter-venv  && \
    venv/bin/pip install --upgrade pip && \
    venv/bin/pip install -r requirements.txt

# Copy the rest of your application files
COPY . .

CMD ["sh"]
