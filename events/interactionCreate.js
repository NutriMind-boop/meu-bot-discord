const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

console.log("🔵 interactionCreate carregado com sucesso");

// =========================
// CONFIG
// =========================
const cargoStaff = '1502362863149518898';
const canalAnalise = '1512440035805499392';
const canalPainelFuncional = '1512508109262819368';
const canalBoletim = '1502358463630807231';

// 🔥 CANAL DO ANÚNCIO (TEM QUE SER REAL)
const canalAnuncio = '123456789012345678';

// =========================
// PATENTES
// =========================
const patentes = {
    "Coronel": "[✵✵✵]",
    "Tenente-Coronel": "[✵✵✧]",
    "Major": "[✵✧✧]",
    "Capitão": "[✧✧✧]",
    "1 Tenente": "[✧✧]",
    "2 Tenente": "[✧] ",
    "Aspirante": "[⛥] ",
     "Subtenente": "[△] ",
      "1 Sargento": "[❯❯ ❯❯❯] ",
      "2 Sargento": "[❯ ❯❯❯]  ",
      "3 Sargento": "[❯❯❯]  ",
      "cabo": "[❯❯]  ",
       "Soldado": "[❯]"
};

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        try {

            console.log("INTERAÇÃO:", interaction.type, interaction.customId || interaction.commandName);

            // =========================
            // SLASH COMMANDS
            // =========================
            if (interaction.isChatInputCommand()) {

                const cmd = interaction.commandName;

                if (cmd === 'funcional') {

                    const modal = new ModalBuilder()
                        .setCustomId('modal_painel_funcional')
                        .setTitle('Criar Painel Funcional');

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('titulo')
                                .setLabel('Título')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('descricao')
                                .setLabel('Descrição')
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('imagem')
                                .setLabel('Imagem (opcional)')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(false)
                        )
                    );

                    return interaction.showModal(modal);
                }

                const command = client.commands.get(cmd);
                if (!command) return;
                return command.execute(interaction);
            }

            // =========================
            // BOTÕES
            // =========================
            if (interaction.isButton()) {

                if (interaction.customId === 'solicitar_funcional') {

                    const modal = new ModalBuilder()
                        .setCustomId('modal_funcional')
                        .setTitle('Solicitação de Funcional');

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder().setCustomId('nome').setLabel('Nome').setStyle(TextInputStyle.Short).setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder().setCustomId('re').setLabel('RE').setStyle(TextInputStyle.Short).setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder().setCustomId('patente').setLabel('Patente').setStyle(TextInputStyle.Short).setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder().setCustomId('codigo').setLabel('Código').setStyle(TextInputStyle.Short).setRequired(true)
                        )
                    );

                    return interaction.showModal(modal);
                }

                if (interaction.customId.startsWith('aprovar_')) {

                    if (!interaction.member.roles.cache.has(cargoStaff)) {
                        return interaction.reply({ content: '❌ Sem permissão.', ephemeral: true });
                    }

                    const userId = interaction.customId.split('_')[1];
                    const membro = await interaction.guild.members.fetch(userId);

                    const embed = interaction.message.embeds[0];

                    const nome = embed.fields.find(f => f.name === 'Nome')?.value || 'N/A';
                    const re = embed.fields.find(f => f.name === 'RE')?.value || 'N/A';
                    const patente = embed.fields.find(f => f.name === 'Patente')?.value || 'Soldado';

                    const simbolo = patentes[patente] || "[❯]";
                    const novoNick = `${simbolo} ${nome} | ${re}`;

                    try {
                        await membro.setNickname(novoNick);
                    } catch (err) {
                        console.log("Erro nickname:", err);
                    }

                    const newEmbed = EmbedBuilder.from(embed)
                        .setColor('#00ff00')
                        .addFields({
                            name: 'Status',
                            value: `✅ APROVADA\nPor: <@${interaction.user.id}>`
                        });

                    await interaction.message.edit({
                        embeds: [newEmbed],
                        components: []
                    });

                    return interaction.reply({ content: '✔ Aprovado.', ephemeral: true });
                }

                if (interaction.customId.startsWith('negar_')) {

                    const embed = EmbedBuilder.from(interaction.message.embeds[0])
                        .setColor('#ff0000')
                        .addFields({
                            name: 'Status',
                            value: `❌ NEGADA\nPor: <@${interaction.user.id}>`
                        });

                    await interaction.message.edit({
                        embeds: [embed],
                        components: []
                    });

                    return interaction.reply({ content: '❌ Negado.', ephemeral: true });
                }

                if (interaction.customId === 'abrir_boletim') {

                    const modal = new ModalBuilder()
                        .setCustomId('modal_boletim')
                        .setTitle('Boletim Interno');

                    const partes = ['1º PARTE', '2º PARTE', '3º PARTE', '4º PARTE'];

                    modal.addComponents(
                        ...partes.map((p, i) =>
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`parte${i + 1}`)
                                    .setLabel(p)
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setRequired(true)
                            )
                        )
                    );

                    return interaction.showModal(modal);
                }
            }

            // =========================
            // MODAIS
            // =========================
            if (interaction.isModalSubmit()) {

                // =========================
                // 🔥 ANÚNCIO (CORRIGIDO E SEGURO)
                // =========================
                if (interaction.customId === 'modalAnuncio') {

    try {

        const titulo = interaction.fields.getTextInputValue('titulo');
        const descricao = interaction.fields.getTextInputValue('descricao');
        const imagem = interaction.fields.getTextInputValue('imagem');
        const link = interaction.fields.getTextInputValue('link');

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(titulo)
            .setDescription(descricao)
            .setImage(imagem || null);

        const components = [];

        if (link) {
            components.push(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Abrir Link')
                        .setStyle(ButtonStyle.Link)
                        .setURL(link)
                )
            );
        }

        // 🔥 AQUI É A MUDANÇA PRINCIPAL
        await interaction.channel.send({
            embeds: [embed],
            components
        });

        return interaction.reply({
            content: '✅ Anúncio enviado com sucesso!',
            ephemeral: true
        });

    } catch (err) {
        console.log("❌ ERRO ANÚNCIO:", err);

        return interaction.reply({
            content: '❌ Erro ao enviar anúncio.',
            ephemeral: true
        });
    }
}

                // =========================
                // FUNCIONAL (NÃO MEXIDO)
                // =========================
                if (interaction.customId === 'modal_funcional') {

                    const nome = interaction.fields.getTextInputValue('nome');
                    const re = interaction.fields.getTextInputValue('re');
                    const patente = interaction.fields.getTextInputValue('patente');
                    const codigo = interaction.fields.getTextInputValue('codigo');

                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Solicitação Funcional')
                        .addFields(
                            { name: 'Nome', value: nome },
                            { name: 'RE', value: re },
                            { name: 'Patente', value: patente },
                            { name: 'Código', value: codigo }
                        );

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`aprovar_${interaction.user.id}`)
                            .setLabel('Aprovar')
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId(`negar_${interaction.user.id}`)
                            .setLabel('Negar')
                            .setStyle(ButtonStyle.Danger)
                    );

                    const canal = await interaction.guild.channels.fetch(canalAnalise);

                    await canal.send({ embeds: [embed], components: [row] });

                    return interaction.reply({ content: 'Enviado!', ephemeral: true });
                }

                // =========================
                // BOLETIM (NÃO MEXIDO)
                // =========================
                if (interaction.customId === 'modal_boletim') {

                    const parte1 = interaction.fields.getTextInputValue('parte1');
                    const parte2 = interaction.fields.getTextInputValue('parte2');
                    const parte3 = interaction.fields.getTextInputValue('parte3');
                    const parte4 = interaction.fields.getTextInputValue('parte4');

                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('📄 BOLETIM INTERNO')
                        .setDescription(
                            `📁 1º PARTE:\n${parte1}\n\n` +
                            `📁 2º PARTE:\n${parte2}\n\n` +
                            `📁 3º PARTE:\n${parte3}\n\n` +
                            `📁 4º PARTE:\n${parte4}`
                        )
                        .setTimestamp();

                    const canal = await interaction.guild.channels.fetch(canalBoletim);

                    await canal.send({
                        content: `<@&1502365549106298890>`,
                        embeds: [embed]
                    });

                    return interaction.reply({
                        content: 'Boletim enviado!',
                        ephemeral: true
                    });
                }
            }

        } catch (err) {
            console.log("❌ ERRO GERAL:", err);
        }
    }
};