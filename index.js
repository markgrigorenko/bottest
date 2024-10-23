const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')

const token = '7629542031:AAHt0Us1rxHz-YQNHeVvJDshpHq0sRF4OP4';

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру, а ты должен отгадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало'},
        {command: '/info', description: 'Инфо'},
        {command: '/game', description: 'Игра'},

    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        console.log(msg)

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5d4/afa/5d4afa07-fc1f-4306-bff9-527e97dd0543/9.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать!`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} и ты из ${msg.from.language_code}`);
        }
        if (text === '/game') {
           return  startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')

    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)

        console.log('chats[chatId]', chats)

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, 'Угадал!', againOptions)
        } else {
            return await bot.sendMessage(chatId, `Бот загадывал  ${chats[chatId]}. Не угадал:(`, againOptions)
        }


        console.log(msg)
    })
}

start()
