const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boletim')
        .setDescription('Emitir boletim interno'),

    async execute(interaction) {

        const {
            ModalBuilder,
            TextInputBuilder,
            TextInputStyle,
            ActionRowBuilder
        } = require('discord.js');

        const modal = new ModalBuilder()
            .setCustomId('modal_boletim')
            .setTitle('📄 Boletim Interno');

        const parte1 = new TextInputBuilder()
            .setCustomId('parte1')
            .setLabel('1º PARTE - SERVIÇOS DIÁRIOS')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const parte2 = new TextInputBuilder()
            .setCustomId('parte2')
            .setLabel('2º PARTE - INSTRUÇÃO E OPERAÇÕES')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const parte3 = new TextInputBuilder()
            .setCustomId('parte3')
            .setLabel('3º PARTE - ASSUNTOS GERAIS')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const parte4 = new TextInputBuilder()
            .setCustomId('parte4')
            .setLabel('4º PARTE - JUSTIÇA E DISCIPLINA')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(parte1),
            new ActionRowBuilder().addComponents(parte2),
            new ActionRowBuilder().addComponents(parte3),
            new ActionRowBuilder().addComponents(parte4)
        );

        return interaction.showModal(modal);
    }
};