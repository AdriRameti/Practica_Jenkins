git config --global user.email \'adri7agu@gmail.com\'
git config --global user.name \'AdriRameti\'
git remote set-url origin https://$1@github.com/AdriRameti/Practica_Jenkins.git
git add .
git commit -m "Pipeline ejecutada por $2. Motivo: $3"
git push origin HEAD:master