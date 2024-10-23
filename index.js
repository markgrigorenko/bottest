const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db')
const UserModel = require('./models')

const token = '7629542031:AAER7zMEosEGtyKUL2mQPdkY4l5lvYIWQmM';

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {

    await bot.sendMessage(chatId, `Сейчас я загадаю цифру, а ты должен отгадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = async () => {

    try {
    /*    await UserModel.destroy({
            where: {}, // Пустое условие удалит все записи
            truncate: true // Если вы хотите использовать "truncate" для более быстрой очистки
        });*/
       /* await sequelize.sync({ force: true }); // Это приведет к удалению всех таблиц и их пересозданию
*/
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('e', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начало'},
        {command: '/info', description: 'Инфо'},
        {command: '/game', description: 'Игра'},

    ])

    bot.on('message', async msg => {
        console.log('msg', msg)
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await UserModel.create({chatId})
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5d4/afa/5d4afa07-fc1f-4306-bff9-527e97dd0543/9.webp')
                return  bot.sendMessage(chatId, `Добро пожаловать!`);
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} и ты из ${msg.from.language_code},
                в игре правильных ответов ${user.right} неправильных ${user.wrong} `);
            }
            if (text === '/game') {
                return  startGame(chatId)
            }
            return bot.sendMessage(chatId, 'Я тебя не понимаю')
        } catch (e) {
            return bot.sendMessage(chatId, `произощла ошибка ${e}`, e)
        }

        console.log(msg)
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)

        console.log('chats[chatId]', chats)

        if (data === '/again') {
            return startGame(chatId)
        }

        const user = await UserModel.findOne({chatId})

        if (data == chats[chatId]) {
            user.right += 1
             await bot.sendMessage(chatId, 'Угадал!', againOptions)
        } else {
            user.wrong += 1

             await bot.sendMessage(chatId, `Бот загадывал  ${chats[chatId]}. Не угадал:(`, againOptions)
        }

        await user.save()
        console.log(msg)
    })
}

start()
