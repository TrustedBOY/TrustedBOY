let username = 'guest';
const sysName = 'trustedboy';

const styles = {
    container: {
        backgroundColor: '#121212',
        color: '#00ff88',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'monospace',
        textAlign: 'left',
    },
    header: {
        color: '#00ff88',
        fontSize: '52px',
        margin: '0 0 20px 0',
    },
    row: {
        display: 'flex',
        alignItems: 'baseline',
        lineHeight: '24px',
    },
    promptLabel: {
        color: '#00ff88',
        fontSize: '24px',
        marginRight: '8px',
        marginTop: '10px',
    },
    textOutput: {
        color: '#ffffff',
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '24px',
        lineHeight: '36px',
        letterSpacing: '0px',
    },
    inputField: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#ffffff',
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '24px',
        lineHeight: '24px',
        letterSpacing: '0px',
        outline: 'none',
        flexGrow: 1,
        padding: 0,
        margin: 0,
    },
    suggestionsField: {
        color: '#7A7A7A',
        paddingLeft: '200px', // Aligns the options roughly under where the text starts
        fontFamily: 'monospace',
        fontSize: '16px',
        marginTop: '4px',
    },
};

const projects = [
    {
        id: 1,
        name: 'TumbleBird',
        brief: 'Physics-based arcade game.',
        url: 'https://github.com/TrustedBOY/Tumble-Bird',
    },
    {
        id: 2,
        name: 'Tanks Game',
        brief: '2D tank combat built with SFML.',
        url: 'https://github.com/TrustedBOY/TankGame',
    },
    {
        id: 3,
        name: 'Triangulation Program',
        brief: 'Geometry analysis tool.',
        url: '',
    },
];

const contactInformation = [
    {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/amir-saebi-9ab119259',
    },
    {
        name: 'GitHub',
        url: 'https://github.com/TrustedBOY',
    },
    {
        name: 'Discord',
        url: 'https://discord.gg/SWzZbt4f88',
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com/trusteddev',
    },
    {
        name: 'X (Twitter)',
        url: '',
    },
    {
        name: 'Email',
        url: 'amirhoseinsaebi.83@gmail.com',
    },
];

const commands = {
    about: {
        description: 'About me details',
        run(args) {
            return [
                {
                    text: 'Name: Amir\nRole: Computer Engineering Student\nStack: Java, C#, C++, JS',
                    type: 'output',
                },
            ];
        },
    },

    projects: {
        description: 'List portfolio projects',
        run(args) {
            return projects.map((p) => ({
                text: `${p.id}. ${p.name} - ${p.brief}`,
                type: p.url ? 'link' : 'output',
                url: p.url || null,
            }));
        },
    },

    contact: {
        description: 'Show my contact information',
        run(args) {
            return contactInformation.map((p) => ({
                text: `> ${p.name}`,
                type: p.url ? 'link' : 'output',
                url: p.url || null,
            }));
        },
    },

    calc: {
        description:
            'Calculate simple math operations. Usage: calc [num1] [operator] [num2]',
        run(args) {
            if (args.length !== 3) {
                return [
                    {
                        text: 'Usage: calc [operator] [number1] [number2]\nExample: calc + 5 2',
                        type: 'error',
                    },
                ];
            }

            const num1 = parseFloat(args[0]);
            const num2 = parseFloat(args[1]);
            const operator = args[2];

            if (isNaN(num1) || isNaN(num2)) {
                return [
                    { text: ' Error: Please provide valid numbers', type: 'error' },
                ];
            }

            let result = 0;

            switch (operator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    if (num2 === 0)
                        return [
                            { text: 'Error: Division by ZERO is a crime.', type: 'error' },
                        ];
                    result = num1 / num2;
                    break;
                default:
                    return [
                        {
                            text: `Error: Unkonw operator '${operator}'. Use +, -, *, or/`,
                            type: 'error',
                        },
                    ];
            }

            return [{ text: `Result: ${result}`, type: 'output' }];
        },
    },
};

// ----- state (plain variables instead of useState, since there's no React here) -----
let inputValue = '';
let history = [];
let suggestions = [];

// grab the root element we'll render everything into
const root = document.getElementById('root');

function applyStyles(el, styleObj) {
    Object.assign(el.style, styleObj);
}

function handleInputChange(event) {
    inputValue = event.target.value;
    suggestions = [];
    render();
}

function handleKeyDown(event) {
    if (event.key == 'Tab') {
        event.preventDefault();
        suggestions = [];

        const trimmedInpout = inputValue.trim().toLowerCase();
        // if (trimmedInpout === '') {return;}

        const availableCommands = [...Object.keys(commands), 'clear'];
        const matches = availableCommands.filter((cmd) =>
            cmd.startsWith(trimmedInpout)
        );

        if (matches.length === 1) {
            inputValue = matches[0] + ' ';
            suggestions = [];
        } else if (matches.length > 1) {
            suggestions = matches;
        }
        render();
        return;
    }

    if (event.key == 'Enter') {
        event.preventDefault();
        suggestions = [];

        const trimmedInput = inputValue.trim();
        if (trimmedInput === '') return;

        // if the input is 'clear'
        if (trimmedInput.toLowerCase() === 'clear') {
            history = [];
            inputValue = '';
            render();
            return;
        }

        // Tokenize the input
        const tokens = trimmedInput.split(/\s+/);
        const commandName = tokens[0].toLowerCase();
        const args = tokens.length > 0 ? tokens.slice(1) : [];

        let newLines = [
            ...history,
            {
                text: `${username}@${sysName}.me:~$ ${trimmedInput}`,
                type: 'prompt',
            },
        ];

        const cmdModule = commands[commandName];

        if (cmdModule) {
            const outputs = cmdModule.run(args);
            newLines = [...newLines, ...outputs];
        } else {
            newLines.push({
                text: `command not found: '${commandName}'. Type 'help' for options.`,
                type: 'error',
            });
        }

        history = newLines;
        inputValue = '';
        render();
    }
}

// builds the whole page fresh every time state changes, same idea as a React re-render
function render() {
    root.innerHTML = '';

    const container = document.createElement('div');
    applyStyles(container, styles.container);

    const header = document.createElement('h1');
    applyStyles(header, styles.header);
    header.textContent = "Amir's Shell Terminal";
    container.appendChild(header);

    history.forEach((line, index) => {
        const row = document.createElement('div');
        applyStyles(row, styles.row);

        // 1. Only show the green prompt label if this specific line is a user command
        if (line.type === 'prompt') {
            const promptLabel = document.createElement('span');
            applyStyles(promptLabel, styles.promptLabel);
            promptLabel.textContent = `${username}@${sysName}.me:~$`;
            row.appendChild(promptLabel);
        }

        // 2. Render the text content, dynamically changing color based on type
        if (line.type === 'link') {
            // 🌟 If it's a link, render an anchor tag!
            const a = document.createElement('a');
            a.href = line.url;
            a.target = '_blank'; // Opens the link in a new tab
            a.rel = 'noopener noreferrer'; // Security best-practice for opening tabs
            applyStyles(a, {
                ...styles.textOutput,
                color: '#4D4EFF', // Give links a distinct, clickable green glow!
                textDecoration: 'underline',
                cursor: 'pointer',
            });
            a.textContent = line.text;
            row.appendChild(a);
        } else {
            // 🌟 Otherwise, keep rendering the normal plain text span
            const span = document.createElement('span');
            applyStyles(span, {
                ...styles.textOutput,
                color:
                    line.type === 'error'
                        ? '#ff4444'
                        : line.type === 'prompt'
                            ? '#ffffff'
                            : '#e0e0e0',
                whiteSpace: 'pre-wrap',
            });
            span.textContent =
                line.type === 'prompt'
                    ? line.text.replace(`${username}@${sysName}.me:~$ `, '')
                    : line.text;
            row.appendChild(span);
        }

        container.appendChild(row);
    });

    const inputRow = document.createElement('div');
    applyStyles(inputRow, styles.row);

    const promptLabel = document.createElement('span');
    applyStyles(promptLabel, styles.promptLabel);
    promptLabel.textContent = `${username}@${sysName}.me:~$`;
    inputRow.appendChild(promptLabel);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = inputValue;
    applyStyles(input, styles.inputField);
    input.addEventListener('input', handleInputChange);
    input.addEventListener('keydown', handleKeyDown);
    inputRow.appendChild(input);

    container.appendChild(inputRow);

    if (suggestions.length > 0) {
        const suggestionsRow = document.createElement('div');
        applyStyles(suggestionsRow, styles.suggestionsField);

        suggestions.forEach((match) => {
            const line = document.createElement('div'); // div instead of span → each one is its own line
            // applyStyles(line, { fontFamily: 'monospace'});
            line.textContent = match;
            suggestionsRow.appendChild(line);
        });

        container.appendChild(suggestionsRow);
    }

    //   const tracker = document.createElement('p');
    //   applyStyles(tracker, {
    //     color: '#888',
    //     marginTop: '20px',
    //   });
    //   tracker.textContent = `State Tracking: "${inputValue}"`;
    //   container.appendChild(tracker);

    root.appendChild(container);

    // keep focus on the input after every re-render, like autoFocus did in React
    const liveInput = root.querySelector('input');
    if (liveInput) {
        liveInput.focus();
        liveInput.selectionStart = liveInput.selectionEnd = liveInput.value.length;
    }
}

render();