if [ $1 -eq 0 ] && [ $2 -eq 0 ]
    then
        echo $2
        vercel . --token E1yvwaUWNlAuVs0d5fPg5uN7 --confirm --name practica-jenkins
        exit 0
else
    echo $2
    exit 1
fi 
