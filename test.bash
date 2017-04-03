#!/bin/bash

if [[ -z "$LINUX_PORT" ]]
then
    PORT=1337
else
    PORT="$LINUX_PORT"
fi

if [[ -z "$LINUX_SERVER" ]]
then
    SERVER=localhost
else
    SERVER="$LINUX_SERVER"
fi

verbose=false

while (( $# ))
do
    case "$1" in

        --verbose)
            verbose=true
            break
        ;;

    esac
done


declare -a urls=("$SERVER:$PORT/" "$SERVER:$PORT/room/list?max=5" "$SERVER:$PORT/room/view/id/A303"
"$SERVER:$PORT/room/view/id/J3208" "$SERVER:$PORT/room/view/id/G412" "$SERVER:$PORT/room/view/id/2-218"
"$SERVER:$PORT/room/list?max=5" "$SERVER:$PORT/room/view/house/A-huset" "$SERVER:$PORT/room/view/house/J-huset"
"$SERVER:$PORT/room/view/house/J-huset?max=1" "$SERVER:$PORT/room/search/Karlskrona" "$SERVER:$PORT/room/search/Karlshamn"
"$SERVER:$PORT/room/searchp/Grupprum" "$SERVER:$PORT/room/searchp/5?max=2" "$SERVER:$PORT/room/search/Karlskrona?max=2"
"$SERVER:$PORT/room/search/Karlshamn?max=3")

for url in "${urls[@]}"
do
    echo -e "\nRESPONSE\n"
    echo "$url"
    echo -e "\n"
    if [[ $verbose = true ]]
    then
        curl -vs "$url"
    else
        curl -vs -o /dev/null "$url"
    fi
done
