const fs = require('fs');

module.exports = {

    name: 'guildMemberAdd',

    async execute(member) {

        const filePath = './database/convites-controlados.json';

        if (!fs.existsSync(filePath)) return;

        const convites = JSON.parse(fs.readFileSync(filePath));

        const guildInvites = await member.guild.invites.fetch();

        for (const invite of guildInvites.values()) {

            const dbInvite = convites.find(c => c.code === invite.code);

            if (!dbInvite) continue;

            // Atualiza usos
            if (invite.uses > (dbInvite.usosAtuais || 0)) {

                dbInvite.usosAtuais = invite.uses;

                dbInvite.usuarios.push({
                    id: member.user.id,
                    tag: member.user.tag,
                    data: new Date()
                });
            }
        }

        fs.writeFileSync(
            filePath,
            JSON.stringify(convites, null, 2)
        );
    }
};