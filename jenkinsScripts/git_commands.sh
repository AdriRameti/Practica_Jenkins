git config --global user.email \'adri7agu@gmail.com\'
git config --global user.email \'AdriRameti\'
git remote set-url origin https://$3@github.com/AdriRameti/Practica_Jenkins.git
git add .
git commit -m "Pipeline ejecutada por $1. Motivo: $2"
git push origin HEAD:master