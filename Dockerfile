FROM node:22

RUN apt-get update && apt-get install -y python3-full python3-pip nano

# Create venv in an isolated directory (e.g., /venvs/jupyter-venv)
RUN mkdir -p /venvs && \
    python3 -m venv /venvs/jupyter-venv && \
    /venvs/jupyter-venv/bin/pip install --upgrade pip

WORKDIR /app

COPY package.json package-lock.json requirements.txt ./

RUN npm install && \
    /venvs/jupyter-venv/bin/pip install -r requirements.txt

COPY . .

CMD ["sh"]