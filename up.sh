#!/bin/bash

docker compose up -d

jupyter-nbextension install rise --py --sys-prefix
jupyter-nbextension enable rise --py --sys-prefix


code .

#source ./setenvvars.sh

