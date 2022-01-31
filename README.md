# Práctica Jenkins 
Realizado por: 
Adrián Ramos Ureña

## ¿Qué es Jenkins?
Jenkins es un servidor open source para la integración continua. Es una herramienta que se utiliza para compilar y probar proyectos de software de forma continua, lo que facilita a los desarrolladores integrar cambios en un proyecto y entregar nuevas versiones a los usuarios. Escrito en Java, es multiplataforma y accesible mediante interfaz web. Es el software más utilizado en la actualidad para este propósito.

Con Jenkins, las organizaciones aceleran el proceso de desarrollo y entrega de software a través de la automatización. Mediante sus centenares de plugins, se puede implementar en diferentes etapas del ciclo de vida del desarrollo, como la compilación, la documentación, el testeo o el despliegue.
## ¿Qué se puede hacer con Jenkins?
Con Jenkins podemos automatizar multitud de tareas que nos ayudarán a reducir el time to market de nuestros productos digitales o de nuevas versiones de ellos. Concretamente, con esta herramienta podemos:

    Automatizar la compilación y testeo de software.
    Notificar a los equipos correspondientes la detección de errores.
    Desplegar los cambios en el código que hayan sido validados.
    Hacer un seguimiento de la calidad del código y de la cobertura de las pruebas.
    Generar la documentación de un proyecto.

Podemos ampliar las funcionalidades de Jenkins a través de múltiples plugins creados por la comunidad, diseñados para ayudarnos en centenares de tareas, a lo largo de las diferentes etapas del proceso de desarrollo.
## Ventajas de Jenkins
Algunas de las características que hacen de Jenkins una de las mejores herramientas para aplicar integración continua son:

1. Es sencilla de instalar.
2. Es una herramienta opensource respaldada por una gran comunidad.
3. Es gratuita.
4. Es muy versátil, gracias a sus centenares de plugins.
5. Está desarrollada en Java, por lo que funciona en las principales plataformas.

## Desventajas de utilizar Jenkins
Algunos aspectos negativos de Jenkins a tener en cuenta a la hora de decantarnos por ella son:

1. Su interfaz de usuario es anticuada y poco intuitiva, aunque puede mejorarse con plugins como Blue Ocean.
2. Sus pipelines son complejas y pueden requerir mucho tiempo de dedicación a las mismas.
3. Algunos de sus plugins están desfasados.
4. Necesita de un servidor de alojamiento, que puede conllevar configuraciones tediosas y requerir ciertos conocimientos técnicos.
5. Necesita ampliar su documentación en algunas áreas. 

## Jenkinsfile 
Un pipeline Jenkins es un conjunto de plugins que soporta la implementación e integración de pipelines (tuberías) de despliegue continuo en Jenkins.

Un pipeline es un conjunto de instrucciones del proceso que siga una aplicación desde el repositorio de control de versiones hasta que llega a los usuarios.

En la práctica a realizar, construiremos una pipeline con distintos stages para poder testear la aplicación, subir los cambios a nuestro repositorio git, desplegar la aplicación en Vercel y notificar por correo. A continuación explicaremos todos los apartados utilizados en la pipeline para la ejecución de esta.

## Apartados del Jenkinsfile

### Parameters 
Uno de los puntos de la práctica era introducir por parametros tres variables que posteriormente utilizaremos en los distintos stages. 
El primer parámetro será el Ejecutor y es el que se especificará el nombre de la persona que ejecuta la pipeline.
El segundo parámetro será el Motivo y podremos especificar el motivo por el cual estamos ejecutando la pipeline.
El tercer parámetro será el Correo de Notificación y almacenará el correo al que notificaremos el resultado de cada stage ejecutado

```
    parameters {
        text(name:'Ejecutor', defaultValue:'''Pepe''')
        text(name:'Motivo', defaultValue:'''Motivo de ejecución''')
        text(name:'Correo', defaultValue:'''ejemplo@ejemplo.com''')
    }
```

![image](https://user-images.githubusercontent.com/75810680/151886915-47d30794-ddcc-4907-849b-4d7dbc59f783.png)

### Triggers
Otro de los apartados de la práctica, era introducir un trigger que, cada 3 horas, comprobara si han habido cambios en el repositorio y de ser así, ejecutaría de nuevo la pipeline. 
Para calcular las 3 horas en un cron, he utilizado la página [Crontab.guru](https://crontab.guru/)

```
    triggers { 
        pollSCM('0 */3 * * *') 
    }
```
### Stages
Una stage es una separación lógica de los steps. Es decir grupos de secuencias conceptualmente distintas. que se usan para visualizar el progreso en jenkins. Lo mas común es que tengamos Stages como: Compilar, Probar e Instalar.

Los steps representan una sola operación (le dice a jenkins que hacer, por ejemplo, clonar un repositorio o ejecutar un script)

#### Init Stage
Para empezar, tendremos un stage inicial el cual utilizaremos para instalar todas las dependencias necesarias , construir la aplicación y arrancarla. Realizamos estas operaciones al principio para que se inicialice el servidor y tenerlo listo para otros stages como por ejemplo el de cypress .
```
        stage('Init'){
            steps{
                sh 'npm install -y'
                sh 'npm run build'
                sh 'npm start &'
            }
        }
```

#### Linter Stage
##### ¿Qué es Linting?
Es una herramienta de software que revisa y "observa" tu código en busca de errores que puedan afectar tu código. Algunos "linteres" incluso pueden darte sugerencias de como arreglar el error o incluso arreglarlo ellos mismos.
Un ejemplo de herramienta de "linting" es ESLint.

Una vez sabemos que es el Linting, ejecutaremos ESLint para encontrar posibles errores en nuestros archivos javascript. El resultado del stage lo guardaremos en una variable de entorno nombrada como LINT.Como veremos en todas las variables de entorno, realizamos returnStatus:true para que, aunque falle el stage, continue la secuencia y ese resultado este guardado en la variable de entorno.
```
        stage('Linter'){
            steps{
                script {
                    env.LINT = sh(script: "npm run lint",returnStatus:true)
                }
            }

        }
```
#### Test Stage
Este stage será el encargado de testear nuestro proyecto y ver los posibles errores generales de este. Para ello hemos utilizado el framework de testing Cypress.
##### ¿Qué es Cypress?
Cypress es un framework de testing moderno y todo en uno. Es rápido, fácil de usar y permite ejecutar pruebas sobre cualquier aplicación web. En poco más de 2 años desde su lanzamiento de la versión 1.0.0 se ha convertido en una de las herramientas más populares de testing.
##### Ventajas de utilizar Cypress
Cypress es todo en uno. Con una sola dependencia y sin configuración tenemos instalada y configurada la librería de aserciones con mocking, stubing y sin depender de Selenium. Todo ello con los frameworks y librerías ya conocidas por los desarrolladores front-end como Mocha, Chai, Sinon, Lodash, jQuery, etc.

A diferencia de otras herramientas Cypress dispone de una interfaz gráfica que permite ver de forma interactiva cada uno de los pasos y las acciones ejecutadas durante la prueba, el estado de la aplicación, la duración de la prueba, los test fallidos o pasados.

Además de otras ventajas como:

- Espera automática de los elementos (DOM sin cargar por completo, framework sin terminar de arrancar, petición AJAX sin completar, etc.). Lo cual minimiza los falsos positivos en las pruebas fallidas
- Grabación automática del estado de la aplicación durante la ejecución de pruebas. Lo cual permite ver en qué estado estaba la aplicación en cada uno de los pasos
- Spies, stubs y mocks que además de las de E2E permite hacer pruebas unitarias
- Intercepción de las peticiones AJAX / XHR para hacer aserciones o crear fixtures o mocks
- Capturas de pantalla y videos automática
- Depuración nativa con instrucción debugger
- Velocidad, la ejecución pruebas comienzan tan rápido como se cargue la aplicación
- Documentación muy completa
- Mensajes de error claros
- Y por último pero no menos importante Cypress se puede extender con plugins que hace esta herramienta aún más potente.

Nuestra stage de Cypress quedará de la siguiente manera, y estará guardado el resultado en una variable de entorno:
```
        stage('Test'){
            steps{
                script {
                    env.TEST = sh(script: "./node_modules/.bin/cypress run ",returnStatus:true)
                }
            }
        }
```
Pero cabe recalcar, que para poder utilizar cypress, hemos tenido que instalar las dependecias necesarias dentro del contenedor.
#### Resultado de los Ultimos Test
<!---Start place for the badge -->
![badge-success](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)
<!---End place for the badge -->

#### Update Readme Stage
En este stage, lanzaremos un archivo JS que se encargará de cambiar el badge utilizado anteriormente que nos mostrará si el test ha salido correctamente o a fallado. El resultado estará guardado en una variable de entorno.

En el archivo JS , recibiremos como parámetro el resultado del stage de Test y dependiendo de este, como hemos dicho anteriormente, mostraremos badge success o badge failure.

###### Stage

```
        stage('Update_Readme'){
            steps{
                script {
                    env.UPDATE = sh(script: "cd jenkinsScripts && npm install && node index.js ${env.TEST} ",returnStatus:true)
                }
            }
        }
```

###### Index.js
```
const core = require('@actions/core');
const fs = require('fs');

async function new_badge() {

    let outcome = parseInt(process.argv[2]);
    let readme = '../README.md'; 
    let badge;
    console.log(outcome);
    if (outcome === 0) {
        console.log('Entra success');
        badge = '![badge-success](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)'
    } else {
        console.log('Entra failure')
        badge = '![badge-failure](https://img.shields.io/badge/test-failure-red)'
    }

    fs.readFile(readme, 'utf8', function (err, data) {
        console.log('entra fs readfile')
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/(?<=\<!---Start place for the badge --\>\n)[^]+(?=\n\<!---End place for the badge --\>)/g, badge);

        fs.writeFile(readme, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

}

new_badge();
```
#### Push Changes Stage
Este stage lo utilizaremos para realizar todas las operaciones git para subir los cambios a nuestro servidor. El resultado lo guardaremos en una variable de entorno.

Para hacer funcionar este stage, deberemos crear un token en Github, el cual guardaremos en las credenciales de Jenkins para poder asignar los comandos git a nuestra cuenta. 

Una vez tenemos guardado el token en las credenciales de Jenkins, utilizaremos la sintaxis withCredentials para obtenerlo en la pipeline y así poder enviarlo a nuestro archivo SH para que se ejecuten los comandos.

También le pasaremos al archivo SH el parametro Ejecutor y el parametro Motivo que hemos explicado anteriormente
###### Stage
```
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
```

###### Git_Commands.sh
```
git config --global user.email \'adri7agu@gmail.com\'
git config --global user.name \'AdriRameti\'
git remote set-url origin https://$1@github.com/AdriRameti/Practica_Jenkins.git
git add .
git commit -m "Pipeline ejecutada por $2. Motivo: $3"
git push origin HEAD:master
```
#### Deploy Vercel Stage
Esta stage será la encargada de desplegar nuestro proyecto en Vercel. Además guardaremos el resultado en una variable de entorno.
##### ¿Qué es Vercel?
Vercel es una plataforma para frameworks frontend y sitios estáticos , creada para integrarse con su contenido, comercio o base de datos sin cabeza.

Brindamos una experiencia de desarrollador sin fricciones para encargarse de las cosas difíciles: implementar instantáneamente, escalar automáticamente y brindar contenido personalizado en todo el mundo.

Facilitamos a los equipos frontend el desarrollo, la vista previa y el envío de experiencias de usuario agradables, donde el rendimiento es el valor predeterminado.

Para poder hacer funcionar el despliegue en vercel, deberemos crear en nuestro perfil de Vercel un token que guardaremos en las credenciales de Jenkins y lo utilizaremos para poner en marcha el despliegue.

![image](https://user-images.githubusercontent.com/75810680/151887022-98d39bef-d4c9-4cb7-abba-3effc02c3f91.png)

Al igual que hemos utilizado el withCredentials para las acciones de git, aquí también lo utilizaremos para poder acceder a esa credencial que contiene el token de vercel y así poder utilizarlo. Además, le pasaremos al archivo SH el resultado de los stages anteriores para que solo haya despliegue si todas las stages anteriores se han ejecutado correctamente. Por otra parte, el resultado del despliegue al igual que las otras stages, se guardará en una variable de entorno.
###### Stage
```
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
```
###### Vercel.sh
Para ejecutar vercel, utilizaremos los comanods:
1. vercel . : Para realizar el despliegue.
2. --token <TOKEN> : Para asociar la cuenta con el despliegue.
3. --confirm : Para confirmar todas las preguntas de Y/N del cuestionario que aparece cuando se realiza el despliegue.
4. --name <NOMBRE> : Para asignar un nombre al proyecto
```
if [ $1 -eq 0 ] && [ $2 -eq 0 ] && [ $3 -eq 0 ] && [ $4 -eq 0 ]
    then
        vercel . --token $5 --confirm --name practica-jenkins
        exit $?
else
    echo $2
    exit 1
fi 
```
Pincha [AQUÍ](https://practica-jenkins-adrirameti.vercel.app/) para ir a la página web desplegada.

![image](https://user-images.githubusercontent.com/75810680/151887119-2e803528-9eba-440f-841d-af71bed1f543.png)

#### Stages Paralelas 
En este punto, realizaremos una stage paralela donde ejecutaremos a la vez una notificación por correo electrónico y una stage condicional que dependiendo del resultado de las stages anteriores nos mostrara un mensaje o otro. 

```
        stage('Parallel Stage') {
            parallel {
                stage('Notification') {
                    steps {
                        . . .
                    }
                }

                stage('Custom_Stage') {
                    steps {
                        script {    
                            . . .
                        }
                    }
                }
            }
        }
```

##### Notification Stage
Para realizar el envio del correo electrónico, he probado el plugging Email Extension, pero no me funcionó. Así que para poder realizar este apartado, he utilizado la libreria Nodemailer ya que tenemos node instalado en nuestro contenedor. La página de referencia ha sido [Nodemailer](https://nodemailer.com/about/)

Como se puede observar en el JS de ejemplo de la web, utiliza una función del Nodemailer para generar el usuario y contraseña, pero nosotros utilizaremos el smtp de gmail para poder asociar nuestro perfil de google. 

Para ello nuestro usuario será nuestro correo electrónico y para la contraseña, accederemos a nuestra cuenta y generaremos una contraseña de aplicación, que al igual que todos los tokens , guardaremos en las credenciales de jenkins y utilizaremos la sintaxis withCredentials para acceder a ella y obtener su valor.

Además, el correo enviará el resultado de todas las stages como cuerpo del correo, el destinatario será el Correo que introduciremos como parámetro.

###### Stage
```
                stage('Notification') {
                    steps {
                    withCredentials([string(credentialsId: 'googlePass', variable: 'PASS')]) {
                        sh """
                            cd jenkinsScripts && npm install && npm install nodemailer --save && node mail.js '${Correo}' ${env.LINT} ${env.TEST} ${env.UPDATE} ${env.PUSH} ${env.VERCEL} ${PASS}
                        """
                    }

                    }
                }
```

###### Mail.js
Para asignar el valor de los resultados, utilizaremos if ternarios que dependiendo del valor del resultado, le asignara Resultado Correcto o por contra Resultado Incorrecto
```
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let receiver = process.argv[2]
  let lintResult = (parseInt(process.argv[3]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let testResult = (parseInt(process.argv[4]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let updateResult = (parseInt(process.argv[5]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let pushResult = (parseInt(process.argv[6]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let vercelResult = (process.argv[7] == 'null') ? "Resultado Correcto" : "Resultado incorrecto"
  let pass = process.argv[8]
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'adri7agu@gmail.com', // generated ethereal user
      pass: pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'adri7agu@gmail.com', // sender address
    to: receiver, // list of receivers
    subject: "Resultado de la pipeline ejecutada", // Subject line
    text: "Linter_stage: "+lintResult+" ,Test_stage: "+testResult+" ,Update_readme_stage: "+updateResult+" ,Push_Changes_Stage: "+pushResult+" ,Vercel_Stage: "+vercelResult, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
```

![image](https://user-images.githubusercontent.com/75810680/151887209-7bfa86d9-e01f-4bcc-9253-085989f00db6.png)

#### Custome Stage
En este punto, realizaremos un stage condicional que dependiendo del resultado de los diferentes stages, mostraremos un mensaje por consola o otro distinto.
```
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
```

### Credenciales de Jenkins
Como hemos podido observar, utilizamos muchas variables sensibles que no queremos que se muestren por seguridad del proyecto o por otros aspectos. Es por eso que cada una de esas variables sensibles, se han guardado en el apartado de credenciales de Jenkins.

![image](https://user-images.githubusercontent.com/75810680/151887280-0c6a64c6-51c8-49dd-9cb6-4d06d1a883fd.png)

### Ejecución de la Pipeline
Para poder ejecutar la pipeline y observar los resultados, he utilizado el plugin Blue Ocean 
#### ¿Qué es Blue Ocean?
Blue Ocean replantea la experiencia de usuario de Jenkins. Diseñado desde cero para Jenkins Pipeline , pero aún compatible con trabajos de estilo libre, Blue Ocean reduce el desorden y aumenta la claridad para cada miembro del equipo. Las características principales de Blue Ocean incluyen:

- Visualizaciones sofisticadas de Pipelines de entrega continua (CD), lo que permite una comprensión rápida e intuitiva del estado de su Pipeline.

- Editor de canalizaciones : hace que la creación de canalizaciones sea accesible al guiar al usuario a través de un proceso intuitivo y visual para crear una canalización.

- Personalización para adaptarse a las necesidades basadas en roles de cada miembro del equipo.

- Identifique con precisión cuándo se necesita una intervención y/o surgen problemas. Blue Ocean muestra dónde se necesita atención en la canalización, lo que facilita el manejo de excepciones y aumenta la productividad.

- La integración nativa para sucursales y solicitudes de extracción habilita la máxima productividad del desarrollador al colaborar en el código con otros en GitHub y Bitbucket.

La primera vez que entramos a utilizar Blue Ocean, al seleccionar la opción Github, de donde queremos obtener el código, nos pedirá un token asociado a la cuenta de nuestro Github. Una vez generemos e introducimos el token en este apartado, Blue Ocean se guardará el token y se guardará por tanto tu usuario de Github. Una vez en este punto ya podrás acceder a cualquier repositorio tuyo alojado en Github. 

![image](https://user-images.githubusercontent.com/75810680/151887365-1a5a81c6-c819-4c33-bce5-a2333565a9b8.png)
    
![image](https://user-images.githubusercontent.com/75810680/151887420-2e60a854-aaa2-4ee4-96c4-ef03dc8f27cb.png)

