#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

NODE_ENV='production' npm run build
if [  $? -ne 0 ]; then
  echo "Build failed"
  exit
fi

cp $SCRIPTPATH/dist/index.html $SCRIPTPATH/dist/404.html
cp $SCRIPTPATH/LICENSE.md $SCRIPTPATH/dist/

mkdir -p $SCRIPTPATH/../web.internet-of-plants.org
rm -r $SCRIPTPATH/../web.internet-of-plants.org/**
cp -r $SCRIPTPATH/dist/** $SCRIPTPATH/../web.internet-of-plants.org/
echo "web.internet-of-plants.org" > $SCRIPTPATH/../web.internet-of-plants.org/CNAME

cd $SCRIPTPATH/../web.internet-of-plants.org
  git add -A
  git commit --amend -m "Initial Commit"
  git push origin main -f
cd -
