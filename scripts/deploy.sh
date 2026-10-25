#!/bin/sh
# Deploys the committed HEAD to a Docker host over ssh.
# The host needs Docker, an env file at $DEPLOY_DIR/.env and a data directory
# owned by uid 1000 (the image's `node` user). nginx/TLS are set up separately.
set -eu

: "${DEPLOY_HOST:?Set DEPLOY_HOST, e.g. DEPLOY_HOST=user@server scripts/deploy.sh}"
DEPLOY_DIR="${DEPLOY_DIR:-bezoekje}"
DATA_DIR="${DATA_DIR:-/opt/bezoekje/data}"
PORT="${PORT:-20090}"
NAME=bezoekje

if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: uncommitted changes are not deployed, only HEAD is." >&2
fi
echo "Deploying $(git log --oneline -1) to $DEPLOY_HOST"

git archive --format=tar HEAD | ssh "$DEPLOY_HOST" \
  "rm -rf $DEPLOY_DIR/src && mkdir -p $DEPLOY_DIR/src && tar -x -C $DEPLOY_DIR/src"

ssh "$DEPLOY_HOST" sh -s <<EOF
set -eu
docker build -q -t $NAME $DEPLOY_DIR/src
docker rm -f $NAME >/dev/null 2>&1 || true
docker run -d --name $NAME --restart unless-stopped \
  --env-file $DEPLOY_DIR/.env \
  -p 127.0.0.1:$PORT:3000 \
  -v $DATA_DIR:/data \
  $NAME >/dev/null
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fs -o /dev/null http://127.0.0.1:$PORT/; then
    echo "Up on 127.0.0.1:$PORT"
    docker image prune -f >/dev/null
    exit 0
  fi
  sleep 2
done
docker logs --tail 30 $NAME
exit 1
EOF
