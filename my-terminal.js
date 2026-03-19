const font = 'Doom';

figlet.defaults({ fontPath: 'https://cdn.jsdelivr.net/npm/figlet/fonts' });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

const directories = {
    facts: [
        '',
        '[[;white;]Shark Facts]',
        '* Sharks have existed for over [[;yellow;]450 million years] — older than trees!',
        '* They have [[;yellow;]multiple rows of teeth] and can regrow lost ones throughout life.',
        '* Sharks don\'t have bones — their skeleton is made of [[;yellow;]cartilage].',
        '* Some sharks must swim constantly to breathe — called [[;yellow;]obligate ram ventilation].',
        '* The [[;yellow;]Whale Shark] is the largest fish on Earth, reaching up to 40 feet.',
        '',
    ],

    species: [
        '',
        '[[;white;]Notable Shark Species]',
        [
            ['Great White Shark',  'https://en.wikipedia.org/wiki/Great_white_shark',   'Apex predator, can detect blood from miles away'],
            ['Hammerhead Shark',   'https://en.wikipedia.org/wiki/Hammerhead_shark',    'Unique head shape gives 360-degree vision'],
            ['Whale Shark',        'https://en.wikipedia.org/wiki/Whale_shark',         'Largest fish in the ocean, filter feeder'],
            ['Goblin Shark',       'https://en.wikipedia.org/wiki/Goblin_shark',        'Deep-sea species with a protrusible jaw'],
            ['Bull Shark',         'https://en.wikipedia.org/wiki/Bull_shark',          'Can survive in both saltwater and freshwater'],
            ['Tiger Shark',        'https://en.wikipedia.org/wiki/Tiger_shark',         'Second most dangerous shark, eats almost anything'],
            ['Mako Shark',         'https://en.wikipedia.org/wiki/Shortfin_mako_shark', 'Fastest shark, can reach speeds of 45 mph'],
            ['Nurse Shark',        'https://en.wikipedia.org/wiki/Nurse_shark',         'Slow, bottom-dwelling shark, mostly harmless'],
            ['Blue Shark',         'https://en.wikipedia.org/wiki/Blue_shark',          'Slender oceanic shark known for long migrations'],
            ['Thresher Shark',     'https://en.wikipedia.org/wiki/Thresher_shark',      'Uses its long tail fin to stun prey'],
            ['Zebra Shark',        'https://en.wikipedia.org/wiki/Zebra_shark',         'Distinctive striped juvenile pattern, reef dweller'],
            ['Lemon Shark',        'https://en.wikipedia.org/wiki/Lemon_shark',         'Yellowish skin for camouflage in sandy shallows'],
            ['Frilled Shark',      'https://en.wikipedia.org/wiki/Frilled_shark',       'Ancient-looking deep-sea shark with eel-like body'],
        ].map(([name, url, description]) =>
            `* <a href="${url}">${name}</a> — [[;white;]${description}]`
        ),
        '',
    ].flat(),

    anatomy: [
        '',
        '[[;white;]Senses]',
        [
            'Electroreception (Ampullae of Lorenzini)',
            'Lateral line (detects water pressure)',
            'Keen sense of smell',
            'Sharp eyesight including low-light vision',
        ].map(s => `* [[;yellow;]${s}]`),
        '',
        '[[;white;]Physical Features]',
        [
            'Cartilaginous skeleton',
            'Dermal denticles (tooth-like scales)',
            'Multiple eyelid types including nictitating membrane',
            'Heterocercal tail fin',
        ].map(s => `* [[;#44D544;]${s}]`),
        '',
        '[[;white;]Hunting Adaptations]',
        [
            'Counter-shading camouflage',
            'Serrated, replaceable teeth',
            'High-speed burst swimming',
        ].map(s => `* [[;#5599ff;]${s}]`),
        '',
    ].flat(),
};

const dirs = Object.keys(directories);
const root = '~';
let cwd = root;

const user = 'gg';
const server = 'sharks';
const files = ['credits', 'record'];

function prompt() {
    return `[[;#44D544;]${user}@${server}][[;white;]:][[;#5599ff;]${cwd}][[;white;]$] `;
}

function print_home() {
    term.echo(dirs.map(dir => `[[;#5599ff;;directory]${dir}]`).join('\n'));
    term.echo(files.map(file => `[[;#44D544;;command]${file}]`).join('\n'));
}

const commands = {
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                print_home();
            } else if (dir.startsWith('~/')) {
                const parts = dir.substring(2).split('/');
                if (parts.length > 1) {
                    this.error('Invalid directory');
                } else {
                    this.echo(directories[parts[0]].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_home();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
            print_home();
        } else {
            this.echo(directories[cwd.substring(2)].join('\n'));
        }
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dir.startsWith('../') && cwd !== root && dirs.includes(dir.substring(3))) {
            cwd = root + '/' + dir.substring(3);
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    credits() {
        return [
            '',
            '[[;white;]Used libraries:]',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '',
        ].join('\n');
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    },
    record(arg) {
        if (arg === 'start') {
            term.history_state(true);
        } else if (arg === 'stop') {
            term.history_state(false);
        } else {
            term.echo('Usage: record [start|stop]');
        }
    },
};

const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => `[[;white;;command]${cmd}]`);
const help = formatter.format(formatted_list);

const re = new RegExp(`^(${command_list.join('|')})(\\s.*)?$`);
$.terminal.new_formatter([re, (_, cmd, args = '') =>
    `[[;white;;command]${cmd}][[;aquamarine;]${args}]`
]);

const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion(string) {
        const { name, rest } = $.terminal.parse_command(this.get_command());
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) return dirs.map(dir => `~/${dir}`);
            if (rest.startsWith('../') && cwd !== root) return dirs.map(dir => `../${dir}`);
            if (cwd === root) return dirs;
        }
        return Object.keys(commands);
    },
    prompt,
});

term.pause();
history.replaceState(null, null, ' ');

term.on('click', '.command', function() {
    term.exec($(this).text(), { typing: true, delay: 50 });
});

term.on('click', '.directory', function() {
    term.exec(`cd ~/${$(this).text()}`, { typing: true, delay: 50 });
});

function ready() {
    const seed = rand(256);
    term.echo(() => rainbow(render('Shark'), seed))
        .echo('[[;white;]Welcome to Shark Terminal]\n')
        .resume();
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true,
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue]
        .map(n => n.toString(16).padStart(2, '0'))
        .join('');
}
