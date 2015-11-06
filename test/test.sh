#!/bin/sh
cd /home/pump/pump.io
git pull
printf "pump\n" | sudo -S /home/pump/pump.io/test/hosts.sh
npm test
