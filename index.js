//Importa biblioteca para manipulação de arquivos
const fs = require('fs')

//lê o arquivo .txt e retorna o conteúdo em formato de string
async function readFile(filePath) {
    return await fs.promises.readFile(filePath, 'utf8')
}

//Transforma uma string no padrão de backup do wtahtapp em um objeto
function stringToObject(string) {
    const keys = ["date","time","username","message"]
    let matches = string.match(/(\d+\/\d+\/\d+), (\d+:\d+) - (\w+): (.*)/i)?.slice(1)?.map((n,i)=>[keys[i],n])

    if(matches) 
        return Object.fromEntries(matches)
    else
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
async function main(pathName) {
    if(!pathName) console.log("Please, inform the pathname of the file to be read")
    console.log("Reading file...")
    console.time("WhatsApp-Backup-Reader")
    const text = await readFile(pathName)
    const lines = text.split('\n')
    const messagesList = lines.map(line => stringToObject(line)).filter(line => line)
    const writingResults = await Promise.all([
        writeJSON(messagesList),
        writeCSV(messagesList)
    ])
    if(writingResults){
        console.timeEnd("WhatsApp-Backup-Reader")
        return console.log("Arquivos gerados com sucesso! Verifique o diretório outputs!")
    }
    console.log("Erro ao gerar arquivos!")
}


//Busca o pathname passado via clid
const pathName = process.argv[2]

//Executa o programa
main(pathName)