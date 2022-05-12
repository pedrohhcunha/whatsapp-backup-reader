const fs = require('fs')

async function readFile(filePath) {
    console.log(`Reading file: ${filePath}`)

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

async function main() {
    console.log("=========== WHATSAPP-BACKUP-READER ===========")
    const text = await readFile('./files/whats.txt')
    const lines = text.split('\n')
    const messages = lines.map(line => stringToObject(line)).filter(line => line)
    console.log(messages)
}
main()