stage('Get Post Configuration Request Parameters') {
    println("Hello World!")
    emailext mimeType:'text/html', body: "Hello World!", subject: 'Resource Provisioning Result', to: "roba.edoardo@gmail.com"
}