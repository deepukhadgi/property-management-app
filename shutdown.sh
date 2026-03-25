#!/bin/bash
PASSWORD="B3suretouse@str0ngp@ssw0rd"

echo "Shutting down the Express API..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
npx pm2 delete all
npx pm2 save

echo "Stopping and Disabling Nginx..."
echo "$PASSWORD" | sudo -S systemctl stop nginx
echo "$PASSWORD" | sudo -S systemctl disable nginx

echo "Server infrastructure successfully powered down!"
