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
            }
        }
        stage('Push_Changes'){
            steps{
                sh 'chmod +x ./jenkinsScripts/git_commands.sh'
                withCredentials([usernameColonPassword(credentialsId: 'jenkins_practica', variable: 'TOKEN')]) {
                    sh """
                        ./jenkinsScripts/git_commands.sh ${TOKEN} ${Ejecutor} '${Motivo}' 
                    """
                }

            }
        }
    }
    parameters {
        text(name:'Ejecutor', defaultValue:'''Nombre de la persona''')
        text(name:'Motivo', defaultValue:'''Motivo de ejecución''')
        text(name:'Correo', defaultValue:'''ejemplo@ejemplo.com''')
    }
}