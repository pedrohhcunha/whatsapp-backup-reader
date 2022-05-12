const fs = require('fs')

async function readFile(filePath) {
    return await fs.promises.readFile(filePath, 'utf8')
}

function stringToObject(string) {
    let commaSepareted = string.split(',') // ['00/00/00', ' 22:43 - User: message']
    let date = commaSepareted[0] // 00/00/00
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

async function writeJSON(listOfMessages) {
    return await fs.promises.writeFile(`./outputs/${new Date().valueOf()}.json`, JSON.stringify(listOfMessages))
}

async function writeCSV(listOfMessages) {
    let csv = 'date,time,username,message\n'
    listOfMessages.forEach(message => {
        csv += `${message.date},${message.time},${message.username},${message.message}\n`
    })
    return await fs.promises.writeFile(`./outputs/${new Date().valueOf()}.csv`, csv)
}

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
main()