const input = document.getElementById("input");
const output = document.getElementById("output");
const tabHelp = document.getElementById("tab-help");

const WHITE = "white";
const GREEN = "#00ff88";
const USERNAME = "amirsaebi@portfolio:~$ ";

const commands = {
    help: {
        description: "show commands",
        run(entry) {
            appendOutputLines(entry, buildHelpLines());
        }
    },
    about: {
        description: "about me",
        run(entry) {
            appendOutputLines(entry, [
                "Name: Amir",
                "Role: Computer Engineering Student",
                "Focus: Game Development",
                "Stack: Java, JavaScript, Unity (learning)"
            ]);
        }
    },
    projects: {
        description: "list of experiences",
        run(entry) {
            appendOutputLines(entry, [
                "1: TumbleBird | Unity (C#)",
                "2: Tanks Game | C++ & SFML",
                "3: Triangulation Program | Java"
            ]);
        }
    },
    skills: {
        description: "what i've learnt in the past few years",
        run(entry) {
            appendOutputLines(entry, [
                "Languages: Java, C#, C++, Python, HTML, JavaScript",
                "Frameworks & Engines: Unity ,SFML ,Java AWT/Swing",
                "Development tools: Git, Unity, Linux Environment"
            ])
        }
    },
    hi: {
        description: "",
        run(entry) {
            appendOutputLines(entry, [
                "Hello my friend"
            ]);
        }

    },
    clear: {
        description: "clear terminal",
        run() {
            output.innerHTML = "";
        }
    }
};

let history = [];
let historyIndex = -1;

printSystemMessage("Booting portfolio...");
setTimeout(() => printSystemMessage("Type 'help' to see commands\n\n"), 500);
renderTabHelp();

input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        e.preventDefault();
        toggleTabHelp();
        return;
    }

    if (e.key === "Escape") {
        hideTabHelp();
        return;
    }

    if (e.key === "Enter") {
        e.preventDefault();
        hideTabHelp();

        const cmd = input.value.trim();
        if (cmd !== "") {
            history.push(cmd);
            historyIndex = history.length;
            runCommand(cmd);
        }
        input.value = "";
    }
});

function runCommand(rawCmd) {
    const commandName = rawCmd.toLowerCase();
    const entry = createHistoryEntry(rawCmd);
    const command = commands[commandName];

    if (!command) {
        appendOutputLines(entry, ["Command not found. Type 'help'"]);
        return;
    }

    command.run(entry);
}

function buildHelpLines() {
    const lines = ["Available commands:"];
    Object.entries(commands).forEach(([name, command]) => {
        lines.push(`${name.padEnd(8, " ")} - ${command.description}`);
    });
    return lines;
}

function createHistoryEntry(command) {
    const entry = document.createElement("div");
    entry.className = "history-entry";

    const commandLine = document.createElement("div");
    commandLine.className = "history-command";

    const prompt = document.createElement("span");
    prompt.className = "username";
    prompt.style.color = GREEN;
    prompt.textContent = USERNAME;

    const commandText = document.createElement("span");
    commandText.style.color = WHITE;
    commandText.textContent = command;

    commandLine.append(prompt, commandText);
    entry.appendChild(commandLine);
    output.appendChild(entry);
    return entry;
}

function appendOutputLines(entry, lines) {
    lines.forEach((lineText) => {
        const line = document.createElement("div");
        line.className = "history-output";
        line.textContent = lineText;
        entry.appendChild(line);
    });
}

function printSystemMessage(text) {
    const line = document.createElement("div");
    line.style.color = WHITE;
    line.textContent = text;
    output.appendChild(line);
}

function renderTabHelp() {
    tabHelp.textContent = buildHelpLines().join("\n");
}

function toggleTabHelp() {
    tabHelp.hidden = !tabHelp.hidden;
}

function hideTabHelp() {
    tabHelp.hidden = true;
}