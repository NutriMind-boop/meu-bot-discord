require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');

// =========================
// CLIENT
// =========================
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds
    ]
});

// =========================
// COMMANDS
// =========================
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    if (!command?.data) {
        console.log(`⚠️ Comando inválido ignorado: ${file}`);
        continue;
    }

    client.commands.set(command.data.name, command);
}

// =========================
// EVENTS
// =========================
const eventFiles = fs.readdirSync('./events')
    .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// =========================
// LOGIN (.env)
// =========================
if (!process.env.TOKEN) {
    console.log('❌ TOKEN não encontrado no .env');
    process.exit(1);
}

client.login(process.env.TOKEN);