#!/bin/bash

OLDIFS=$IFS
IFS=","

count=0

cat salar.csv | tail -n+3 | while read f1 f2 f3 f4 f5 f6 f7 f8 f9
do
    echo "{"
    if [[ $f1 == "" ]]; then
        echo '"Salsnr": null,'
    else
        echo '"Salsnr": "'"$f1"'",'
    fi
    if [[ $f2 == "" ]]; then
        echo '"Salsnamn": null,'
    else
        echo '"Salsnamn": "'"$f2"'",'
    fi
    if [[ $f3 == "" ]]; then
        echo '"Lat": null,'
    else
        echo '"Lat": "'"$f3"'",'
    fi
    if [[ $f4 == "" ]]; then
        echo '"Long": null,'
    else
        echo '"Long": "'"$f4"'",'
    fi
    if [[ $f5 == "" ]]; then
        echo '"Ort": null,'
    else
        echo '"Ort": "'"$f5"'",'
    fi
    if [[ $f6 == "" ]]; then
        echo '"Hus": null,'
    else
        echo '"Hus": "'"$f6"'",'
    fi
    if [[ $f7 == "" ]]; then
        echo '"Våning": null,'
    else
        echo '"Våning": "'"$f7"'",'
    fi
    if [[ $f8 == "" ]]; then
        echo '"Typ": null,'
    else
        echo '"Typ": "'"$f8"'",'
    fi
    if [[ ${#f9} == 0 ]]; then
        echo '"Storlek": null'
    elif [[ ${#f9} == 1 ]]; then
        f9=${f9:0:1}
        echo '"Storlek": "'"$f9"'"'
    elif [[ ${#f9} == 2 ]]; then
        f9=${f9:0:2}
        echo '"Storlek": "'"$f9"'"'
    elif [[ ${#f9} == 3 ]]; then
        f9=${f9:0:3}
        echo '"Storlek": "'"$f9"'"'
    elif [[ ${#f9} == 4 ]]; then
        f9=${f9:0:4}
        echo '"Storlek": "'"$f9"'"'
    fi
    if [[ $count == 142 ]]; then
        echo "}"
    else
        echo "},"
    fi
    count=$((count+1))
done > salar.json

sed -i '$ a ]' salar.json
sed -i '$ a }' salar.json
sed -i '1 i "salar": [' salar.json
sed -i '1 i {' salar.json

IFS=$OLDIFS
