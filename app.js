require('dotenv').config()
const port = 3000;
const express = require('express')
const superagent = require('superagent');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup')
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express()
app.get('/', (req, res) => {
    res.send('Hi')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}! Узнай прогноз погоды в твоем городе.
Введи город на английском языке и узнай, что тебе одеть!)`,
    Markup.keyboard([
        ['Kramatorsk', 'Sloviansk'],
        ['Druzhkivka', 'Kiev']
    ])
        .resize()
        .extra()
))

bot.on('text', async (ctx) => {
    console.log(ctx.message.from.first_name);
    try {
        await superagent.get(`http://api.openweathermap.org/data/2.5/weather?q=${ctx.message.text}&appid=395fdbf92bcc5120cad3e5dc85badec6&lang=ru`)
            .then(function (data) {
                const formatDataInfo =
                    `
                    Город: ${data.body.name}
                    
                    Температура: ${Math.floor(data.body.main.temp - 273)} °C

                    Скорость ветра: ${data.body.wind.speed} м/с

                    Видимость: ${data.body.visibility / 1000} км`
               ctx.reply(formatDataInfo);
            })
    }
    catch {
        console.log('Ошибка')
        ctx.reply('Такого города нет')
    }
bot.help((ctx) => ctx.reply('Введите город на латинице!'))

})
bot.use((ctx) => {
    console.log(ctx.message.first_name)
})

bot.launch()


