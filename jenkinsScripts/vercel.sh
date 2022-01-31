if [ $1 -eq 0 ] && [ $2 -eq 0 ] && [ $3 -eq 0 ] && [ $4 -eq 0 ]
    then
        vercel . --token $5 --confirm --name practica-jenkins
        exit $?
else
    echo $2
    exit 1
fi 
