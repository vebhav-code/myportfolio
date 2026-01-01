document.addEventListener('DOMContentLoaded', () => {
    const requestForm = document.getElementById('requestForm');
    const logBody = document.getElementById('logBody');
    const countTotal = document.getElementById('countTotal');
    const countBlocked = document.getElementById('countBlocked');

    let totalRequests = 0;
    let blockedRequests = 0;

    const detections = [
        {
            name: 'SQL Injection',
            patterns: [/SELECT/i, /UNION/i, /DROP/i, /SLEEP\(/i, /['"]\s*OR\s*['"]?\d+/i, /--/],
            severity: 'High'
        },
        {
            name: 'Cross-Site Scripting (XSS)',
            patterns: [/<script/i, /alert\(/i, /onerror=/i, /javascript:/i],
            severity: 'High'
        },
        {
            name: 'Directory Traversal',
            patterns: [/\.\.\//, /\/etc\/passwd/i, /C:\\Windows/i],
            severity: 'Critical'
        }
    ];

    const analyzeRequest = (payload) => {
        if (!payload) return { allowed: true };

        // Check for length
        if (payload.length > 256) {
            return { allowed: false, reason: 'Payload length exceeded (Max 256)', severity: 'Medium' };
        }

        // Check for patterns
        for (const detection of detections) {
            for (const pattern of detection.patterns) {
                if (pattern.test(payload)) {
                    return { allowed: false, reason: `Pattern match: ${detection.name}`, severity: detection.severity };
                }
            }
        }

        return { allowed: true };
    };

    const addLogEntry = (method, path, payload, result) => {
        const row = document.createElement('tr');
        row.className = 'log-row';

        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        const displayPayload = payload ? `${path}?${payload.substring(0, 30)}${payload.length > 30 ? '...' : ''}` : path;

        row.innerHTML = `
            <td>${timestamp}</td>
            <td style="font-weight: bold; color: var(--accent-blue)">${method}</td>
            <td title="${payload || path}">${displayPayload}</td>
            <td>
                <span class="status-badge ${result.allowed ? 'bg-allowed' : 'bg-blocked'}">
                    ${result.allowed ? 'Allowed' : 'Blocked'}
                </span>
            </td>
            <td class="${!result.allowed ? 'severity-high' : ''}">${result.reason || '-'}</td>
        `;

        // Insert at the top
        logBody.insertBefore(row, logBody.firstChild);

        // Update stats
        totalRequests++;
        document.getElementById('count-total').textContent = totalRequests;
        if (!result.allowed) {
            blockedRequests++;
            document.getElementById('count-blocked').textContent = blockedRequests;
        }
    };

    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const method = document.getElementById('method').value;
        const path = document.getElementById('path').value;
        const payload = document.getElementById('payload').value;

        const result = analyzeRequest(payload);
        addLogEntry(method, path, payload, result);

        // Reset payload field but keep method/path for quick testing
        document.getElementById('payload').value = '';
    });

    // Add initial welcome log
    setTimeout(() => {
        addLogEntry('SYSTEM', '/boot', '', { allowed: true, reason: 'SentinelShield v1.0.4 Online' });
    }, 500);
});
