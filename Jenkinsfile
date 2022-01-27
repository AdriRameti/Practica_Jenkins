pipeline {
    agent any
    triggers { 
        pollSCM('0 */3 * * *') 
    }
    stages {
        stage('Init'){
            steps{
                sh 'npm install -y'
                sh 'npm run build'
                sh 'npm start &'
            }

        }
        stage('Linter'){
            steps{
                script {
                    env.LINT = sh(script: "npm run lint",returnStatus:true)
                }
            }

        }
        stage('Test'){
            steps{
                script {
                    env.TEST = sh(script: "./node_modules/.bin/cypress run ",returnStatus:true)
                }
            }
        }
        stage('Update_Readme'){
            steps{
                sh """
                    cd jenkinsScripts && 
                    npm install &&
                    node index.js ${env.TEST}
                """
                sh 'git config --global user.email \'adri7agu@gmail.com\''
                sh 'git config --global user.email \'AdriRameti\''
                sh """
                    git add .
                    git commit -m "Update Readme"
                    git push origin HEAD:master
                """
            }
        }
    }
    parameters {
        text(name:'Ejecutor', defaultValue:'''Nombre de la persona''')
        text(name:'Motivo', defaultValue:'''Motivo de ejecución''')
        text(name:'Correo', defaultValue:'''ejemplo@ejemplo.com''')
    }
}