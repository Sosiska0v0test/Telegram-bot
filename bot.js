 require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  ctx.reply('Щоб розпочати, відправ у цей бот свою геолокацію📍', {
    reply_markup: {
      keyboard: [[{
        text: 'Відправити Геолокацію',
        request_location: true
      }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.on('message', async (ctx) => {
  if (ctx.message.location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=b9eef3caee88df715064d809dc28e02a`;
    const res = await axios.get(url);
    const tempCelsius = res.data.main.temp - 273.15;
    let emoji = '';
    if (tempCelsius >= -20 && tempCelsius <= 0) {
      emoji = '❄️';
    } else if (tempCelsius >= 1 && tempCelsius <= 15) {
      emoji = '⛅';
    } else if (tempCelsius >= 16 && tempCelsius <= 35) {
      emoji = '🌞';
    }
    ctx.reply(`Країна: ${res.data.sys.country}\nРайон: ${res.data.name}\nПоточна температура: ${tempCelsius.toFixed(2)} °C ${emoji}`);
  }
});
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
