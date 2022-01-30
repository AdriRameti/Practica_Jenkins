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
                // sh """
                //     cd jenkinsScripts && 
                //     npm install &&
                //     node index.js ${env.TEST}
                // """
            }
        }
        stage('Push_Changes'){
            steps{
                sh 'chmod +x ./jenkinsScripts/git_commands.sh'
                withCredentials([usernameColonPassword(credentialsId: 'jenkins_practica', variable: 'TOKEN')]) {
                    script {
                        env.PUSH = sh(script:"./jenkinsScripts/git_commands.sh ${TOKEN} ${Ejecutor} '${Motivo}' ",returnStatus:true)
                    }
                    // sh """
                    //     ./jenkinsScripts/git_commands.sh ${TOKEN} ${Ejecutor} '${Motivo}' 
                    // """
                }

            }
        }
        stage('Deploy_to_Vercel'){
            steps{
                sh 'chmod +x ./jenkinsScripts/vercel.sh'
                // sh """
                //     ./jenkinsScripts/vercel.sh ${env.LINT} ${env.TEST}
                // """
                script {
                    env.VERCEL = sh(script:"./jenkinsScripts/vercel.sh ${env.LINT} ${env.TEST} ${env.UPDATE} ${env.PUSH}")
                }
            }
        }
        stage('Parallel Stage') {
            parallel {
                stage('Notification') {
                    steps {
                        echo 'Stage 1'
                    }
                }

                stage('Custom_Stage') {
                    steps {
                        script {
                            if (env.LINT == '0' && env.TEST == '0' && env.UPDATE == '0' && env.PUSH == '0'){
                                echo "${env.LINT},${env.TEST},${env.UPDATE},${env.PUSH}"
                                echo "Mejor dedicate a otra cosa"
                            }else{
                                echo "Else"
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