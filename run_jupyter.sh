. /venvs/jupyter-venv/bin/activate

# Enable RISE extension (run this once; optional afterward)
jupyter-nbextension install rise --py --sys-prefix
jupyter-nbextension enable rise --py --sys-prefix

# Start Jupyter Lab with fixed token
jupyter lab --ip=0.0.0.0 --no-browser --port=8777 --NotebookApp.token='t3st'

deactivate