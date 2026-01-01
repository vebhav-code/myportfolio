document.addEventListener('DOMContentLoaded', () => {
    const payloadInput = document.getElementById('payloadInput');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const terminalOutput = document.getElementById('terminalOutput');

    const addLog = (message, type = 'info') => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        let typeClass = 'status-info';
        if (type === 'success') typeClass = 'status-success';
        if (type === 'error') typeClass = 'status-error';

        entry.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="prompt">➜</span>
            <span class="${typeClass}">${message}</span>
        `;
        terminalOutput.appendChild(entry);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const encodePayload = (str) => {
        // Step 1: Reverse
        const reversed = str.split('').reverse().join('');
        // Step 2: Base64
        const b64 = btoa(reversed);
        return b64;
    };

    const decodePayload = (str) => {
        try {
            // Step 1: Base64 Decode
            const decodedB64 = atob(str);
            // Step 2: Reverse
            const original = decodedB64.split('').reverse().join('');
            return original;
        } catch (e) {
            throw new Error("Invalid Base64 input");
        }
    };

    encodeBtn.addEventListener('click', () => {
        const input = payloadInput.value.trim();
        if (!input) {
            addLog("Error: Input is empty.", 'error');
            return;
        }

        addLog(`Analyzing payload: "${input.substring(0, 20)}${input.length > 20 ? '...' : ''}"`);
        
        setTimeout(() => {
            addLog("Executing multi-layer obfuscation...", 'info');
            
            setTimeout(() => {
                const reversed = input.split('').reverse().join('');
                addLog(`Layer 1 (String Reversal): ${reversed}`);
                
                setTimeout(() => {
                    const result = btoa(reversed);
                    addLog(`Layer 2 (Base64 Encoding): ${result}`);
                    
                    setTimeout(() => {
                        payloadInput.value = result;
                        addLog("Obfuscation complete. Result moved to input buffer.", 'success');
                    }, 400);
                }, 400);
            }, 400);
        }, 300);
    });

    decodeBtn.addEventListener('click', () => {
        const input = payloadInput.value.trim();
        if (!input) {
            addLog("Error: Input is empty.", 'error');
            return;
        }

        addLog("Attempting defensive analysis / decoding...");

        setTimeout(() => {
            try {
                const decodedB64 = atob(input);
                addLog(`Layer 1 (Base64 Decoding): ${decodedB64}`);
                
                setTimeout(() => {
                    const original = decodedB64.split('').reverse().join('');
                    addLog(`Layer 2 (Reversal Recovery): ${original}`);
                    
                    setTimeout(() => {
                        payloadInput.value = original;
                        addLog("De-obfuscation successful. Payload recovered.", 'success');
                    }, 400);
                }, 400);
            } catch (e) {
                addLog("Error: Decoding failed. String is not valid Base64.", 'error');
            }
        }, 500);
    });

    clearBtn.addEventListener('click', () => {
        payloadInput.value = '';
        terminalOutput.innerHTML = '';
        addLog("Workspace cleared. Framework reset.", 'info');
    });
});
