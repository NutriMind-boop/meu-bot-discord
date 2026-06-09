const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painelboletim')
        .setDescription('Criar painel de boletim'),

    async execute(interaction) {

        const canalPainel = '1512508109262819368';

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('📄 PAINEL DE BOLETIM')
            .setDescription('Clique no botão abaixo para emitir um boletim interno.')
            .setFooter({ text: 'SSP • Sistema Policial' });

        const botao = new ButtonBuilder()
            .setCustomId('abrir_boletim')
            .setLabel('📄 Emitir Boletim')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(botao);

        const canal = interaction.guild.channels.cache.get(canalPainel);

        if (!canal) {
            return interaction.reply({
                content: '❌ Canal do painel não encontrado.',
                ephemeral: true
            });
        }

        await canal.send({
            embeds: [embed],
            components: [row]
        });

        return interaction.reply({
            content: '✅ Painel de boletim criado!',
            ephemeral: true
        });
    }
};