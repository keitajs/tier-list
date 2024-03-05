import chalk from "chalk"

const logger = {
    db: (msg) => {
        console.log(`${chalk.bgCyan.bold(' SEQUELIZE ')} ${msg}`)
    },
    socket: (msg) => {
        console.log(`${chalk.bgHex('#FA5').bold(' SOCKET ')} ${msg}`)
    },
    server: (msg) => {
        console.log(`${chalk.bgYellow.bold(' SERVER ')} ${msg}`)
    },
    error: (msg) => {
        console.log(`${chalk.bgRed.bold(' ERROR ')} ${msg}`)
    }
}

export default logger