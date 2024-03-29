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
                script {
                    env.UPDATE = sh(script: "cd jenkinsScripts && npm install && node index.js ${env.TEST} ",returnStatus:true)
                }
            }
        }
        stage('Push_Changes'){
            steps{
                sh 'chmod +x ./jenkinsScripts/git_commands.sh'
                withCredentials([usernameColonPassword(credentialsId: 'jenkins_practica', variable: 'TOKEN')]) {
                    script {
                        env.PUSH = sh(script:"./jenkinsScripts/git_commands.sh ${TOKEN} ${Ejecutor} '${Motivo}' ",returnStatus:true)
                    }
                }

            }
        }
        stage('Deploy_to_Vercel'){
            steps{
                sh 'chmod +x ./jenkinsScripts/vercel.sh'
                withCredentials([string(credentialsId: 'vercel', variable: 'VTOKEN')]) {
                    script {
                        env.VERCEL = sh(script:"./jenkinsScripts/vercel.sh ${env.LINT} ${env.TEST} ${env.UPDATE} ${env.PUSH} ${VTOKEN}")
                    }
                    
                }
            }
        }
        stage('Parallel Stage') {
            parallel {
                stage('Notification') {
                    steps {
                    withCredentials([string(credentialsId: 'googlePass', variable: 'PASS')]) {
                        sh """
                            cd jenkinsScripts && npm install && npm install nodemailer --save && node mail.js '${Correo}' ${env.LINT} ${env.TEST} ${env.UPDATE} ${env.PUSH} ${env.VERCEL} ${PASS}
                        """
                    }

                    }
                }

                stage('Custom_Stage') {
                    steps {
                        script {
                            if (env.LINT != '0' && env.TEST != '0' && env.UPDATE != '0' && env.PUSH != '0'){
                                echo "Mejor dedicate a otra cosa"
                            }else if(!env.LINT.toBoolean() == false && !env.TEST.toBoolean() == false && !env.UPDATE.toBoolean()){
                                echo "Debes revisar los comandos de git"
                            }else if(!env.LINT.toBoolean() == false && !env.TEST.toBoolean() == false){
                                echo "Tienes un problema al actualizar el README.md"
                            }else if(!env.LINT.toBoolean() == false){
                                echo "Cuidado con los errores de testeo"
                            }else{
                                echo "Sigue asi, conseguiras lo que quieres"
                            }
                        }
                    }
                }

            }
        }

    }
    parameters {
        text(name:'Ejecutor', defaultValue:'''Pepe''')
        text(name:'Motivo', defaultValue:'''Motivo de ejecución''')
        text(name:'Correo', defaultValue:'''ejemplo@ejemplo.com''')
    }
}