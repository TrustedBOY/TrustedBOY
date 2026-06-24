import React, { useState } from 'react';

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
    margin: '0 0 20px 0',
  },
  row: {
    display: 'flex',
    alignItems: 'baseline',
    lineHeight: '24px',
  },
  promptLabel: {
    color: '#00ff88',
    marginRight: '8px',
    marginTop: '10px',
  },
  textOutput: {
    color: '#ffffff',
    fontFamily: 'Courier New, Courier, monospace',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0px',
  },
  inputField: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontFamily: 'Courier New, Courier, monospace',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0px',
    outline: 'none',
    flexGrow: 1,
    padding: 0,
    margin: 0,
  },
};

const projects = [
  {
    id: 1,
    name: 'TumbleBird',
    desc: 'Physics-based arcade game.',
    url: 'https://github.com/amirsaebi/tumblebird',
  },
  {
    id: 2,
    name: 'Tanks Game',
    desc: '2D tank combat built with SFML.',
    url: 'https://github.com/amirsaebi/tanks',
  },
  {
    id: 3,
    name: 'Triangulation Program',
    desc: 'Geometry analysis tool.',
    url: '',
  },
];

const contactInformation = [
  {
    name: 'Linkedin',
    url: '',
  },
  {
    name: 'GitHub',
    url: '',
  },
  {
    name: 'Discord',
    url: '',
  },
  {
    name: 'Instagram',
    url: '',
  },
  {
    name: 'X (Twitter)',
    url: '',
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
        text: `${p.id}. ${p.name} - ${p.desc}`,
        type: p.url ? 'link' : 'output',
        rtl: p.url || null,
      }));
    },
  },

  contact: {
    description: 'Show my contact information',
    run(args) {
      return contactInformation.map((p) => ({
        text: `> ${p.name}`,
        type: p.url ? 'link' : 'output',
        rtl: p.url || null,
      }));
    },
  },
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key == 'Tab') {
      event.preventDefault();
    }

    if (event.key == 'Enter') {
      event.preventDefault();

      const trimmedInput = inputValue.trim();
      if (trimmedInput === '') return;

      // if the input is 'clear'
      if (trimmedInput.toLowerCase() === 'clear') {
        setHistory([]);
        setInputValue('');
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

      setHistory(newLines);
      setInputValue('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Amir's Shell Terminal</h1>

      {history.map((line, index) => (
        <div key={index} style={styles.row}>
          {/* 1. Only show the green prompt label if this specific line is a user command */}
          {line.type === 'prompt' && (
            <span style={styles.promptLabel}>
              {username}@{sysName}.me:~$
            </span>
          )}

          {/* 2. Render the text content, dynamically changing color based on type */}
          {line.type === 'link' ? (
            /* 🌟 If it's a link, render an anchor tag! */
            <a
              href={line.url}
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Security best-practice for opening tabs
              style={{
                ...styles.textOutput,
                color: '#4D4EFF', // Give links a distinct, clickable green glow!
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {line.text}
            </a>
          ) : (
            /* 🌟 Otherwise, keep rendering the normal plain text span */
            <span
              style={{
                ...styles.textOutput,
                color:
                  line.type === 'error'
                    ? '#ff4444'
                    : line.type === 'prompt'
                    ? '#ffffff'
                    : '#e0e0e0',
                whiteSpace: 'pre-wrap',
              }}
            >
              {line.type === 'prompt'
                ? line.text.replace(`${username}@${sysName}.me:~$ `, '')
                : line.text}
            </span>
          )}
        </div>
      ))}

      <div style={styles.row}>
        <span style={styles.promptLabel}>
          {username}@{sysName}.me:~$
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={styles.inputField}
          autoFocus
        />
      </div>

      <p
        style={{
          color: '#888',
          marginTop: '20px',
        }}
      >
        React State Tracking: "{inputValue}"
      </p>
    </div>
  );
}

export default App;
