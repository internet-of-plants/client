#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

yarn build
if [  $? -ne 0 ]; then
  echo "Build failed"
  exit
fi

cp $SCRIPTPATH/dist/index.html $SCRIPTPATH/dist/404.html
cp $SCRIPTPATH/LICENSE.md $SCRIPTPATH/dist/

mkdir -p $SCRIPTPATH/../static
rm $SCRIPTPATH/../static/** -r
cp $SCRIPTPATH/dist/** $SCRIPTPATH/../static/ -r

cd $SCRIPTPATH/../static
  git add -A
  git commit --amend -m "Initial Commit"
  git push origin master -f
cd -
