#!/bin/bash
# Download latest node and install.
dogeclink=`curl -s https://api.github.com/phoenixkonsole/transcendence/releases/latest | grep browser_download_url | grep Linux.zip | cut -d '"' -f 4`
mkdir -p /tmp/telos
cd /tmp/telos
curl -Lo telos.zip $dogeclink
apt install zip unzip

unzip telos.zip
cd Linux

sudo mv .* /usr/local/bin
cd
rm -rf /tmp/telos
mkdir ~/.transcendence

# Setup configuration for node.
rpcuser=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo '')
rpcpassword=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 ; echo '')
cat >~/.transcendence/transcendence.conf <<EOL
rpcuser=$rpcuser
rpcpassword=$rpcpassword
daemon=1
txindex=1
EOL

# Start node.
transcendenced
