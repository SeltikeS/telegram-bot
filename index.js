const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '5562133672:AAGh8xj7Ukh96GvjmX_iK67JH94FuVH3HLs';
const bot = new TelegramApi(token, { polling: true });
const chats = {};

async function startGame(chatId) {
  await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/28.webp');
  await bot.sendMessage(chatId, `Поиграем?`);
  chats[chatId] = Math.floor(Math.random() * 10);
  await bot.sendMessage(chatId, `Я загадаю число от 0 до 9. Попробуй угадать!`, gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Привет'},
    {command: '/info', description: 'Твоя инфа'},
    {command: '/game', description: 'Поиграем?'},
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text || '';
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || '';
    const lastName = msg.from.last_name || '';
  
    switch (text) {
      case '/start':
        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/1.webp');
        await bot.sendMessage(chatId, `Привет`);
        break;
      case '/info':
        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/2.webp');
        await bot.sendMessage(chatId, `Твоё имя, ${firstName} ${lastName}`);
        break;
      case '/game':
        startGame(chatId);
        break;
      default:
        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/12.webp');
        await bot.sendMessage(chatId, `Я тебя не понимать`);
        break;
    }
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (+data === chats[chatId]) {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/21.webp');
        await bot.sendMessage(chatId, `Поздравляшки! Ты угадал? это и правда было ${chats[chatId]}`, againOptions);
    } else {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/33.webp');
        await bot.sendMessage(chatId, `Плак, плак... Ты не угадал. Я загадал ${chats[chatId]}`, againOptions);
    }
  });
}

start();

