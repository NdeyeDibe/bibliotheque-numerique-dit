pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {

        stage('Récupération du code') {
            steps {
                echo '📥 Récupération du code depuis GitHub...'
                checkout scm
            }
        }

        stage('Vérification de lenvironnement') {
            steps {
                echo '🔍 Vérification de Docker...'
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Build des images Docker') {
            steps {
                echo '🐳 Construction des images Docker...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} build'
            }
        }

        stage('Arrêt des anciens conteneurs') {
            steps {
                echo '🛑 Arrêt des anciens conteneurs...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down --remove-orphans'
            }
        }

        stage('Déploiement') {
            steps {
                echo '🚀 Déploiement de lapplication...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} up -d'
            }
        }

        stage('Vérification') {
            steps {
                echo '✅ Vérification des conteneurs...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} ps'
            }
        }
    }

    post {
        success {
            echo '🎉 Déploiement réussi !'
        }
        failure {
            echo '❌ Échec du déploiement !'
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down'
        }
    }
}
