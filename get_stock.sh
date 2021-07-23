for i in $(seq -f "%02g" 1 20)
    do
        npm run ccass 6060 2021-07-$i
    done