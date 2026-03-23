import 'dotenv/config';
import * as dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { AttachmentBuilder, Client, CommandInteraction, GatewayIntentBits, Message, REST, Routes, SlashCommandBuilder } from "discord.js";
import * as fs from 'fs';
import * as http from 'http';

console.log("1. プログラムの読み込みを開始しました");
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
}).listen(process.env.PORT || 3000, () => {
    console.log("2. サーバー起動");
});

// 権限の設定
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const niconicoCommand = new SlashCommandBuilder()
    .setName('niconico')
    .setDescription('おすすめの動画を教えてくれます');

const rakutan = new SlashCommandBuilder()
    .setName('rakutan')
    .setDescription('2年後期で必修落単！？')

const commands = [niconicoCommand.toJSON(), rakutan.toJSON()];

const token = process.env.DISCORD_BOT_TOKEN?.trim();

const textData = fs.readFileSync('waruguchi.txt', 'utf-8');
const ngWords: string[] = textData
    .split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0);

client.once('ready', async () => {
    console.log(`準備完了!読み込んだチクチク言葉の数: ${ngWords.length}`);

    if (token && client.user) {
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log('スラッシュコマンドの登録が成功しました');
        } catch (e) {
            console.error('コマンドの登録中にエラーが発生しました: ', e);
        }
    }
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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'niconico') {
        await interaction.reply('https://www.nicovideo.jp/watch/sm41656368');
    } else if (interaction.commandName === 'rakutan') {
        await interaction.deferReply();

        const imageFile = new AttachmentBuilder('./必修落単.jpg');

        await interaction.editReply({
            content: '必修落単！？',
            files: [imageFile]
        });
    }
});

console.log(`3. Discordへの接続を開始します。(トークン状態: ${token ? 'セットされています' : '空っぽです！やりませんねスギィ！'})`);
client.login(token).catch(e => {
    console.error("ログインに失敗しました。");
    console.error(e);
});