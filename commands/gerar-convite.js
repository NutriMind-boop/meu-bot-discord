const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

const fs = require('fs');

function gerarCodigo() {
    return 'AUT-' + Math.floor(10000 + Math.random() * 90000);
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName('gerar-convite')
        .setDescription('Gerar convite controlado com código de autenticação')
        .addIntegerOption(option =>
            option
                .setName('usos')
                .setDescription('Quantidade máxima de usos')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('tempo')
                .setDescription('Validade em minutos')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('motivo')
                .setDescription('Motivo do convite')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const usos = interaction.options.getInteger('usos');
        const tempo = interaction.options.getInteger('tempo');
        const motivo = interaction.options.getString('motivo');

        // CRIA CONVITE
        const convite = await interaction.channel.createInvite({
            maxUses: usos,
            maxAge: tempo * 60,
            unique: true,
            reason: motivo
        });

        // 🔑 CÓDIGO
        const codigoAuth = gerarCodigo();

        // ⏳ EXPIRAÇÃO (AGORA + TEMPO DO CONVITE)
        const expiraEm = Date.now() + tempo * 60 * 1000;

        // BANCO
        const filePath = './database/codigos.json';

        const codigos =
            fs.existsSync(filePath)
                ? JSON.parse(fs.readFileSync(filePath))
                : [];

        codigos.push({
            codigo: codigoAuth,
            usado: false,
            criadoPor: interaction.user.id,
            origem: 'convite',
            expiraEm: expiraEm
        });

        fs.writeFileSync(filePath, JSON.stringify(codigos, null, 2));

        // EMBED
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('📨 Convite Controlado Gerado')
            .setThumbnail('https://cdn.discordapp.com/attachments/1502291744228769867/1512429829251792996/image-removebg-preview_1.png')
            .addFields(
                {
                    name: '🔗 Convite',
                    value: convite.url
                },
                {
                    name: '⏳ Validade',
                    value: `${tempo} minuto(s)`
                },
                {
                    name: '📊 Limite de usos',
                    value: `${usos}`
                },
                {
                    name: '🔐 Código de Autenticação',
                    value: `\`${codigoAuth}\``
                },
                {
                    name: '📌 Motivo',
                    value: motivo
                }
            )
            .setFooter({
                text: 'Sistema de Convites • RH/P1'
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};