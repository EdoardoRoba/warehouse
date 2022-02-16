stage('Get Post Configuration Request Parameters') {
    println("Hello World!")
    emailext mimeType:'text/html', body: "Hello World!", subject: 'Report settimanale - magazzino', to: "roba.edoardo@gmail.com"
}