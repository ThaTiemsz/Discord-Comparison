$(document).ready(() => {
    const Constants = {
        Endpoint: (invite) => `https://discordapp.com/api/v6/invite/${invite}?with_counts=true`,
        Icon: (guild, hash) => `https://cdn.discordapp.com/icons/${guild}/${hash}.png`,
        Splash: (guild, hash) => `https://cdn.discordapp.com/splashes/${guild}/${hash}.png`,
        VerificationLevels: {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: '(╯°□°）╯︵ ┻━┻',
            4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'   
        },
        ClickImage: (url) => `<a href="${url}" target="_blank"><img src="${url}" /></a>`,
        Presets: {
            'Large Servers': ['R6XBpnr', 'ygopro-percy', 'overwatch'],
            'Star Wars': ['starwars', 'battlefront', 'BattlefrontTWO', 'MtgJhpg', '3qvBueZ']
        }
    };
    window.servers = [];

    addServer('discord-testers');

    $('#add-server').click(() => {
        const inviteCode = $('#invite-code').val();
        addServer(inviteCode);
    });

    $('#remove-last').click(() => {
        const last = window.servers.reverse()[0];
        console.log(last)
        window.servers.pop();
        $(`th[data-id="${last}"], td[data-id="${last}"]`).remove();
    });

    $('#remove-all').click(() => {
        window.servers = [];
        $(`th.server, td.server`).remove();
    });

    for (let preset in Constants.Presets) {
        $('#presets').append(`<button id="preset" class="ui button preset" data-preset="${preset}">${preset}</button>`);
    }

    $('button.preset').click(function() {
        $('#remove-all').click();
        for (let server of Constants.Presets[$(this).attr('data-preset')]) {
            addServer(server);
        }
    });

    function addServer(invite) {
        fetch(Constants.Endpoint(invite)).then(response => {
            if (response.status !== 200) return Promise.reject('Invalid invite code');
            return response.json();
        }).then(res => {
            console.log(res);
            window.servers.push(res.guild.id);
            addColumn(
                res.guild.id,
                res.guild.name,
                res.approximate_member_count,
                res.approximate_presence_count,
                res.guild.text_channel_count,
                res.guild.voice_channel_count,
                Constants.VerificationLevels[res.guild.verification_level],
                res.guild.icon ? Constants.ClickImage(Constants.Icon(res.guild.id, res.guild.icon)) : null,
                res.guild.features.join(", "),
                res.guild.splash ? Constants.ClickImage(Constants.Splash(res.guild.id, res.guild.splash)) : null
            );
        }).catch(err => {
            if (err) return alert(err);
            else return alert("An error has occured. Check the console for possibly more information.");
        })
    }

    function addColumn(id, header, ...data) {
        $('thead tr').append(`<th class="server" data-id="${id}">${header}</th>`);
        $('tbody tr').each((i, td) => {
            $(td).append(`<td class="server" data-id="${id}">${data[i] || data[i] === 0 ? data[i] : '-'}</td>`);
        });
    }
});