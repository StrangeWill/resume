#!/usr/bin/env sh
cd _site
find ./ -type f -exec curl --ftp-create-dirs -T {} -u $FTPUSER:$FTPPASS ftp://$FTPSERVER/{} \;