#!/bin/bash

url=$1

if [ "$url" != "" ]; then
	echo "url=https://nutrition-"$url".now.sh/new-message"
	curl -F "url=https://nutrition-"$url".now.sh/new-message" https://api.telegram.org/bot698132452:AAF1F9qxVGJofjelHtHuhShBfi5Ojr4Gx60/setWebhook
else
	echo "Please enter new instance id"
fi