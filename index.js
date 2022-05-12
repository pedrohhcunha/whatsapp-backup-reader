//Importa biblioteca para manipulação de arquivos
const fs = require('fs')

//lê u arquivo .txt e retorna o conteúdo em formato de string
async function readFile(filePath) {
    return await fs.promises.readFile(filePath, 'utf8')
}

//Transforma uma string no padrão de backup do wtahtapp em um objeto
function stringToObject(string) {
    let commaSepareted = string.split(',')
    let date = commaSepareted[0]
    if(commaSepareted.length >= 2){

        let hyphenSepareted = commaSepareted.filter((_, index) => index >= 1).join().split('-')
        let time = hyphenSepareted[0].trimEnd().trimStart()

        let twoPointsSepareted = hyphenSepareted.filter((_, index) => index >= 1).join().split(':')
        let username = twoPointsSepareted[0].trimEnd().trimStart()
        let message = twoPointsSepareted.filter((_, index) => index >= 1).join()

        return {
            date,
            time,
            username,
            message
        }
    }
    return null
}

//Escreve um arquivo JSON com a lista de mensagens
async function writeJSON(listOfMessages) {
    return await fs.promises.writeFile(`./outputs/${new Date().valueOf()}.json`, JSON.stringify(listOfMessages))
}

//Escreve um arquivo CSV com a lista de mensagens
async function writeCSV(listOfMessages) {
    let csv = 'date,time,username,message\n'
    listOfMessages.forEach(message => {
        csv += `${message.date},${message.time},${message.username},${message.message}\n`
    })
    return await fs.promises.writeFile(`./outputs/${new Date().valueOf()}.csv`, csv)
}

//Lê um arquivo TXT de backup do wtahtapp e transforma em arquivos JSON e CSV
async function main() {
    console.time("WhatsApp-Backup-Reader")
    const text = await readFile('./inputs/whats.txt')
    const lines = text.split('\n')
    const messagesList = lines.map(line => stringToObject(line)).filter(line => line)
    const writingResults = await Promise.all([
        writeJSON(messagesList),
        writeCSV(messagesList)
    ])
    console.timeEnd("WhatsApp-Backup-Reader")
    return writingResults.every(result => result)
}

//Executa o programa
main()