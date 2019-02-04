pipeline {
    agent {
        node {
            label 'master'
        }
    }
    
    environment {
        JENKINS_NODE_COOKIE = 'dontkill'
        PORT="3000"
        PostgreSQLUser="${DB_USERNAME}"
        PostgreSQLEndpoint="${DB_URL}"
        PostgreSQLPassword="${DB_PASSWORD}"
    }
    
    stages {
        stage('Preparation') { // for display purposes
            steps {
              // clean the workspace
              cleanWs()
            }
        }

       stage('Download') {
           steps {
              // Download code from a GitHub repository
              git branch: 'master', url: 'https://github.com/AaronGr/project0-ers-api-AaronGr.git'
           }
        }

        stage('NPM Install') {
            steps {
            // go into client-side directory
                dir('project0-ers-api-AaronGr') {
                    // install node modules
                    sh 'npm install'
                }
            }
        }
        
        stage('Destroy Old Server') {
            steps {
                script {
                    try {
                        // kill any running instances
                        sh "fuser -k ${PORT}/tcp"
                    } catch (all) {
                        // if it fails that should mean a server wasn't already running
                    }
                }
            }
        }

        // Deploy the application
        stage('Deploy') {
            steps {
                dir('project0-ers-api-AaronGr') {
                    // deploy the application in the background
                    sh 'nohup npm run deploy &'                      
                    // use the one below instead of the one above if you want the build to never end but see the console outputs of the api
                    // sh 'npm run deploy'
                }
            }
        }

    }
    
    post {
        always {
            sh "echo 'i always run'"
            
            /* SLACK message example
            
            slackSend channel: '#some-channel',
                color: 'good',
                message: "The Janus server has attempted a build"
                
            */
        }
        
        success {
            sh "echo 'i only run on success'"
        }
        
        unstable {
            sh "echo 'i run when the build is unstable (testing?)'"
        }
        
        failure {
            sh "echo 'i run when things failed'"
        }
        
        changed {
            sh "echo 'i run when there is a successful build after a failed one'"
            sh "echo 'or a failed build after a successful one'"
        }
    }
}