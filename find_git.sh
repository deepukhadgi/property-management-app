#!/bin/bash
PASSWORD="B3suretouse@str0ngp@ssw0rd"

echo "[Admin] Searching root partitions for original Git configuration..."
echo "$PASSWORD" | sudo -S ls -la /root/repo_temp/.git 2>/dev/null || echo "No .git found in /root/repo_temp"

if echo "$PASSWORD" | sudo -S test -f /root/repo_temp/.git/config; then
  echo "SUCCESS! Found remote Git config in /root/repo_temp! Extracting URL:"
  echo "$PASSWORD" | sudo -S cat /root/repo_temp/.git/config | grep "url = "
else
  echo "FAILED: The Git config does not exist in root either."
fi
