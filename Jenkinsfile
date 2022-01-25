pipeline {
    agent any
    triggers { 
        pollSCM('0 */3 * * *') 
    }
    stages {
        stage('Linter'){
            steps{
                script {
                    env.LINT = sh(script: "npm install && npm run lint",returnStatus:true)
                }
            }

        }
        stage('Test'){
            steps{
                script {
                    env.TEST = sh(script: " npm run build && npm start",returnStatus:true)
                }
            }
        }
        stage('Update_Readme'){
            steps{
                sh """
                    node ./jenkinsScripts/index.js ${env.TEST}
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