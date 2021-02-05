read_var() {
  local ENV_FILE="${2:-./.env}"
  local VAR=$(grep $1 "$ENV_FILE" | xargs)

  IFS="=" read -ra VAR <<< "$VAR"
  echo ${VAR[1]}
}

projectname=$(read_var PROJECT_NAME)

docker rm -f $(docker ps -f name="${projectname}*" -a -q)
