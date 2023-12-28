import chalk from "chalk"

const logger = {
    db: (msg) => {
        console.log(`${chalk.bgCyan.bold(' SEQUELIZE ')} ${msg}`)
    },
    server: (msg) => {
        console.log(`${chalk.bgYellow.bold(' SERVER ')} ${msg}`)
    },
    error: (msg) => {
        console.log(`${chalk.bgRed.bold(' ERROR ')} ${msg}`)
    }
}

export default logger