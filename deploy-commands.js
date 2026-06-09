const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// =========================
// CONFIGURAÇÃO SEGURA (.env)
// =========================
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// =========================
// VALIDAÇÃO
// =========================
if (!TOKEN) {
    console.log('❌ TOKEN não encontrado no .env');
    process.exit(1);
}

if (!CLIENT_ID) {
    console.log('❌ CLIENT_ID não encontrado no .env');
    process.exit(1);
}

// =========================
// CARREGAR COMANDOS
// =========================
const commands = [];
const commandPath = './commands';

try {

    if (!fs.existsSync(commandPath)) {
        console.log('❌ Pasta commands não encontrada');
        process.exit(1);
    }

    const commandFiles = fs.readdirSync(commandPath)
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {

        try {
            const command = require(`${commandPath}/${file}`);

            if (!command?.data) {
                console.log(`⚠️ Comando inválido ignorado: ${file}`);
                continue;
            }

            commands.push(command.data.toJSON());

        } catch (err) {
            console.log(`❌ Erro ao carregar comando ${file}:`, err);
        }
    }

} catch (err) {
    console.log('❌ Erro ao ler pasta commands:', err);
}

// =========================
// DISCORD REST API
// =========================
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {

    try {

        console.log('🔄 Registrando comandos slash...');

        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log(`✅ ${data.length} comandos registrados com sucesso!`);

    } catch (error) {

        console.log('❌ Erro ao registrar comandos:', error);

    }

})();