#!/bin/sh
pwd .
echo Applying patches
patch --forward -p1 < ./patches/simplesmtp.patch
exit 0
