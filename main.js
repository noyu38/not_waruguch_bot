"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var discord_js_1 = require("discord.js");
var fs = require("fs");
var http = require("http");
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
}).listen(process.env.PORT || 3000);
// 権限の設定
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
var niconicoCommand = new discord_js_1.SlashCommandBuilder()
    .setName('niconico')
    .setDescription('おすすめの動画を教えてくれます');
var rakutan = new discord_js_1.SlashCommandBuilder()
    .setName('rakutan')
    .setDescription('2年後期で必修落単！？');
var commands = [niconicoCommand.toJSON(), rakutan.toJSON()];
var token = process.env.DISCORD_BOT_TOKEN;
var textData = fs.readFileSync('waruguchi.txt', 'utf-8');
var ngWords = textData
    .split('\n')
    .map(function (word) { return word.trim(); })
    .filter(function (word) { return word.length > 0; });
client.once('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var rest, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("\u6E96\u5099\u5B8C\u4E86!\u8AAD\u307F\u8FBC\u3093\u3060\u30C1\u30AF\u30C1\u30AF\u8A00\u8449\u306E\u6570: ".concat(ngWords.length));
                if (!(token && client.user)) return [3 /*break*/, 4];
                rest = new discord_js_1.REST({ version: '10' }).setToken(token);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, rest.put(discord_js_1.Routes.applicationCommands(client.user.id), { body: commands })];
            case 2:
                _a.sent();
                console.log('スラッシュコマンドの登録が成功しました');
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error('コマンドの登録中にエラーが発生しました: ', e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 誰かがメッセージを送信したときに実行される処理
client.on('messageCreate', function (message) {
    if (message.author.bot)
        return;
    var content = message.content;
    var foundNgWords = ngWords.filter(function (word) { return content.includes(word); });
    if (foundNgWords.length > 0) {
        var words = foundNgWords.join('\n');
        message.reply("\u3061\u3087\u3063\u3068\u5F85\u3063\u3066\u2757\uFE0F\u2757\uFE0F\u2757\uFE0F\u270B\uFE0F\n\u305D\u308C\u3001\u30C1\u30AF\u30C1\u30AF\u8A00\u8449\u3058\u3083\u306A\u3044\u2753\uFE0F\n\u5E73\u548C\u306A\u30C1\u30E3\u30C3\u30C8\u3092\u5FC3\u304C\u3051\u308B\u3088\u3046\u306B\u3057\u307E\u3057\u3087\u3046\uD83D\uDE09\n\n\uFF1C\u691C\u51FA\u3057\u305FNG\u30EF\u30FC\u30C9\uFF1E\n".concat(words));
    }
});
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var imageFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isChatInputCommand())
                    return [2 /*return*/];
                if (!(interaction.commandName === 'niconico')) return [3 /*break*/, 2];
                return [4 /*yield*/, interaction.reply('https://www.nicovideo.jp/watch/sm41656368')];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!(interaction.commandName === 'rakutan')) return [3 /*break*/, 4];
                imageFile = new discord_js_1.AttachmentBuilder('./必修落単.jpg');
                return [4 /*yield*/, interaction.reply({
                        content: '必修落単！？',
                        files: [imageFile]
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
client.login(token);
