const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('funcional')
        .setDescription('Criar painel de solicitação de funcional')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        // 🔥 MODAL
        const modal = new ModalBuilder()
            .setCustomId('modal_painel_funcional')
            .setTitle('Criar Painel Funcional');

        const titulo = new TextInputBuilder()
            .setCustomId('titulo')
            .setLabel('Título do painel')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const descricao = new TextInputBuilder()
            .setCustomId('descricao')
            .setLabel('Descrição do painel')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const imagem = new TextInputBuilder()
            .setCustomId('imagem')
            .setLabel('URL da imagem (banner)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const row1 = new ActionRowBuilder().addComponents(titulo);
        const row2 = new ActionRowBuilder().addComponents(descricao);
        const row3 = new ActionRowBuilder().addComponents(imagem);

        modal.addComponents(row1, row2, row3);

        await interaction.showModal(modal);
    }
};