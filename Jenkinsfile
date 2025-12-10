pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        } 
        stage('Lint') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run lint'
                    } else {
                        bat 'npm run lint'
                    }
                }
            }
        }
        stage('Prettier Check') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx prettier --check .'
                    } else {
                        bat 'npx prettier --check .'
                    }
                }
            }
        }
        
    }
}