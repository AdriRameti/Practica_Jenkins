if [ $1 -eq 0 && $2 -eq 0 ] 
    then
        echo $2
        vercel .
        exit 0
else
    echo $2
    exit 1
fi 