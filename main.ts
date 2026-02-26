import 'dotenv/config';
import { Client, CommandInteraction, GatewayIntentBits, Message, SlashCommandBuilder } from "discord.js";
import * as fs from 'fs';
import * as http from 'http';

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
}).listen(process.env.PORT || 3000);

// 権限の設定
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const textData = fs.readFileSync('waruguchi.txt', 'utf-8');
const ngWords: string[] = textData
    .split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0);

client.once('ready', () => {
    console.log(`準備完了!読み込んだチクチク言葉の数: ${ngWords.length}`);
});

// 誰かがメッセージを送信したときに実行される処理
client.on('messageCreate', (message: Message) => {
    if (message.author.bot) return;

    const content = message.content;

    const foundNgWords: string[] = ngWords.filter(word => content.includes(word));


    if (foundNgWords.length > 0) {

        const words = foundNgWords.join('\n');
        message.reply(`ちょっと待って❗️❗️❗️✋️\nそれ、チクチク言葉じゃない❓️\n平和なチャットを心がけるようにしましょう😉\n\n＜検出したNGワード＞\n${words}`);
    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('niconico')
        .setDescription('おすすめの動画を教えてくれます'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('https://www.nicovideo.jp/watch/sm41656368');
    }
}

const token = process.env.DISCORD_BOT_TOKEN;
client.login(token);