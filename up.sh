#!/bin/bash

docker compose up -d

jupyter-nbextension install rise --py --sys-prefix
jupyter-nbextension enable rise --py --sys-prefix

# Start Jupyter Lab with fixed token 't3st'
jupyter lab --ip=0.0.0.0 --no-browser --port=8877 --NotebookApp.token='test'


code .

# Deactivate the environment upon shutting down Jupyter (Ctrl+C)
deactivate

#source ./setenvvars.sh

