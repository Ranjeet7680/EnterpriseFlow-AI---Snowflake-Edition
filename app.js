// EnterpriseFlow AI - Core Application Script

// ==========================================
// 1. STATE & DATABASES
// ==========================================
let activeTab = 'welcome';
let isVoiceActive = false;
let voiceAnimationId = null;

// Nodes Database
let nodes = [
    { id: 1, name: 'Trigger Event', type: 'trigger', subtype: 'Webhook', x: 100, y: 180, params: { url: 'https://api.enterpriseflow.ai/v1/trigger', method: 'POST' } },
    { id: 2, name: 'Read Snowflake', type: 'action', subtype: 'Snowflake Query', x: 350, y: 180, params: { query: 'SELECT * FROM LEADS WHERE CONFIDENCE > 0.8;', warehouse: 'COMPUTE_WH' } },
    { id: 3, name: 'Data Analyzer', type: 'action', subtype: 'Telemetry', x: 600, y: 180, params: { mode: 'Standard Telemetry', threshold: '0.85' } },
    { id: 4, name: 'AI Reasoner', type: 'logic', subtype: 'Cortex Analyst', x: 850, y: 155, params: { prompt: 'Verify leads qualification and flag anomalous records.', engine: 'cortex-analyst' } },
    { id: 5, name: 'Decision Path', type: 'logic', subtype: 'Filter Route', x: 1100, y: 180, params: { condition: 'AI_CONFIDENCE > 0.9' } },
    { id: 6, name: 'Human Approval', type: 'action', subtype: 'Human Gate', x: 1350, y: 180, params: { approver: 'finance-lead@company.com', timeout: '24h' } },
    { id: 7, name: 'Slack Notify', type: 'notification', subtype: 'Slack webhook', x: 1600, y: 180, params: { channel: '#sales-alerts', template: 'New lead approved: {{LEAD_NAME}}' } },
    { id: 8, name: 'End pipeline', type: 'action', subtype: 'Termination', x: 1850, y: 188, params: {} }
];

// Linear flow connections: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8
let connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 8 }
];

// Mock Databases for SQL Runner
const mockDatabase = {
    'LEADS': [
        { ID: 101, NAME: 'Acme Corp', VALUE: '$45,000', LEAD_CONFIDENCE: 0.95, STATUS: 'Qualified' },
        { ID: 102, NAME: 'Nebula Labs', VALUE: '$12,000', LEAD_CONFIDENCE: 0.88, STATUS: 'Reviewing' },
        { ID: 103, NAME: 'Globex Inc', VALUE: '$85,000', LEAD_CONFIDENCE: 0.97, STATUS: 'Qualified' },
        { ID: 104, NAME: 'Initech', VALUE: '$5,000', LEAD_CONFIDENCE: 0.42, STATUS: 'Disqualified' },
        { ID: 105, NAME: 'Soylent Green', VALUE: '$28,000', LEAD_CONFIDENCE: 0.91, STATUS: 'Qualified' }
    ],
    'SESSIONS': [
        { SESSION_ID: 'sess_982', USER_ID: 'usr_41', IP_COUNTRY: 'US', CLIENT: 'Firefox/Linux', DURATION_SEC: 420 },
        { SESSION_ID: 'sess_983', USER_ID: 'usr_87', IP_COUNTRY: 'UK', CLIENT: 'Chrome/macOS', DURATION_SEC: 154 },
        { SESSION_ID: 'sess_984', USER_ID: 'usr_12', IP_COUNTRY: 'DE', CLIENT: 'Safari/iOS', DURATION_SEC: 890 }
    ],
    'SIGNUPS': [
        { DATE: '2026-07-04', PLAN: 'Enterprise', QUANTITY: 3, REVENUE: 14500 },
        { DATE: '2026-07-05', PLAN: 'Pro', QUANTITY: 12, REVENUE: 2400 },
        { DATE: '2026-07-05', PLAN: 'Enterprise', QUANTITY: 1, REVENUE: 5000 }
    ],
    'INVENTORY': [
        { PRODUCT_ID: 'PRD-101', NAME: 'Wireless Headphones X1', STOCK: 14, SAFETY_THRESHOLD: 50, RISK: 'CRITICAL' },
        { PRODUCT_ID: 'PRD-102', NAME: 'USB-C Fast Charger', STOCK: 240, SAFETY_THRESHOLD: 100, RISK: 'LOW' },
        { PRODUCT_ID: 'PRD-103', NAME: 'Mechanical Keyboard RGB', STOCK: 85, SAFETY_THRESHOLD: 30, RISK: 'LOW' },
        { PRODUCT_ID: 'PRD-104', NAME: 'Ergonomic Standing Desk', STOCK: 8, SAFETY_THRESHOLD: 15, RISK: 'MEDIUM' }
    ],
    'PURCHASE_ORDERS': [
        { PO_ID: 'PO-991', SUPPLIER: 'Alternate Supplier B', ITEMS: 500, TOTAL_COST: '$12,40,000', STATUS: 'APPROVED' },
        { PO_ID: 'PO-989', SUPPLIER: 'Global Logistics Corp', ITEMS: 120, TOTAL_COST: '$3,10,000', STATUS: 'COMPLETED' },
        { PO_ID: 'PO-985', SUPPLIER: 'TechParts Direct', ITEMS: 250, TOTAL_COST: '$5,80,000', STATUS: 'COMPLETED' }
    ],
    'AUDIT_LOGS': [
        { TIMESTAMP: '10:42:15', AGENT: 'Supervisor Agent', ACTION: 'Emergency Reorder Workflow', STATUS: 'PASS', SIGNATURE: 'SECURE_SIGN: ADM-991' },
        { TIMESTAMP: '09:15:02', AGENT: 'Cortex Analyst', ACTION: 'Query Search Optimization', STATUS: 'PASS', SIGNATURE: 'SECURE_SIGN: SYS-042' },
        { TIMESTAMP: '08:30:44', AGENT: 'Data Ingestion Node', ACTION: 'Inventory Stock Safety Sync', STATUS: 'PASS', SIGNATURE: 'SECURE_SIGN: DAT-119' }
    ]
};


// ==========================================
// 2. SPLASH SCREEN LOADING REDIRECT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initSplashBackground();
    initAtmosphericParticles();
    runProgressLoader();
    initOnboardingBackground();
    initDraggableNodes();
    drawConnections();
    initLiveLogSimulator();
    refreshDashboard();
    initReferralSystem();
    // Listen for SQL execute keyboard shortcut (Ctrl + Enter)
    document.getElementById('sqlConsoleInput')?.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            executeSQLQuery();
        }
    });

    // Make workflow block panel source blocks double-clickable
    document.querySelectorAll('.draggable-block-source').forEach(block => {
        block.addEventListener('dblclick', () => {
            const type = block.getAttribute('data-type');
            createNewNode(type);
        });
    });
});

// composes compilation messages
const loadingSteps = [
    { percent: 15, label: 'Initializing Snowflake Connectors...', sub: 'SYSTEM_NODE: LOADING CREDENTIAL BUFFERS' },
    { percent: 35, label: 'Connecting to COMPUTE_WH Warehouse...', sub: 'SYSTEM_NODE: HANDSHAKING WAREHOUSE PUBLIC' },
    { percent: 55, label: 'Compiling Cortex AI Reasoning layers...', sub: 'SYSTEM_NODE: INITIALIZING LLM CORTEX WEIGHTS' },
    { percent: 75, label: 'Configuring Slack webhooks & alerts...', sub: 'SYSTEM_NODE: PREPARED NOTIFICATION STACKS' },
    { percent: 90, label: 'Autoscaling active schemas...', sub: 'SYSTEM_NODE: DATABASE READ-ONLY SYNC COMPLETE' },
    { percent: 100, label: 'All Operations Live. Redirecting...', sub: 'SYSTEM_NODE: BOOTUP SUCCESSFUL' }
];

function runProgressLoader() {
    let currentPercent = 0;
    const progressInterval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 5) + 3;
        if (currentPercent > 100) currentPercent = 100;
        
        // Find matching log step
        const step = loadingSteps.find(s => currentPercent <= s.percent) || loadingSteps[loadingSteps.length - 1];
        
        // Update DOM
        const label = document.getElementById('splashLoaderLabel');
        const percentText = document.getElementById('splashLoaderPercent');
        const bar = document.getElementById('splashProgressBar');
        const sub = document.getElementById('splashSubCopy');
        
        if (label) label.innerText = step.label;
        if (percentText) percentText.innerText = `${currentPercent}%`;
        if (bar) bar.style.width = `${currentPercent}%`;
        if (sub) sub.innerText = step.sub;
        
        if (currentPercent >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                const splash = document.getElementById('splashScreen');
                const app = document.getElementById('appShell');
                
                if (splash) {
                    splash.classList.add('opacity-0');
                    setTimeout(() => {
                        splash.style.display = 'none';
                        const welcome = document.getElementById('welcomeScreen');
                        if (welcome) {
                            welcome.classList.remove('hidden-view');
                            setTimeout(() => {
                                welcome.classList.add('opacity-100');
                            }, 50);
                        }
                    }, 1000);
                }
            }, 800);
        }
    }, 150);
}

// WebGL Background compilation code
function initSplashBackground() {
    const canvas = document.getElementById('shader-canvas-ANIMATION_2');
    if (!canvas) return;

    function syncSize() {
        const w = canvas.clientWidth || 1280;
        const h = canvas.clientHeight || 720;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
    }
    
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    
    const vsSrc = `
        attribute vec2 a_position;
        varying vec2 v_texCoord;
        void main() {
            v_texCoord = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;
    
    const fsSrc = `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        varying vec2 v_texCoord;

        void main() {
            vec2 uv = v_texCoord;
            vec2 center = vec2(0.5, 0.5);
            
            vec3 color1 = vec3(0.03, 0.07, 0.12); // Background #08111F
            vec3 color2 = vec3(0.0, 0.9, 0.76);   // Primary #00E5C3
            vec3 color3 = vec3(0.18, 0.5, 0.98);  // Secondary #2D7FF9
            
            float noise = sin(uv.x * 10.0 + u_time) * cos(uv.y * 10.0 + u_time) * 0.5 + 0.5;
            float dist = distance(uv, center + vec2(sin(u_time * 0.5) * 0.2, cos(u_time * 0.3) * 0.2));
            
            vec3 finalColor = mix(color1, color2, clamp(0.1 / dist * noise, 0.0, 1.0) * 0.3);
            finalColor = mix(finalColor, color3, clamp(0.05 / distance(uv, vec2(0.8, 0.2)), 0.0, 1.0) * 0.2);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    function compileShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }
    
    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width && rect.height) {
            const nx = (event.clientX - rect.left) / rect.width;
            const ny = 1.0 - (event.clientY - rect.top) / rect.height;
            mouse.x = nx * canvas.width;
            mouse.y = ny * canvas.height;
        }
    });

    function render(t) {
        if (typeof ResizeObserver === 'undefined') syncSize();
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (uTime) gl.uniform1f(uTime, t * 0.001);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }
    render(0);
}

// Particle Floating FX
function initAtmosphericParticles() {
    const canvas = document.getElementById('atmosphereCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.life = Math.random() * 100;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(112, 255, 224, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = Array.from({ length: 40 }, () => new Particle());
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
}

// ==========================================
// 2B. FIRST-TIME ONBOARDING WIZARD LOGIC
// ==========================================
let currentOnboardingStep = 1;
let isSnowflakeConnected = false;

function nextOnboardingStep() {
    if (currentOnboardingStep === 3 && !isSnowflakeConnected) {
        const icon = document.getElementById('testConnIcon');
        const label = document.getElementById('testConnLabel');
        const successMsg = document.getElementById('testConnSuccess');
        
        if (icon) icon.classList.add('animate-spin');
        if (label) label.innerText = "Connecting...";
        
        setTimeout(() => {
            if (icon) {
                icon.classList.remove('animate-spin');
                icon.innerText = "cloud_done";
            }
            if (label) label.innerText = "Connected";
            if (successMsg) successMsg.classList.remove('hidden');
            isSnowflakeConnected = true;
            
            nextOnboardingStep();
        }, 1000);
        return;
    }
    
    // Step transition
    const currentCard = document.getElementById(`onboardingStep-${currentOnboardingStep}`);
    if (currentCard) currentCard.classList.add('hidden');
    
    currentOnboardingStep++;
    
    const nextCard = document.getElementById(`onboardingStep-${currentOnboardingStep}`);
    if (nextCard) {
        nextCard.classList.remove('hidden');
        nextCard.classList.remove('step-slide-anim');
        void nextCard.offsetWidth;
        nextCard.classList.add('step-slide-anim');
    }
    
    // Update step count badge
    const badge = document.getElementById('onboardingStepBadge');
    if (badge) badge.innerText = `Step ${currentOnboardingStep} of 6`;
    
    // Button controls
    const prevBtn = document.getElementById('obPrevBtn');
    if (prevBtn) {
        prevBtn.disabled = false;
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    const nextBtn = document.getElementById('obNextBtn');
    
    // Specific step loaders
    if (currentOnboardingStep === 4) {
        runAutomaticSchemaDiscovery();
    }
    
    if (currentOnboardingStep === 6) {
        if (nextBtn) nextBtn.innerText = "Launch Workspace";
    }
    
    if (currentOnboardingStep > 6) {
        // Complete onboarding wizard
        const wizard = document.getElementById('onboardingWizard');
        const app = document.getElementById('appShell');
        if (wizard) wizard.classList.add('opacity-0');
        setTimeout(() => {
            if (wizard) wizard.style.display = 'none';
            if (app) {
                app.classList.remove('hidden-view');
                setTimeout(() => {
                    app.classList.add('opacity-100');
                    if (preloadedTemplateName) {
                        applyPreloadedTemplate();
                    } else {
                        switchTab('dashboard'); // Redirect to dashboard
                    }
                }, 50);
            }
        }, 500);
    }
}

function prevOnboardingStep() {
    if (currentOnboardingStep <= 1) return;
    
    const currentCard = document.getElementById(`onboardingStep-${currentOnboardingStep}`);
    if (currentCard) currentCard.classList.add('hidden');
    
    currentOnboardingStep--;
    
    const prevCard = document.getElementById(`onboardingStep-${currentOnboardingStep}`);
    if (prevCard) {
        prevCard.classList.remove('hidden');
        prevCard.classList.remove('step-slide-anim');
        void prevCard.offsetWidth;
        prevCard.classList.add('step-slide-anim');
    }
    
    const badge = document.getElementById('onboardingStepBadge');
    if (badge) badge.innerText = `Step ${currentOnboardingStep} of 6`;
    
    const nextBtn = document.getElementById('obNextBtn');
    if (nextBtn) nextBtn.innerText = "Next Step";
    
    if (currentOnboardingStep === 1) {
        const prevBtn = document.getElementById('obPrevBtn');
        if (prevBtn) {
            prevBtn.disabled = true;
            prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

function testSnowflakeConnection() {
    const icon = document.getElementById('testConnIcon');
    const label = document.getElementById('testConnLabel');
    const successMsg = document.getElementById('testConnSuccess');
    
    if (icon) icon.classList.add('animate-spin');
    if (label) label.innerText = "Connecting...";
    
    setTimeout(() => {
        if (icon) {
            icon.classList.remove('animate-spin');
            icon.innerText = "cloud_done";
        }
        if (label) label.innerText = "Connected";
        if (successMsg) successMsg.classList.remove('hidden');
        isSnowflakeConnected = true;
    }, 1500);
}

function runAutomaticSchemaDiscovery() {
    const progress = document.getElementById('discoveryProgress');
    const statusText = document.getElementById('discoveryStatusText');
    const tablesList = document.getElementById('discoveredTablesList');
    
    if (statusText) statusText.innerText = "Scanning Snowflake Metadata...";
    if (progress) progress.style.width = "100%";
    
    const tables = [
        { name: "ORDERS", rows: "12,400", type: "Transactional" },
        { name: "CUSTOMERS", rows: "2,100", type: "Sensitive (PII)" },
        { name: "PRODUCTS", rows: "450", type: "Catalog" },
        { name: "INVENTORY", rows: "8,900", type: "Operations" },
        { name: "SUPPLIERS", rows: "85", type: "Logistics" },
        { name: "SHIPMENTS", rows: "1,200", type: "Transactional" },
        { name: "SUPPORT_TICKETS", rows: "310", type: "Customer Support" },
        { name: "INVOICES", rows: "4,200", type: "Finance" }
    ];
    
    if (tablesList) tablesList.innerHTML = '';
    
    tables.forEach((t, index) => {
        setTimeout(() => {
            if (tablesList) {
                tablesList.insertAdjacentHTML('beforeend', `
                    <div class="p-2 bg-white/5 rounded border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-colors animate-fadeIn">
                        <span class="font-bold text-white">${t.name}</span>
                        <div class="flex justify-between text-[8px] text-on-surface-variant mt-1 font-mono">
                            <span>${t.rows} rows</span>
                            <span class="${t.type.includes('Sensitive') ? 'text-error' : 'text-primary'}">${t.type}</span>
                        </div>
                    </div>
                `);
            }
            if (index === tables.length - 1) {
                if (statusText) statusText.innerText = "Data Discovery Complete! 8 business KPIs mapped.";
            }
        }, index * 400);
    });
}

// ==========================================
// 2C. ACCORDION NAVIGATION & FILTERS
// ==========================================
function toggleNavGroup(groupId) {
    const el = document.getElementById(groupId);
    const arrow = document.getElementById(`arrow-${groupId}`);
    
    if (el) el.classList.toggle('group-collapsed');
    if (arrow) arrow.classList.toggle('group-arrow-collapsed');
}

function filterSidebarNav() {
    const query = document.getElementById('navSearchInput').value.toLowerCase();
    const navItems = document.querySelectorAll('#sidebarNav a');
    
    navItems.forEach(item => {
        const text = item.querySelector('.nav-text')?.innerText.toLowerCase() || '';
        if (text.includes(query)) {
            item.style.display = '';
            // Make sure its parent container is expanded
            const parentGroup = item.closest('.nav-group-container')?.querySelector('div');
            if (parentGroup && query.length > 0) {
                parentGroup.classList.remove('group-collapsed');
                const arrow = item.closest('.nav-group-container')?.querySelector('.group-arrow');
                if (arrow) arrow.classList.remove('group-arrow-collapsed');
            }
        } else {
            item.style.display = 'none';
        }
    });
}

// ==========================================
// 3. TAB ROUTING SWITCHER
// ==========================================
function switchTab(tabId) {
    activeTab = tabId;
    
    // Hide all section views inside mainContent dynamically
    const allViews = document.querySelectorAll('#mainContent > section[id^="view-"]');
    allViews.forEach(el => {
        el.classList.add('hidden-view');
    });
    
    // Also ensure standalone screens are hidden
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.classList.add('hidden-view');
    
    // Show active view
    let activeEl = document.getElementById(`view-${tabId}`);
    if (!activeEl && tabId === 'welcome') {
        activeEl = document.getElementById('welcomeScreen');
    }
    
    if (activeEl) {
        activeEl.classList.remove('hidden-view');
        activeEl.classList.remove('page-enter-anim');
        void activeEl.offsetWidth; // Force reflow for animation restart
        activeEl.classList.add('page-enter-anim');
    }
    
    // Manage sidebar visibility and offsets for Welcome view vs others
    const sidebar = document.getElementById('appSidebar');
    const main = document.getElementById('mainContent');
    const footer = document.getElementById('appFooter');
    
    if (tabId === 'welcome') {
        if (sidebar) sidebar.classList.add('hidden');
        if (main) {
            main.classList.remove('ml-64', 'content-collapsed-margin');
            main.classList.add('ml-0');
        }
        if (footer) {
            footer.classList.remove('left-64', 'footer-collapsed-left');
            footer.classList.add('left-0');
        }
    } else {
        if (sidebar) sidebar.classList.remove('hidden');
        if (main) {
            main.classList.remove('ml-0');
            if (sidebar && sidebar.classList.contains('sidebar-collapsed')) {
                main.classList.add('content-collapsed-margin');
            } else {
                main.classList.add('ml-64');
            }
        }
        if (footer) {
            footer.classList.remove('left-0');
            if (sidebar && sidebar.classList.contains('sidebar-collapsed')) {
                footer.classList.add('footer-collapsed-left');
            } else {
                footer.classList.add('left-64');
            }
        }
    }
    
    // Update sidebar layout active styles
    const navItems = document.querySelectorAll('#sidebarNav a');
    navItems.forEach(item => {
        const view = item.getAttribute('data-view');
        if (view === tabId) {
            item.className = "flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary border-l-4 border-primary transition-all group rounded-r-xl";
        } else {
            item.className = "flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-white/5 hover:text-primary transition-all group rounded-xl";
        }
    });

    // Specific routing initializations
    if (tabId === 'workflows') {
        setTimeout(drawConnections, 50); // Redraw SVG path boundaries
    } else if (tabId === 'referral-program') {
        renderReferralDashboard();
    } else if (tabId === 'admin-referrals') {
        renderAdminReferralDashboard();
    } else if (tabId === 'cortex-cli') {
        initCortexCliView();
    }
}

// ==========================================
// 4. DRAGGABLE CANVAS NODE SYSTEM
// ==========================================
let dragNodeId = null;
let dragStartX = 0;
let dragStartY = 0;

function initDraggableNodes() {
    const canvas = document.getElementById('workflowCanvas');
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleNodeDrag);
    canvas.addEventListener('mouseup', endNodeDrag);
    canvas.addEventListener('mouseleave', endNodeDrag);

    // Bind event handlers to nodes
    updateNodeDOMBindings();
}

let pendingWireStartNode = null;

function updateNodeDOMBindings() {
    const nodeElements = document.querySelectorAll('.canvas-node');
    nodeElements.forEach(nodeEl => {
        nodeEl.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('connection-handle') || e.target.closest('button')) {
                return;
            }
            
            const nodeId = parseInt(nodeEl.getAttribute('data-node-id'));
            startNodeDrag(nodeId, e);
        });

        nodeEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('connection-handle')) return;
            const nodeId = parseInt(nodeEl.getAttribute('data-node-id'));
            openNodeSettings(nodeId);
        });

        // Wire handle click listener
        const handles = nodeEl.querySelectorAll('.connection-handle');
        handles.forEach(handle => {
            handle.addEventListener('click', (e) => {
                e.stopPropagation();
                const nodeId = parseInt(nodeEl.getAttribute('data-node-id'));
                const isOutput = handle.classList.contains('connection-handle-right');
                
                if (isOutput) {
                    pendingWireStartNode = nodeId;
                    document.querySelectorAll('.connection-handle').forEach(h => h.classList.remove('glow-pulse'));
                    handle.classList.add('glow-pulse');
                    showSlackToast(`Output handle selected on Node #${nodeId}. Click an input handle on another node to wire connection.`);
                } else if (pendingWireStartNode && pendingWireStartNode !== nodeId) {
                    const exists = connections.some(c => c.from === pendingWireStartNode && c.to === nodeId);
                    if (!exists) {
                        connections.push({ from: pendingWireStartNode, to: nodeId });
                        drawConnections();
                        showSlackToast(`Wired Node #${pendingWireStartNode} ➔ Node #${nodeId} successfully!`);
                    }
                    document.querySelectorAll('.connection-handle').forEach(h => h.classList.remove('glow-pulse'));
                    pendingWireStartNode = null;
                }
            });
        });
    });
}


function startNodeDrag(nodeId, e) {
    const nodeEl = document.querySelector(`.canvas-node[data-node-id="${nodeId}"]`);
    if (!nodeEl) return;
    
    dragNodeId = nodeId;
    nodeEl.classList.add('canvas-node-active');
    
    // Store cursor offset relative to top-left of node
    const rect = nodeEl.getBoundingClientRect();
    const canvasRect = document.getElementById('workflowCanvas').getBoundingClientRect();
    dragStartX = e.clientX - rect.left;
    dragStartY = e.clientY - rect.top;
    
    e.preventDefault();
}

function handleNodeDrag(e) {
    if (dragNodeId === null) return;
    
    const canvas = document.getElementById('workflowCanvas');
    const container = document.getElementById('nodesContainer');
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calculate new position relative to scrolling canvas content container
    const x = e.clientX - canvasRect.left + canvas.scrollLeft - dragStartX;
    const y = e.clientY - canvasRect.top + canvas.scrollTop - dragStartY;
    
    // Constrain within workspace boundaries
    const constrainedX = Math.max(10, Math.min(2500, x));
    const constrainedY = Math.max(10, Math.min(2500, y));

    // Update state DB
    const node = nodes.find(n => n.id === dragNodeId);
    if (node) {
        node.x = constrainedX;
        node.y = constrainedY;
    }
    
    // Update Element style positions
    const nodeEl = document.querySelector(`.canvas-node[data-node-id="${dragNodeId}"]`);
    if (nodeEl) {
        nodeEl.style.left = `${constrainedX}px`;
        nodeEl.style.top = `${constrainedY}px`;
    }
    
    // Recalculate dynamic SVG lines
    drawConnections();
}

function endNodeDrag() {
    if (dragNodeId === null) return;
    
    const nodeEl = document.querySelector(`.canvas-node[data-node-id="${dragNodeId}"]`);
    if (nodeEl) {
        nodeEl.classList.remove('canvas-node-active');
    }
    dragNodeId = null;
}

// Redraw SVG connection paths
function drawConnections() {
    const svg = document.getElementById('canvasConnections');
    if (!svg) return;
    
    // Remove existing paths
    const paths = svg.querySelectorAll('path');
    paths.forEach(p => p.remove());
    
    // Render lines for each connection
    connections.forEach(conn => {
        const source = nodes.find(n => n.id === conn.from);
        const target = nodes.find(n => n.id === conn.to);
        
        if (!source || !target) return;
        
        // Node dimensions: width 192px (w-48), height Trigger/Action is 64px, Logic Cortex is 96px (w-24 h-24 is 96px)
        const sourceWidth = 192;
        const sourceHeight = (source.type === 'logic' && source.subtype === 'Cortex Analyst') ? 96 : 64;
        
        const targetWidth = (target.name === 'End') ? 128 : 192;
        const targetHeight = (target.name === 'End') ? 48 : 64;

        // Output socket center: x + width, y + height/2
        const startX = source.x + sourceWidth;
        const startY = source.y + (sourceHeight / 2);
        
        // Input socket center: x, y + height/2
        const endX = target.x;
        const endY = target.y + (targetHeight / 2);
        
        // Cubic bezier control points curves
        const cpOffset = Math.max(50, Math.abs(endX - startX) * 0.5);
        const cp1X = startX + cpOffset;
        const cp1Y = startY;
        const cp2X = endX - cpOffset;
        const cp2Y = endY;
        
        const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'workflow-line');
        path.setAttribute('data-connection-from', source.id);
        path.setAttribute('data-connection-to', target.id);
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#lineGrad)');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
    });
}

// Create new node on double click or button click
function createNewNode(type) {
    const canvas = document.getElementById('workflowCanvas');
    const scrollLeft = canvas ? canvas.scrollLeft : 0;
    const scrollTop = canvas ? canvas.scrollTop : 0;
    
    const id = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 1;
    let name = 'New Block';
    let subtype = 'Custom operation';
    let icon = 'bolt';
    let colorClass = 'text-primary';
    let bgClass = 'bg-primary/10';
    let borderHover = 'hover:border-primary/45';
    let params = {};

    switch (type) {
        case 'trigger':
            name = 'Webhook Trigger';
            subtype = 'Incoming API';
            icon = 'bolt';
            params = { url: 'https://api.enterpriseflow.ai/v1/webhook', method: 'POST' };
            break;
        case 'action':
            name = 'Execute SQL';
            subtype = 'Snowflake Action';
            icon = 'database';
            colorClass = 'text-secondary';
            bgClass = 'bg-secondary/10';
            borderHover = 'hover:border-secondary/45';
            params = { query: 'INSERT INTO SIGNUPS VALUES (...);', warehouse: 'COMPUTE_WH' };
            break;
        case 'logic':
            name = 'Cortex Reason';
            subtype = 'Cortex Search';
            icon = 'psychology';
            colorClass = 'text-tertiary-container';
            bgClass = 'bg-tertiary-container/10';
            borderHover = 'hover:border-tertiary-container/45';
            params = { prompt: 'Reason about leads data.', engine: 'cortex-search' };
            break;
        case 'notification':
            name = 'Email Alert';
            subtype = 'SMTP Relay';
            icon = 'mail';
            colorClass = 'text-error';
            bgClass = 'bg-error/10';
            borderHover = 'hover:border-error/45';
            params = { recipient: 'team@company.com', subject: 'System notification' };
            break;
    }

    // Default node coordinate
    const x = 300 + scrollLeft + Math.floor(Math.random() * 100);
    const y = 200 + scrollTop + Math.floor(Math.random() * 80);

    const newNode = { id, name, type, subtype, x, y, params };
    nodes.push(newNode);

    // Create DOM element
    const container = document.getElementById('nodesContainer');
    const nodeEl = document.createElement('div');
    nodeEl.className = `canvas-node absolute bg-surface-container/85 glass-panel rounded-2xl p-4 w-48 shadow-lg border border-white/10 ${borderHover} transition-colors group`;
    nodeEl.style.left = `${x}px`;
    nodeEl.style.top = `${y}px`;
    nodeEl.setAttribute('data-node-id', id);
    nodeEl.setAttribute('data-node-type', type);

    nodeEl.innerHTML = `
        <div class="connection-handle connection-handle-left" data-handle-type="input"></div>
        <div class="connection-handle connection-handle-right" data-handle-type="output"></div>
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} shrink-0">
                <span class="material-symbols-outlined text-[20px]">${icon}</span>
            </div>
            <div>
                <h4 class="text-xs font-bold text-white node-name-label">${name}</h4>
                <p class="text-[9px] text-on-surface-variant mt-0.5">${subtype}</p>
            </div>
        </div>
    `;

    container.appendChild(nodeEl);
    
    // Connect to the previous last node if possible
    if (nodes.length > 1) {
        // Find previous node
        const prevNode = nodes[nodes.length - 2];
        connections.push({ from: prevNode.id, to: id });
    }

    updateNodeDOMBindings();
    drawConnections();
}

function createNewWorkflow() {
    // Resets layout
    nodes = [
        { id: 1, name: 'Trigger Web', type: 'trigger', subtype: 'Webhook', x: 100, y: 180, params: { url: 'https://api.enterpriseflow.ai/v1/trigger', method: 'POST' } },
        { id: 2, name: 'End pipeline', type: 'action', subtype: 'Termination', x: 400, y: 188, params: {} }
    ];
    connections = [
        { from: 1, to: 2 }
    ];
    
    // Clear DOM nodes and keep static nodes only
    const container = document.getElementById('nodesContainer');
    if (container) {
        container.innerHTML = `
            <!-- Node 1 -->
            <div class="canvas-node absolute bg-surface-container/85 glass-panel rounded-2xl p-4 w-48 shadow-lg border border-white/10 hover:border-primary/45 transition-colors group" style="left: 100px; top: 180px;" data-node-id="1" data-node-type="trigger">
                <div class="connection-handle connection-handle-right" data-handle-type="output"></div>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary glow-pulse border-primary/20 shrink-0">
                        <span class="material-symbols-outlined text-[20px]">bolt</span>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-white node-name-label">Trigger Web</h4>
                        <p class="text-[9px] text-on-surface-variant mt-0.5">Webhook</p>
                    </div>
                </div>
            </div>

            <!-- Node 2 -->
            <div class="canvas-node absolute bg-surface-container/85 glass-panel rounded-2xl p-4 w-32 shadow-lg border border-white/5 opacity-70" style="left: 400px; top: 188px;" data-node-id="2" data-node-type="action">
                <div class="connection-handle connection-handle-left" data-handle-type="input"></div>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-on-surface-variant shrink-0">
                        <span class="material-symbols-outlined text-[16px]">stop</span>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-on-surface-variant node-name-label">End pipeline</h4>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateNodeDOMBindings();
    drawConnections();
    switchTab('workflows');
}

// Auto-optimize nodes pipeline layout helper
function autoOptimizeNodes() {
    alert('Optimizing pipeline: Reordering and aligning node elements for 24% faster Snowflake Cortex execution.');
    
    let currentX = 100;
    nodes.forEach(node => {
        node.y = 180;
        node.x = currentX;
        
        const el = document.querySelector(`.canvas-node[data-node-id="${node.id}"]`);
        if (el) {
            el.style.left = `${node.x}px`;
            el.style.top = `${node.y}px`;
        }
        
        if (node.type === 'logic' && node.subtype === 'Cortex Analyst') {
            node.y = 155;
            if (el) el.style.top = `${node.y}px`;
        }
        
        currentX += 250;
    });
    
    drawConnections();
}

function exportWorkflowJSON() {
    const workflowData = {
        name: 'Snowflake-to-Slack Lead Gen Pipeline',
        exportedAt: new Date().toISOString(),
        nodes: nodes,
        connections: connections
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflowData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `enterprise_flow_pipeline_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSlackToast("Workflow exported to JSON file successfully!");
}

function importWorkflowJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.nodes && Array.isArray(data.nodes)) {
                nodes = data.nodes;
                connections = data.connections || [];
                renderAllNodesFromState();
                drawConnections();
                showSlackToast(`Successfully imported ${nodes.length} nodes into visual builder canvas!`);
            } else {
                alert('Invalid JSON workflow file format.');
            }
        } catch(err) {
            alert('Failed to parse JSON file: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function renderAllNodesFromState() {
    const container = document.getElementById('nodesContainer');
    if (!container) return;
    container.innerHTML = '';
    
    nodes.forEach(node => {
        let colorClass = 'text-primary';
        let bgClass = 'bg-primary/10';
        let borderHover = 'hover:border-primary/45';
        let icon = node.icon || 'bolt';
        
        if (node.type === 'action') { colorClass = 'text-secondary'; bgClass = 'bg-secondary/10'; borderHover = 'hover:border-secondary/45'; icon = node.icon || 'database'; }
        else if (node.type === 'logic') { colorClass = 'text-tertiary-container'; bgClass = 'bg-tertiary-container/10'; borderHover = 'hover:border-tertiary-container/45'; icon = node.icon || 'psychology'; }
        else if (node.type === 'notification') { colorClass = 'text-error'; bgClass = 'bg-error/10'; borderHover = 'hover:border-error/45'; icon = node.icon || 'send'; }
        
        const nodeEl = document.createElement('div');
        nodeEl.className = `canvas-node absolute bg-surface-container/85 glass-panel rounded-2xl p-4 w-48 shadow-lg border border-white/10 ${borderHover} transition-colors group`;
        nodeEl.style.left = `${node.x}px`;
        nodeEl.style.top = `${node.y}px`;
        nodeEl.setAttribute('data-node-id', node.id);
        nodeEl.setAttribute('data-node-type', node.type);
        
        nodeEl.innerHTML = `
            <div class="connection-handle connection-handle-left" data-handle-type="input"></div>
            <div class="connection-handle connection-handle-right" data-handle-type="output"></div>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} shrink-0">
                    <span class="material-symbols-outlined text-[20px]">${icon}</span>
                </div>
                <div>
                    <h4 class="text-xs font-bold text-white node-name-label">${node.name}</h4>
                    <p class="text-[9px] text-on-surface-variant mt-0.5">${node.subtype || ''}</p>
                </div>
            </div>
        `;
        container.appendChild(nodeEl);
    });
    
    updateNodeDOMBindings();
}

function openAddNodeModal() {
    const modal = document.getElementById('addNodeModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddNodeModal() {
    const modal = document.getElementById('addNodeModal');
    if (modal) modal.classList.add('hidden');
}

function submitCreateNewNode() {
    const titleInput = document.getElementById('newNodeTitleInput')?.value.trim() || 'Custom Pipeline Block';
    const category = document.getElementById('newNodeCategorySelect')?.value || 'Action';
    const icon = document.getElementById('newNodeIconInput')?.value.trim() || 'bolt';
    const subtitle = document.getElementById('newNodeSubtitleInput')?.value.trim() || 'Custom Operation Node';
    
    closeAddNodeModal();
    
    const type = category.toLowerCase();
    const canvas = document.getElementById('workflowCanvas');
    const scrollLeft = canvas ? canvas.scrollLeft : 0;
    const scrollTop = canvas ? canvas.scrollTop : 0;
    
    const id = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 1;
    let colorClass = 'text-primary';
    let bgClass = 'bg-primary/10';
    let borderHover = 'hover:border-primary/45';
    
    if (type === 'action') { colorClass = 'text-secondary'; bgClass = 'bg-secondary/10'; borderHover = 'hover:border-secondary/45'; }
    else if (type === 'logic') { colorClass = 'text-tertiary-container'; bgClass = 'bg-tertiary-container/10'; borderHover = 'hover:border-tertiary-container/45'; }
    else if (type === 'notification') { colorClass = 'text-error'; bgClass = 'bg-error/10'; borderHover = 'hover:border-error/45'; }
    
    const x = 250 + scrollLeft + ((nodes.length * 30) % 300);
    const y = 180 + scrollTop + ((nodes.length * 40) % 250);
    
    const newNode = { id, name: titleInput, type, subtype: subtitle, x, y, icon, params: { custom: true } };
    nodes.push(newNode);
    
    const container = document.getElementById('nodesContainer');
    if (container) {
        const nodeEl = document.createElement('div');
        nodeEl.className = `canvas-node absolute bg-surface-container/85 glass-panel rounded-2xl p-4 w-48 shadow-lg border border-white/10 ${borderHover} transition-colors group`;
        nodeEl.style.left = `${x}px`;
        nodeEl.style.top = `${y}px`;
        nodeEl.setAttribute('data-node-id', id);
        nodeEl.setAttribute('data-node-type', type);
        
        nodeEl.innerHTML = `
            <div class="connection-handle connection-handle-left" data-handle-type="input"></div>
            <div class="connection-handle connection-handle-right" data-handle-type="output"></div>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} shrink-0">
                    <span class="material-symbols-outlined text-[20px]">${icon}</span>
                </div>
                <div>
                    <h4 class="text-xs font-bold text-white node-name-label">${titleInput}</h4>
                    <p class="text-[9px] text-on-surface-variant mt-0.5">${subtitle}</p>
                </div>
            </div>
        `;
        container.appendChild(nodeEl);
    }
    
    if (nodes.length > 1) {
        const prevNode = nodes[nodes.length - 2];
        connections.push({ from: prevNode.id, to: id });
    }
    
    updateNodeDOMBindings();
    drawConnections();
    showSlackToast(`Node "${titleInput}" created & added to workflow canvas.`);
}


// ==========================================
// 5. CONFIGURATION DRAWER LOGIC
// ==========================================
function openNodeSettings(nodeId) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    document.getElementById('drawer-node-id').value = node.id;
    document.getElementById('drawer-node-name').value = node.name;
    document.getElementById('drawer-node-type').value = node.type;
    
    const paramsContainer = document.getElementById('drawer-params');
    paramsContainer.innerHTML = ''; // Reset parameters
    
    // Dynamically generate form inputs based on node properties
    if (node.type === 'trigger') {
        paramsContainer.innerHTML = `
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">Webhook endpoint URL</label>
                <input type="text" id="param-url" value="${node.params.url || ''}" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:border-primary focus:outline-none" />
            </div>
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">HTTP Request Method</label>
                <select id="param-method" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:border-primary focus:outline-none">
                    <option value="POST" ${node.params.method === 'POST' ? 'selected' : ''}>POST</option>
                    <option value="GET" ${node.params.method === 'GET' ? 'selected' : ''}>GET</option>
                    <option value="PUT" ${node.params.method === 'PUT' ? 'selected' : ''}>PUT</option>
                </select>
            </div>
        `;
    } else if (node.type === 'action') {
        paramsContainer.innerHTML = `
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">Snowflake warehouse</label>
                <input type="text" id="param-wh" value="${node.params.warehouse || 'COMPUTE_WH'}" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:border-primary focus:outline-none" />
            </div>
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">SQL Query Statement</label>
                <textarea id="param-sql" rows="4" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs font-code-sm focus:border-primary focus:outline-none resize-none">${node.params.query || ''}</textarea>
            </div>
        `;
    } else if (node.type === 'logic') {
        paramsContainer.innerHTML = `
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">Cortex Reasoning Prompt</label>
                <textarea id="param-prompt" rows="4" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:border-primary focus:outline-none resize-none">${node.params.prompt || ''}</textarea>
            </div>
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">Cortex Model Engine</label>
                <select id="param-engine" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:border-primary focus:outline-none">
                    <option value="cortex-analyst" ${node.params.engine === 'cortex-analyst' ? 'selected' : ''}>Cortex Analyst (Strict Queries)</option>
                    <option value="cortex-search" ${node.params.engine === 'cortex-search' ? 'selected' : ''}>Cortex Search (RAG Vectors)</option>
                </select>
            </div>
        `;
    } else if (node.type === 'notification') {
        paramsContainer.innerHTML = `
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">Slack Channel Target</label>
                <input type="text" id="param-channel" value="${node.params.channel || ''}" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:border-primary focus:outline-none" />
            </div>
            <div>
                <label class="block text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider font-bold">Notification template</label>
                <textarea id="param-template" rows="3" class="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:border-primary focus:outline-none resize-none">${node.params.template || ''}</textarea>
            </div>
        `;
    }

    // Open drawer
    document.getElementById('nodeSettingsDrawer').classList.remove('translate-x-full');
}

function closeNodeSettings() {
    document.getElementById('nodeSettingsDrawer').classList.add('translate-x-full');
}

function saveNodeSettings() {
    const id = parseInt(document.getElementById('drawer-node-id').value);
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    const newName = document.getElementById('drawer-node-name').value;
    node.name = newName;

    // Update DOM labels
    const nodeEl = document.querySelector(`.canvas-node[data-node-id="${id}"]`);
    if (nodeEl) {
        const label = nodeEl.querySelector('.node-name-label');
        if (label) label.innerText = newName;
    }

    // Update param values
    if (node.type === 'trigger') {
        node.params.url = document.getElementById('param-url').value;
        node.params.method = document.getElementById('param-method').value;
    } else if (node.type === 'action') {
        node.params.warehouse = document.getElementById('param-wh').value;
        node.params.query = document.getElementById('param-sql').value;
    } else if (node.type === 'logic') {
        node.params.prompt = document.getElementById('param-prompt').value;
        node.params.engine = document.getElementById('param-engine').value;
    } else if (node.type === 'notification') {
        node.params.channel = document.getElementById('param-channel').value;
        node.params.template = document.getElementById('param-template').value;
    }

    closeNodeSettings();
}

function deleteActiveNode() {
    const id = parseInt(document.getElementById('drawer-node-id').value);
    
    // Remove from nodes DB
    nodes = nodes.filter(n => n.id !== id);
    
    // Remove matching connection paths
    connections = connections.filter(conn => conn.from !== id && conn.to !== id);
    
    // Re-link previous and next nodes if applicable
    // Simple helper: re-link in memory if a node is in between
    
    // Remove element from DOM
    const el = document.querySelector(`.canvas-node[data-node-id="${id}"]`);
    if (el) el.remove();
    
    closeNodeSettings();
    drawConnections();
}

// ==========================================
// 6. SQL RUNNER CONSOLE INTERACTIVE ENGINE
// ==========================================
function loadTableSchema(tableName) {
    let sql = `SELECT * FROM ${tableName} LIMIT 5;`;
    if (tableName === 'LEADS') {
        sql = `SELECT * FROM LEADS WHERE LEAD_CONFIDENCE > 0.85 ORDER BY VALUE DESC LIMIT 5;`;
    }
    
    const input = document.getElementById('sqlConsoleInput');
    if (input) {
        input.value = sql;
        switchTab('data-sources');
        executeSQLQuery();
    }
}

let lastSQLQueryResultData = null;

function exportSQLResultsCSV() {
    if (!lastSQLQueryResultData || !lastSQLQueryResultData.length) {
        alert('No tabular query data available to export.');
        return;
    }
    const headers = Object.keys(lastSQLQueryResultData[0]);
    const csvRows = [headers.join(',')];
    lastSQLQueryResultData.forEach(row => {
        const values = headers.map(h => {
            const val = String(row[h]).replace(/"/g, '""');
            return `"${val}"`;
        });
        csvRows.push(values.join(','));
    });
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `snowflake_export_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSlackToast("Exported SQL query results to CSV successfully!");
}

function exportSQLResultsJSON() {
    if (!lastSQLQueryResultData || !lastSQLQueryResultData.length) {
        alert('No tabular query data available to export.');
        return;
    }
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lastSQLQueryResultData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `snowflake_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSlackToast("Exported SQL query results to JSON successfully!");
}

function executeSQLQuery() {
    const sql = document.getElementById('sqlConsoleInput').value.trim();
    const meta = document.getElementById('sqlExecutionMeta');
    const container = document.getElementById('sqlResultContainer');
    const exportBtnBox = document.getElementById('sqlExportButtons');
    const whInput = document.getElementById('dbWarehouseInput')?.value || 'COMPUTE_WH';
    
    if (!sql) return;
    
    if (meta) meta.innerText = `Executing query on [${whInput}]...`;
    if (exportBtnBox) exportBtnBox.classList.add('hidden');
    
    // Simulate loading state
    if (container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-primary space-y-4">
                <span class="material-symbols-outlined text-[36px] animate-spin">sync</span>
                <p class="text-xs font-code-sm">Running query on warehouse: ${whInput}...</p>
            </div>
        `;
    }

    const executionDelay = 300 + Math.random() * 400;
    
    setTimeout(() => {
        let matchedTable = null;
        const normalizedSql = sql.toUpperCase();
        
        if (normalizedSql.includes('LEADS')) matchedTable = 'LEADS';
        else if (normalizedSql.includes('SESSIONS')) matchedTable = 'SESSIONS';
        else if (normalizedSql.includes('SIGNUPS')) matchedTable = 'SIGNUPS';
        else if (normalizedSql.includes('INVENTORY')) matchedTable = 'INVENTORY';
        else if (normalizedSql.includes('PURCHASE')) matchedTable = 'PURCHASE_ORDERS';
        else if (normalizedSql.includes('AUDIT')) matchedTable = 'AUDIT_LOGS';
        
        if (meta) {
            const timeVal = (executionDelay / 1000).toFixed(2);
            meta.innerHTML = `Time elapsed: <span class="text-primary font-bold">${timeVal}s</span> | Status: <span class="text-green-400 font-bold">Success</span> | Warehouse: <span class="text-secondary font-bold">${whInput}</span>`;
        }

        if (matchedTable && mockDatabase[matchedTable]) {
            const data = mockDatabase[matchedTable];
            lastSQLQueryResultData = data;
            if (exportBtnBox) exportBtnBox.classList.remove('hidden');
            
            const headers = Object.keys(data[0]);
            
            let tableHTML = `
                <div class="overflow-x-auto border border-white/10 rounded-xl bg-surface-container-lowest/50">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-surface-container-high/50 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider border-b border-white/10">
            `;
            
            headers.forEach(h => {
                tableHTML += `<th class="py-3 px-4">${h}</th>`;
            });
            
            tableHTML += `
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5 font-code-sm">
            `;
            
            data.forEach(row => {
                tableHTML += `<tr class="hover:bg-white/5 transition-colors">`;
                headers.forEach(h => {
                    let cellVal = row[h];
                    if (h === 'LEAD_CONFIDENCE') {
                        cellVal = `<span class="text-primary font-bold">${Math.round(cellVal * 100)}%</span>`;
                    } else if (h === 'RISK' && cellVal === 'CRITICAL') {
                        cellVal = `<span class="text-error font-bold">${cellVal}</span>`;
                    }
                    tableHTML += `<td class="py-3 px-4">${cellVal}</td>`;
                });
                tableHTML += `</tr>`;
            });
            
            tableHTML += `
                        </tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = tableHTML;
        } else {
            lastSQLQueryResultData = null;
            if (exportBtnBox) exportBtnBox.classList.add('hidden');
            container.innerHTML = `
                <div class="p-5 border border-primary/20 bg-primary/5 rounded-2xl flex gap-3 text-xs">
                    <span class="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                    <div>
                        <h4 class="font-bold text-white">Statement Executed Successfully</h4>
                        <p class="text-on-surface-variant mt-1.5 leading-relaxed">Affected rows: 0. Warehouse [${whInput}] executed statement successfully. Schema public access validated.</p>
                        <pre class="bg-background/80 text-[11px] p-3 rounded-lg mt-3 text-secondary overflow-x-auto font-code-sm border border-white/5">${sql}</pre>
                    </div>
                </div>
            `;
        }
    }, executionDelay);
}


// ==========================================
// 7. CORTEX AI INTERACTIVE CHAT ENGINE
// ==========================================
function sendChatMessage() {
    const input = document.getElementById('aiChatInput');
    const msgList = document.getElementById('aiChatMessages');
    
    if (!input || !input.value.trim()) return;
    
    const userText = input.value.trim();
    input.value = ''; // Clear text
    
    // Append User Message to DOM
    const userMsgHTML = `
        <div class="flex gap-4 max-w-2xl ml-auto justify-end">
            <div class="glass-panel p-4 rounded-2xl bg-primary/5 border-primary/20 text-right">
                <h4 class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Developer User</h4>
                <p class="text-xs text-white leading-relaxed">${userText}</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-on-surface-variant shrink-0">
                <span class="material-symbols-outlined text-[18px]">account_circle</span>
            </div>
        </div>
    `;
    msgList.insertAdjacentHTML('beforeend', userMsgHTML);
    msgList.scrollTop = msgList.scrollHeight; // Scroll down

    // Append Loading Placeholder for Agent response
    const agentLoaderId = 'agent-msg-' + Date.now();
    const loaderHTML = `
        <div id="${agentLoaderId}" class="flex gap-4 max-w-2xl">
            <div class="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 animate-pulse">
                <span class="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div class="glass-panel p-4 rounded-2xl">
                <h4 class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Cortex Analyst Agent</h4>
                <div class="flex items-center gap-1.5 py-1 text-primary">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style="animation-delay:0.1s"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style="animation-delay:0.2s"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style="animation-delay:0.3s"></span>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        msgList.insertAdjacentHTML('beforeend', loaderHTML);
        msgList.scrollTop = msgList.scrollHeight;
    }, 200);

    // AI thinking timing
    setTimeout(() => {
        const placeholder = document.getElementById(agentLoaderId);
        if (!placeholder) return;
        
        let responseHTML = '';
        const normText = userText.toLowerCase();

        if (normText.includes('optimize') && normText.includes('query')) {
            const sqlQuery = "SELECT ID, NAME, VALUE, LEAD_CONFIDENCE FROM PUBLIC.LEADS WHERE LEAD_CONFIDENCE > 0.85 ORDER BY LEAD_CONFIDENCE DESC LIMIT 5;";
            responseHTML = `
                <p class="text-xs text-white leading-relaxed">Analyzing Snowflake query parameters in node #2...<br/>
                Recommendation: To speed up read times on the <strong>PROD_LEADS_DB.PUBLIC.LEADS</strong> table, utilize a search index optimization and filter using the indexed <code>LEAD_CONFIDENCE</code> attribute. Here is the optimized query:
                <pre class="bg-background/80 text-[10px] p-3 rounded-lg mt-3 text-primary border border-white/5 font-code-sm">${sqlQuery}</pre>
                <div class="flex gap-2 mt-3">
                    <button class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-primary/20 transition-all flex items-center gap-1" onclick="applyOptimizedQuery()">
                        <span class="material-symbols-outlined text-[14px]">auto_fix_high</span> Apply to Node #2
                    </button>
                    <button class="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-secondary/20 transition-all flex items-center gap-1" onclick="runGeneratedSQLQuery('${sqlQuery}')">
                        <span class="material-symbols-outlined text-[14px]">terminal</span> Run in SQL Console
                    </button>
                </div>
                </p>
            `;
        } else if (normText.includes('inventory') || normText.includes('stock')) {
            const sqlQuery = "SELECT * FROM INVENTORY WHERE RISK = 'CRITICAL';";
            responseHTML = `
                <p class="text-xs text-white leading-relaxed">Querying inventory stock risk profile across Cortex AI warehouses...<br/>
                Discovered 1 critical stockout risk on item <strong>PRD-101 (Wireless Headphones X1)</strong>.<br/>
                Suggested query to inspect details:
                <pre class="bg-background/80 text-[10px] p-3 rounded-lg mt-3 text-primary border border-white/5 font-code-sm">${sqlQuery}</pre>
                <button class="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 mt-3 rounded-lg text-[10px] font-bold hover:bg-secondary/20 transition-all flex items-center gap-1" onclick="runGeneratedSQLQuery('${sqlQuery}')">
                    <span class="material-symbols-outlined text-[14px]">terminal</span> Run in SQL Console
                </button>
                </p>
            `;
        } else if (normText.includes('webhook') || normText.includes('slack')) {
            responseHTML = `
                <p class="text-xs text-white leading-relaxed">Slack Alert pipeline configuration loaded.<br/>
                To setup alerts, edit parameter values inside Node #7 (Slack Notify). If you want to automatically trigger on pipeline errors, we can append a conditional router logic block before it. Webhook endpoint address:
                <code class="block bg-background/50 text-[10px] p-2 mt-2 border border-white/5 text-secondary">https://mock.slack.com/services/T00000000/B00000000/...</code>
                </p>
            `;
        } else {
            const sqlQuery = "SELECT * FROM LEADS ORDER BY LEAD_CONFIDENCE DESC LIMIT 5;";
            responseHTML = `
                <p class="text-xs text-white leading-relaxed">Cortex Analyst query executed. Connected to warehouse <strong>COMPUTE_WH</strong>. I verified that your database holds schemas mapping leads & telemetry records.<br/>
                Sample query for active leads:
                <pre class="bg-background/80 text-[10px] p-3 rounded-lg mt-3 text-primary border border-white/5 font-code-sm">${sqlQuery}</pre>
                <button class="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 mt-3 rounded-lg text-[10px] font-bold hover:bg-secondary/20 transition-all flex items-center gap-1" onclick="runGeneratedSQLQuery('${sqlQuery}')">
                    <span class="material-symbols-outlined text-[14px]">terminal</span> Run in SQL Console
                </button>
                </p>
            `;
        }
        
        placeholder.innerHTML = `
            <div class="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div class="glass-panel p-4 rounded-2xl">
                <h4 class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Cortex Analyst Agent</h4>
                ${responseHTML}
            </div>
        `;
        msgList.scrollTop = msgList.scrollHeight;
    }, 1200);
}

function applyOptimizedQuery() {
    const readNode = nodes.find(n => n.id === 2);
    if (readNode) {
        readNode.params.query = `SELECT ID, NAME, VALUE, LEAD_CONFIDENCE FROM PUBLIC.LEADS WHERE LEAD_CONFIDENCE > 0.85 ORDER BY LEAD_CONFIDENCE DESC LIMIT 5;`;
        alert('Optimized query applied to Node #2 (Read Snowflake) successfully.');
    }
}

function runGeneratedSQLQuery(sql) {
    switchTab('snowflake-explorer');
    const input = document.getElementById('sqlConsoleInput');
    if (input) {
        input.value = sql;
        executeSQLQuery();
        showSlackToast("Query loaded & executing in Snowflake Console!");
    }
}


// ==========================================
// 8. LOGS SIMULATOR & TELEMETRY STREAM
// ==========================================
const workflowLogsDatabase = [
    { name: 'Snowflake-to-Slack Lead Gen', baseDuration: 1.2 },
    { name: 'Enterprise User Onboarding', baseDuration: 4.8 },
    { name: 'Salesforce Credits Daily Sync', baseDuration: 12.4 },
    { name: 'Database Schema Audit Alerts', baseDuration: 2.1 }
];

function initLiveLogSimulator() {
    // Generate initial table data
    populateLogTable();
    
    // Simulate recurring event triggers (append new logs every 9 seconds)
    setInterval(() => {
        simulateNewWorkflowRun();
    }, 9000);
}

function populateLogTable() {
    const liveBody = document.getElementById('liveWorkflowTableBody');
    const dashBody = document.getElementById('dashboardMonitorTableBody');
    
    if (!liveBody || !dashBody) return;
    
    liveBody.innerHTML = '';
    dashBody.innerHTML = '';

    // Add completed runs initially
    const initLogs = [
        { name: 'Snowflake-to-Slack Lead Gen', status: 'Completed', duration: '1.2s', confidence: 94 },
        { name: 'Enterprise User Onboarding', status: 'Completed', duration: '4.8s', confidence: 88 },
        { name: 'Database Schema Audit Alerts', status: 'Completed', duration: '2.1s', confidence: 96 }
    ];

    initLogs.forEach((log, index) => {
        appendTableRow(liveBody, log, index === 0); // Flash first row as new
        appendTableRow(dashBody, log, index === 0, true);
    });
}

function appendTableRow(tableEl, log, animate = false, isDashboard = false) {
    const row = document.createElement('tr');
    row.className = "border-b border-white/5 hover:bg-white/5 transition-colors";
    if (animate) {
        row.classList.add('bg-primary/5');
        setTimeout(() => {
            row.classList.remove('bg-primary/5');
        }, 3000);
    }

    const badgeColor = log.status === 'Running' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/10 text-on-surface-variant border-white/10';
    const barColor = log.confidence >= 90 ? 'bg-primary' : 'bg-secondary';
    
    if (isDashboard) {
        // Dashboard table format (includes the Action button)
        row.innerHTML = `
            <td class="py-3 px-4 font-bold text-on-surface">${log.name}</td>
            <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor}">
                    ${log.status}
                </span>
            </td>
            <td class="py-3 px-4 font-code-sm">${log.duration}</td>
            <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                    <div class="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full ${barColor}" style="width: ${log.confidence}%"></div>
                    </div>
                    <span class="font-bold text-white text-[10px]">${log.confidence}%</span>
                </div>
            </td>
            <td class="py-3 px-4">
                <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-[18px]" onclick="openMonitorDetails('${log.name}')">open_in_new</button>
            </td>
        `;
    } else {
        // Workflow designer table format (includes dynamic logs snippet)
        const logSnippet = log.status === 'Running' 
            ? 'LOG: Processing SQL node parameters against PUBLIC warehouse COMPUTE_WH...' 
            : `LOG: Workflow completed successfully. AI threshold verified (${log.confidence}%). Sent Slack webhook alert.`;
        
        row.innerHTML = `
            <td class="py-3 px-4 font-bold text-on-surface">${log.name}</td>
            <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor}">
                    ${log.status}
                </span>
            </td>
            <td class="py-3 px-4 font-code-sm">${log.duration}</td>
            <td class="py-3 px-4 font-bold text-primary">${log.confidence}%</td>
            <td class="py-3 px-4 font-code-sm text-[10px] text-on-surface-variant max-w-sm truncate">${logSnippet}</td>
        `;
    }
    
    // Insert at top of list
    if (tableEl.firstChild) {
        tableEl.insertBefore(row, tableEl.firstChild);
    } else {
        tableEl.appendChild(row);
    }

    // Cap at 6 rows to prevent layout swelling
    if (tableEl.children.length > 6) {
        tableEl.lastChild.remove();
    }
}

function simulateNewWorkflowRun() {
    const liveBody = document.getElementById('liveWorkflowTableBody');
    const dashBody = document.getElementById('dashboardMonitorTableBody');
    if (!liveBody || !dashBody) return;
    
    const randomJob = workflowLogsDatabase[Math.floor(Math.random() * workflowLogsDatabase.length)];
    
    // 1. Create a "Running" job row
    const runLog = {
        name: randomJob.name,
        status: 'Running',
        duration: '0.0s',
        confidence: Math.floor(Math.random() * 15) + 82
    };

    appendTableRow(liveBody, runLog, true);
    appendTableRow(dashBody, runLog, true, true);
    
    // Update KPI Executions count on dashboard
    const runStat = document.getElementById('stat-total-runs');
    if (runStat) {
        const prevVal = parseInt(runStat.innerText.replace(/,/g, ''));
        runStat.innerText = (prevVal + 1).toLocaleString();
    }

    // 2. Complete the running job after 3.2 seconds
    setTimeout(() => {
        // Find rows matching job name
        updateRunningRowToComplete(liveBody, randomJob.name, randomJob.baseDuration, runLog.confidence);
        updateRunningRowToComplete(dashBody, randomJob.name, randomJob.baseDuration, runLog.confidence, true);
    }, 3200);
}

function updateRunningRowToComplete(tableEl, jobName, baseDuration, confidence, isDashboard = false) {
    const rows = tableEl.querySelectorAll('tr');
    for (let row of rows) {
        const titleCell = row.querySelector('td');
        if (titleCell && titleCell.innerText === jobName) {
            const badge = row.querySelector('span');
            if (badge && badge.innerText === 'Running') {
                // Modify values
                badge.innerText = 'Completed';
                badge.className = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-white/10 text-on-surface-variant border-white/10';
                
                const durCell = row.querySelectorAll('td')[2];
                const realDuration = (baseDuration + (Math.random() - 0.5) * 0.5).toFixed(1) + 's';
                if (durCell) durCell.innerText = realDuration;
                
                if (!isDashboard) {
                    const logCell = row.querySelectorAll('td')[4];
                    if (logCell) {
                        logCell.innerText = `LOG: Workflow completed successfully. AI threshold verified (${confidence}%). Sent Slack webhook alert.`;
                        logCell.className = 'py-3 px-4 font-code-sm text-[10px] text-green-400 max-w-sm truncate';
                    }
                }
                break;
            }
        }
    }
}

function openMonitorDetails(workflowName) {
    alert(`Audit Log [${workflowName}]:\n- Trigger Webhook validated (HTTP 200)\n- Snowflake compute reads matches keys\n- Cortex analyst reasoning confidence verified\n- slack webhook dispatched successful.`);
}

function refreshDashboard() {
    // Randomize counters slightly to look live and functional
    const active = document.getElementById('stat-active-agents');
    const rate = document.getElementById('stat-success-rate');
    const costs = document.getElementById('stat-costs');
    
    if (active) active.innerText = '4 / 4';
    if (rate) rate.innerText = (97.5 + Math.random() * 1.5).toFixed(1) + '%';
    if (costs) costs.innerText = (1.5 + Math.random() * 0.5).toFixed(2) + ' credits/hr';
}

// ==========================================
// 9. SETTINGS & ACCESSORIES
// ==========================================
let isDarkTheme = true;
function toggleInterfaceTheme() {
    const btn = document.getElementById('themeToggleBtn');
    const toggleDot = btn?.querySelector('div');
    
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        if (toggleDot) {
            toggleDot.style.left = '4px';
            toggleDot.className = 'w-4 h-4 bg-primary rounded-full transition-all duration-300 absolute left-1';
        }
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        if (toggleDot) {
            toggleDot.style.left = '24px';
            toggleDot.className = 'w-4 h-4 bg-on-secondary-fixed rounded-full transition-all duration-300 absolute left-6';
        }
    }
}

// ==========================================
// ==========================================
// 10. VOICE AI MIC WAVE VISUALIZER & WEB SPEECH ENGINE
// ==========================================
let speechRecognitionInstance = null;

function toggleVoiceAI() {
    isVoiceActive = !isVoiceActive;
    
    const btn = document.getElementById('voiceAiBtn');
    const wave = document.getElementById('voiceWaveform');
    const label = btn?.querySelector('span:nth-child(2)');
    
    if (isVoiceActive) {
        btn?.classList.add('text-primary');
        btn?.classList.remove('text-secondary');
        wave?.classList.remove('hidden');
        wave?.classList.add('flex');
        if (label) label.innerText = 'Voice AI Listening...';
        
        animateVoiceBars();
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            try {
                speechRecognitionInstance = new SpeechRecognition();
                speechRecognitionInstance.continuous = false;
                speechRecognitionInstance.interimResults = false;
                speechRecognitionInstance.lang = 'en-US';
                
                speechRecognitionInstance.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    showSlackToast(`Voice Command Recognized: "${transcript}"`);
                    speakVoiceResponse(`Recognized command: ${transcript}`);
                    processVoiceCommand(transcript);
                    if (isVoiceActive) toggleVoiceAI();
                };
                
                speechRecognitionInstance.onerror = (err) => {
                    console.log('Speech recognition event:', err);
                };
                
                speechRecognitionInstance.start();
            } catch(e) {
                console.log('Speech recognition init error:', e);
            }
        } else {
            showSlackToast("Voice AI active! Speak commands like 'run simulation' or 'open sql'.");
            speakVoiceResponse("Voice AI active. How can I assist you with Snowflake operations today?");
        }
    } else {
        btn?.classList.remove('text-primary');
        btn?.classList.add('text-secondary');
        wave?.classList.add('hidden');
        wave?.classList.remove('flex');
        if (label) label.innerText = 'Voice AI Helper';
        
        if (speechRecognitionInstance) {
            try { speechRecognitionInstance.stop(); } catch(e) {}
            speechRecognitionInstance = null;
        }
        
        if (voiceAnimationId) {
            cancelAnimationFrame(voiceAnimationId);
            voiceAnimationId = null;
        }
    }
}

function processVoiceCommand(cmd) {
    const text = cmd.toLowerCase();
    if (text.includes('run') || text.includes('start') || text.includes('simulation') || text.includes('pipeline')) {
        switchTab('workflows');
        setTimeout(() => startEndToEndSimulation(), 500);
        speakVoiceResponse("Starting end to end pipeline simulation");
    } else if (text.includes('sql') || text.includes('query') || text.includes('snowflake') || text.includes('console')) {
        switchTab('snowflake-explorer');
        speakVoiceResponse("Opening Snowflake Console");
    } else if (text.includes('chat') || text.includes('ask') || text.includes('cortex') || text.includes('ai')) {
        switchTab('cortex-chat');
        const input = document.getElementById('aiChatInput');
        if (input) {
            input.value = cmd;
            sendChatMessage();
        }
        speakVoiceResponse("Sending your query to Cortex AI Chat Assistant");
    } else if (text.includes('dashboard') || text.includes('overview') || text.includes('metrics')) {
        switchTab('dashboard');
        speakVoiceResponse("Switching to Operations Control Room");
    } else if (text.includes('optimize') || text.includes('align')) {
        switchTab('workflows');
        autoOptimizeNodes();
        speakVoiceResponse("Optimizing visual workflow nodes");
    } else {
        switchTab('cortex-chat');
        const input = document.getElementById('aiChatInput');
        if (input) {
            input.value = cmd;
            sendChatMessage();
        }
    }
}

function speakVoiceResponse(message) {
    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch(e) {}
    }
}

function animateVoiceBars() {
    const bars = document.querySelectorAll('.voice-wave-bar');
    bars.forEach(bar => {
        const height = Math.floor(Math.random() * 16) + 4;
        bar.style.height = `${height}px`;
    });
    
    if (isVoiceActive) {
        voiceAnimationId = requestAnimationFrame(animateVoiceBars);
    }
}


// ==========================================
// 11. END-TO-END PIPELINE SIMULATOR
// ==========================================
let activeSimulationTimeouts = [];
let isSimulationRunning = false;
let activeSimIndex = 0;

const simulationSteps = [
    { step: 1, title: "Initialize System Scans", msg: "Scanning Snowflake database tables...", view: "dashboard", delay: 1000 },
    { step: 2, title: "Data Ingestion", msg: "Querying SELECT * FROM INVENTORY safety logs...", view: "data-sources", delay: 1200 },
    { step: 3, title: "Detect Anomaly", msg: "Flagged critical stockout risk for Product 'Wireless Headphones X1'.", view: "anomalies", delay: 1200 },
    { step: 4, title: "Trigger Alarm", msg: "Dispatched operational alarm to Incident dashboard.", view: "action-incidents", delay: 1200 },
    { step: 5, title: "Initiate Investigation", msg: "Data Investigation Agent mapping historical trends...", view: "ai-agent", delay: 1500 },
    { step: 6, title: "RCA Hypothesis", msg: "Discovered marketing campaign correlation + supplier shipment delays.", view: "root-causes", delay: 1500 },
    { step: 7, title: "Validate RCA Evidence", msg: "Verified supplier tracking API returns delay confirmation code.", view: "root-causes", delay: 1200 },
    { step: 8, title: "Run Predictive Models", msg: "Simulating safety stockout forecast (critical in 68 hours).", view: "predictions", delay: 1500 },
    { step: 9, title: "Scenario Simulation", msg: "Compare mitigation options. [Awaiting Action Selection...]", view: "predictions", delay: 1000, waitUser: true },
    { step: 10, title: "Select Mitigation Plan", msg: "Alternate Supplier B chosen. Reorder threshold validated.", view: "recommendations", delay: 1500 },
    { step: 11, title: "Workflow Planner Node", msg: "Visual Builder generating nodes structure to automate procurement...", view: "workflows", delay: 1800 },
    { step: 12, title: "Human Gate Approval", msg: "Awaiting administrator approval signature for ₹12,40,000 PO...", view: "approvals", delay: 1000, waitApproval: true },
    { step: 13, title: "Execute Snowflake Update", msg: "Authorized PO insertion in OPERATIONS.PURCHASE_ORDERS.", view: "snowflake-explorer", delay: 1500 },
    { step: 14, title: "Verify Transaction Quality", msg: "Data quality profile confirms zero null values in PO records.", view: "data-quality", delay: 1200 },
    { step: 15, title: "Slack Webhook Dispatch", msg: "Alerting #procurement channel: Reorder B-92 dispatched.", view: "integrations", delay: 1500 },
    { step: 16, title: "Create Jira Ticket", msg: "Syncing incident INC-2026-991 status to 'RESOLVED' in Jira.", view: "integrations", delay: 1500 },
    { step: 17, title: "Run Supply Chain Health Check", msg: "Re-scanning stock projection timeline post-order.", view: "supply-chain", delay: 1500 },
    { step: 18, title: "Verify Stock Security", msg: "Stock depletion forecast resolved (extended to 42 days safety).", view: "dashboard", delay: 1500 },
    { step: 19, title: "Write Governance Audit", msg: "Recording SECURE_SIGN ADM-991 to global policy registry.", view: "audit-governance", delay: 1500 },
    { step: 20, title: "Complete Loop", msg: "System returns to steady state. Automated savings: ₹2,45,000.", view: "dashboard", delay: 1500 }
];

function startEndToEndSimulation() {
    if (isSimulationRunning) return;
    
    // Disable run button
    const runBtn = document.getElementById('runPipelineBtn');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Running Loop...`;
        runBtn.classList.add('opacity-50', 'pointer-events-none');
    }
    
    isSimulationRunning = true;
    activeSimIndex = 0;
    activeSimulationTimeouts = [];
    
    // Clear logs
    const logBox = document.getElementById('liveActivityLogContainer');
    if (logBox) logBox.innerHTML = '';
    
    runNextSimulationStep();
}

function runNextSimulationStep() {
    if (activeSimIndex >= simulationSteps.length) {
        // Complete!
        showSlackToast("EnterpriseFlow AI closed-loop demo complete! Loop stats saved.");
        
        // Add Successful job run to logging tables!
        const newLog = {
            name: 'Enterprise Closed-Loop',
            status: 'Completed',
            duration: '22.4s',
            confidence: 99
        };
        const liveBody = document.getElementById('liveWorkflowTableBody');
        const dashBody = document.getElementById('dashboardMonitorTableBody');
        if (liveBody) appendTableRow(liveBody, newLog, true);
        if (dashBody) appendTableRow(dashBody, newLog, true, true);
        
        // Append Audit row to governance table
        const govBody = document.getElementById('governanceAuditTableBody');
        if (govBody) {
            govBody.insertAdjacentHTML('afterbegin', `
                <tr class="border-b border-white/5 text-[10px] font-mono">
                    <td class="py-3 text-on-surface-variant">${new Date().toLocaleTimeString()}</td>
                    <td>Supervisor Agent</td>
                    <td>Emergency Reorder workflow completed successfully</td>
                    <td class="text-primary font-bold">PASS (Cost Limit Check)</td>
                    <td>SECURE_SIGN: ADM-991</td>
                </tr>
            `);
        }
        
        // Increment statistics counters
        const runsStat = document.getElementById('stat-total-runs');
        if (runsStat) {
            const val = parseInt(runsStat.innerText.replace(/,/g, ''));
            runsStat.innerText = (val + 1).toLocaleString();
        }
        
        setTimeout(() => {
            alert('Enterprise Closed-Loop Simulation Complete!');
            cleanSimulationState();
        }, 800);
        return;
    }
    
    const step = simulationSteps[activeSimIndex];
    
    // Switch SPA views to match step target
    switchTab(step.view);
    
    // Highlight visual nodes if workflows tab is open
    highlightNodeForStep(step.step);
    
    // Log message
    const logBox = document.getElementById('liveActivityLogContainer');
    if (logBox) {
        logBox.insertAdjacentHTML('beforeend', `
            <div class="flex gap-2 py-1 border-b border-white/5 animate-fadeIn">
                <span class="text-on-surface-variant text-[10px] font-mono shrink-0">${new Date().toLocaleTimeString()}</span>
                <span class="text-primary font-bold shrink-0">[Step ${step.step}]</span>
                <span class="text-white">${step.msg}</span>
            </div>
        `);
        logBox.scrollTop = logBox.scrollHeight;
    }
    
    // Check pause gates
    if (step.waitUser) {
        // Halt and request user choice on Predictions tab
        showSlackToast("Awaiting scenario selection to proceed...");
        return;
    }
    
    if (step.waitApproval) {
        // Show Human Gate approval modal
        const modal = document.getElementById('approvalModal');
        if (modal) modal.classList.remove('hidden');
        showSlackToast("Awaiting administrator human approval gate signoff...");
        return;
    }
    
    // Continue loop
    const t = setTimeout(() => {
        activeSimIndex++;
        runNextSimulationStep();
    }, step.delay);
    activeSimulationTimeouts.push(t);
}

function selectScenario(scenarioType) {
    if (!isSimulationRunning || activeSimIndex !== 8) return;
    
    // Log user choice
    const logBox = document.getElementById('liveActivityLogContainer');
    if (logBox) {
        logBox.insertAdjacentHTML('beforeend', `
            <div class="flex gap-2 py-1 border-b border-white/5 text-primary">
                <span class="text-on-surface-variant text-[10px] font-mono shrink-0">${new Date().toLocaleTimeString()}</span>
                <span class="font-bold shrink-0">[DECISION]</span>
                <span>User selected: ${scenarioType === 'alternative' ? 'Alternate Supplier B' : 'Emergency Express Reorder'}</span>
            </div>
        `);
    }
    
    activeSimIndex++;
    runNextSimulationStep();
}

function submitPipelineGateApproval(approved) {
    const modal = document.getElementById('approvalModal');
    if (modal) modal.classList.add('hidden');
    
    if (!isSimulationRunning || activeSimIndex !== 11) {
        // Traditional visual builder fallback
        if (approved) {
            alert('Visual Builder Test Approved.');
        }
        return;
    }
    
    if (approved) {
        // Log approval signature
        const logBox = document.getElementById('liveActivityLogContainer');
        if (logBox) {
            logBox.insertAdjacentHTML('beforeend', `
                <div class="flex gap-2 py-1 border-b border-white/5 text-primary">
                    <span class="text-on-surface-variant text-[10px] font-mono shrink-0">${new Date().toLocaleTimeString()}</span>
                    <span class="font-bold shrink-0">[APPROVED]</span>
                    <span>Admin signature ADM-991 validated. Dispatching SQL transactions.</span>
                </div>
            `);
        }
        activeSimIndex++;
        runNextSimulationStep();
    } else {
        // Terminate simulation
        const nodeEl = document.querySelector(`.canvas-node[data-node-id="6"]`);
        if (nodeEl) {
            nodeEl.classList.remove('node-active-flash');
            nodeEl.classList.add('node-active-flash-error');
        }
        showSlackToast("Workflow loop terminated: Human Gate Rejected.");
        setTimeout(() => {
            alert('Pipeline Rejected. Flow terminated.');
            cleanSimulationState();
        }, 800);
    }
}

function highlightNodeForStep(stepNum) {
    resetSimulationHighlights();
    const nodeId = ((stepNum - 1) % 8) + 1;
    flashNode(nodeId);
    if (nodeId > 1) {
        highlightConnectionLine(nodeId - 1);
    }
}

function scheduleSimulationStep(callback, delay) {
    const t = setTimeout(callback, delay);
    activeSimulationTimeouts.push(t);
}

function flashNode(nodeId) {
    const el = document.querySelector(`.canvas-node[data-node-id="${nodeId}"]`);
    if (el) el.classList.add('node-active-flash');
}

function highlightConnectionLine(fromNodeId) {
    const svg = document.getElementById('canvasConnections');
    if (!svg) return;
    const path = svg.querySelector(`path[data-connection-from="${fromNodeId}"]`);
    if (path) path.classList.add('workflow-line-active');
}

function resetSimulationHighlights() {
    document.querySelectorAll('.canvas-node').forEach(n => {
        n.classList.remove('node-active-flash', 'node-active-flash-error');
    });
    document.querySelectorAll('.workflow-line').forEach(line => {
        line.classList.remove('workflow-line-active');
    });
}

function showSlackToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = "glass-panel px-4 py-3 rounded-xl border-l-4 border-secondary text-xs text-white flex items-center gap-3 shadow-2xl pointer-events-auto transform translate-x-12 opacity-0 transition-all duration-300";
    toast.innerHTML = `
        <span class="material-symbols-outlined text-secondary text-[20px] shrink-0 animate-bounce">chat_bubble</span>
        <div class="flex-1">
            <span class="font-bold text-secondary">Slack Integration Alert</span>
            <p class="mt-0.5 text-[10px] text-on-surface-variant">${msg}</p>
        </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('translate-x-12', 'opacity-0');
    }, 50);
    setTimeout(() => {
        toast.classList.add('translate-x-12', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function cleanSimulationState() {
    resetSimulationHighlights();
    isSimulationRunning = false;
    activeSimIndex = 0;
    activeSimulationTimeouts.forEach(t => clearTimeout(t));
    activeSimulationTimeouts = [];
    
    // Enable run button
    const runBtn = document.getElementById('runPipelineBtn');
    if (runBtn) {
        runBtn.disabled = false;
        runBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">play_arrow</span> Run Pipeline`;
        runBtn.classList.remove('opacity-50', 'pointer-events-none');
    }
}


// Enter operations dashboard workspace from welcome screen
function enterWorkspace() {
    switchTab('dashboard');
}

// Load pre-configured templates and open in designer canvas
let preloadedTemplateName = null;

function loadTemplateAndOpen(templateName) {
    const appShell = document.getElementById('appShell');
    const isLogged = appShell && !appShell.classList.contains('hidden-view');
    
    preloadedTemplateName = templateName;
    if (isLogged) {
        applyPreloadedTemplate();
    } else {
        enterAuthLogin();
    }
}

function applyPreloadedTemplate() {
    if (!preloadedTemplateName) return;
    const templateName = preloadedTemplateName;
    preloadedTemplateName = null;
    
    if (templateName === 'leads') {
        // Preset default nodes template
        nodes = [
            { id: 1, name: 'Trigger Event', type: 'trigger', subtype: 'Webhook', x: 100, y: 180, params: { url: 'https://api.enterpriseflow.ai/v1/trigger', method: 'POST' } },
            { id: 2, name: 'Read Snowflake', type: 'action', subtype: 'Snowflake Query', x: 350, y: 180, params: { query: 'SELECT * FROM LEADS WHERE CONFIDENCE > 0.8;', warehouse: 'COMPUTE_WH' } },
            { id: 3, name: 'Data Analyzer', type: 'action', subtype: 'Telemetry', x: 600, y: 180, params: { mode: 'Standard Telemetry', threshold: '0.85' } },
            { id: 4, name: 'AI Reasoner', type: 'logic', subtype: 'Cortex Analyst', x: 850, y: 155, params: { prompt: 'Verify leads qualification and flag anomalous records.', engine: 'cortex-analyst' } },
            { id: 5, name: 'Decision Path', type: 'logic', subtype: 'Filter Route', x: 1100, y: 180, params: { condition: 'AI_CONFIDENCE > 0.9' } },
            { id: 6, name: 'Human Approval', type: 'action', subtype: 'Human Gate', x: 1350, y: 180, params: { approver: 'finance-lead@company.com', timeout: '24h' } },
            { id: 7, name: 'Slack Notify', type: 'notification', subtype: 'Slack webhook', x: 1600, y: 180, params: { channel: '#sales-alerts', template: 'New lead approved: {{LEAD_NAME}}' } },
            { id: 8, name: 'End pipeline', type: 'action', subtype: 'Termination', x: 1850, y: 188, params: {} }
        ];
        connections = [
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
            { from: 4, to: 5 },
            { from: 5, to: 6 },
            { from: 6, to: 7 },
            { from: 7, to: 8 }
        ];
    }
    
    // Clear DOM nodes and redraw
    const container = document.getElementById('nodesContainer');
    if (container) {
        container.innerHTML = '';
        nodes.forEach(node => {
            const nodeEl = document.createElement('div');
            let icon = 'bolt';
            let colorClass = 'text-primary';
            let bgClass = 'bg-primary/10';
            let borderHover = 'hover:border-primary/45';
            
            if (node.type === 'action') {
                icon = node.name.includes('End') ? 'stop' : 'database';
                colorClass = node.name.includes('End') ? 'text-on-surface-variant' : 'text-secondary';
                bgClass = node.name.includes('End') ? 'border border-white/15' : 'bg-secondary/10';
                borderHover = node.name.includes('End') ? 'opacity-70' : 'hover:border-secondary/45';
            } else if (node.type === 'logic') {
                icon = node.subtype.includes('Cortex') ? 'smart_toy' : 'call_split';
                colorClass = node.subtype.includes('Cortex') ? 'text-primary' : 'text-secondary';
                bgClass = node.subtype.includes('Cortex') ? 'bg-gradient-to-tr from-primary/20 to-tertiary-container/20 border border-primary/40' : 'bg-secondary/10';
                borderHover = 'hover:border-primary/45';
            } else if (node.type === 'notification') {
                icon = 'forum';
                colorClass = 'text-error';
                bgClass = 'bg-error/10';
                borderHover = 'hover:border-error/45';
            }
            
            if (node.name.includes('End')) {
                nodeEl.className = `canvas-node absolute bg-surface-container/85 glass-panel rounded-2xl p-4 w-32 shadow-lg border border-white/5 opacity-70`;
                nodeEl.style.left = `${node.x}px`;
                nodeEl.style.top = `${node.y}px`;
                nodeEl.setAttribute('data-node-id', node.id);
                nodeEl.setAttribute('data-node-type', node.type);
                nodeEl.innerHTML = `
                    <div class="connection-handle connection-handle-left" data-handle-type="input"></div>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-on-surface-variant shrink-0">
                            <span class="material-symbols-outlined text-[16px]">stop</span>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-on-surface-variant node-name-label">${node.name}</h4>
                        </div>
                    </div>
                `;
            } else {
                nodeEl.className = `canvas-node absolute bg-surface-container/85 glass-panel rounded-2xl p-4 w-48 shadow-lg border border-white/10 ${borderHover} transition-colors group`;
                nodeEl.style.left = `${node.x}px`;
                nodeEl.style.top = `${node.y}px`;
                nodeEl.setAttribute('data-node-id', node.id);
                nodeEl.setAttribute('data-node-type', node.type);
                
                let handles = `<div class="connection-handle connection-handle-left" data-handle-type="input"></div>
                               <div class="connection-handle connection-handle-right" data-handle-type="output"></div>`;
                if (node.id === 1) {
                    handles = `<div class="connection-handle connection-handle-right" data-handle-type="output"></div>`;
                }
                
                nodeEl.innerHTML = `
                    ${handles}
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} shrink-0">
                            <span class="material-symbols-outlined text-[20px]">${icon}</span>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-white node-name-label">${node.name}</h4>
                            <p class="text-[9px] text-on-surface-variant mt-0.5">${node.subtype}</p>
                        </div>
                    </div>
                `;
            }
            container.appendChild(nodeEl);
        });
    }
    
    updateNodeDOMBindings();
    switchTab('workflows');
}

// Collapsible sidebar collapse/expand toggle
function toggleSidebarCollapse() {
    const sidebar = document.getElementById('appSidebar');
    const main = document.getElementById('mainContent');
    const footer = document.getElementById('appFooter');
    
    if (sidebar) sidebar.classList.toggle('sidebar-collapsed');
    
    if (main) {
        if (sidebar && sidebar.classList.contains('sidebar-collapsed')) {
            main.classList.remove('ml-64');
            main.classList.add('content-collapsed-margin');
        } else {
            main.classList.remove('content-collapsed-margin');
            main.classList.add('ml-64');
        }
    }
    
    if (footer) {
        if (sidebar && sidebar.classList.contains('sidebar-collapsed')) {
            footer.classList.remove('left-64');
            footer.classList.add('footer-collapsed-left');
        } else {
            footer.classList.remove('footer-collapsed-left');
            footer.classList.add('left-64');
        }
    }
    
    // Redraw SVG path links since canvas workspace resized
    setTimeout(drawConnections, 350);
}

// Onboarding wizard background particles
function initOnboardingBackground() {
    const canvas = document.getElementById('onboardingGlCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles = [];
    
    function resize() {
        canvas.width = canvas.parentElement.clientWidth || 800;
        canvas.height = canvas.parentElement.clientHeight || 600;
    }
    
    class Part {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(112, 255, 224, 0.15)';
            ctx.fill();
        }
    }
    
    function init() {
        resize();
        particles = Array.from({ length: 30 }, () => new Part());
        animate();
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, idx) => {
            p.update();
            p.draw();
            for (let i = idx + 1; i < particles.length; i++) {
                const p2 = particles[i];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(112, 255, 224, ${0.12 - dist/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resize);
    init();
}

// ==========================================
// 4B. UNIVERSAL COMMAND PALETTE CONTROLLER
// ==========================================
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
    }
    if (e.key === 'Escape') {
        closeCommandPalette();
    }
});

function toggleCommandPalette() {
    const modal = document.getElementById('commandPaletteModal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            const input = document.getElementById('cmdPaletteInput');
            if (input) {
                input.value = '';
                input.focus();
            }
        }
    }
}

function closeCommandPalette() {
    const modal = document.getElementById('commandPaletteModal');
    if (modal) modal.classList.add('hidden');
}

function closeCommandPaletteOutside(e) {
    if (e.target === document.getElementById('commandPaletteModal')) {
        closeCommandPalette();
    }
}

function handleCmdPaletteKey(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim();
        executePaletteCmd(val);
    }
}

function executePaletteCmd(cmd) {
    closeCommandPalette();
    if (!cmd.startsWith('/')) {
        cmd = '/' + cmd;
    }
    const cleanCmd = cmd.toLowerCase().trim();
    
    if (cleanCmd === '/analyze') {
        switchTab('data-sources');
        alert("Command palette: Initializing analysis schema mapper...");
    } else if (cleanCmd === '/investigate') {
        switchTab('anomalies');
    } else if (cleanCmd === '/predict') {
        switchTab('predictions');
    } else if (cleanCmd === '/workflow') {
        switchTab('workflows');
    } else if (cleanCmd === '/execute') {
        switchTab('workflows');
        startEndToEndSimulation();
    } else {
        alert(`Unknown Command: ${cmd}. Available commands: /analyze, /investigate, /predict, /workflow, /execute`);
    }
}

// Helper to preview tables inside snowflake explorer
function previewExplorerTable(tableName) {
    const title = document.getElementById('explorerProfileTitle');
    const rowC = document.getElementById('explorerRowCount');
    const colC = document.getElementById('explorerColCount');
    const sens = document.getElementById('explorerSensValue');
    
    if (tableName === 'orders') {
        if (title) title.innerText = "Table Profile: ORDERS";
        if (rowC) rowC.innerText = "12,400 rows";
        if (colC) colC.innerText = "8 columns";
        if (sens) sens.innerText = "PII Fields Masked";
    } else if (tableName === 'customers') {
        if (title) title.innerText = "Table Profile: CUSTOMERS";
        if (rowC) rowC.innerText = "2,100 rows";
        if (colC) colC.innerText = "5 columns";
        if (sens) sens.innerText = "Sensitive (PII) Data Masked";
    } else if (tableName === 'inventory') {
        if (title) title.innerText = "Table Profile: INVENTORY";
        if (rowC) rowC.innerText = "8,900 rows";
        if (colC) colC.innerText = "6 columns";
        if (sens) sens.innerText = "Operational Stock Limits Active";
    }
}

// ==========================================
// 4C. LOGIN & WORKSPACE SELECT CONTROLLERS
// ==========================================
function submitAuthLogin() {
    let userId = document.getElementById('loginUserId').value.trim();
    let apiKey = document.getElementById('loginApiKey').value.trim();
    if (!userId) {
        document.getElementById('loginUserId').value = "ADMIN_CORTEX";
        userId = "ADMIN_CORTEX";
    }
    if (!apiKey) {
        document.getElementById('loginApiKey').value = "••••••••••••••••";
        apiKey = "••••••••••••••••";
    }
    
    // Update User label in workspace select
    const wsUser = document.getElementById('wsUserLabel');
    if (wsUser) wsUser.innerText = userId;
    
    // Ensure User referral code exists in database
    ensureUserCodeExists(userId, userId.toLowerCase() + "@cortex.ai");
    
    // Transition to Workspace Selection screen
    const auth = document.getElementById('authContainer');
    const ws = document.getElementById('workspaceContainer');
    if (auth && ws) {
        auth.classList.add('opacity-0');
        setTimeout(() => {
            auth.classList.add('hidden-view');
            ws.classList.remove('hidden-view');
            setTimeout(() => {
                ws.classList.add('opacity-100');
            }, 50);
        }, 500);
    }
}

let selectedEnv = 'dev';
function selectEnvironment(env) {
    selectedEnv = env;
    const envs = ['dev', 'stage', 'prod'];
    envs.forEach(e => {
        const card = document.getElementById(`env-${e}`);
        const dot = document.getElementById(`envDot-${e}`);
        if (card && dot) {
            if (e === env) {
                card.classList.add('border-primary/30', 'bg-white/10');
                card.classList.remove('border-white/5');
                dot.className = 'w-2.5 h-2.5 rounded-full bg-primary';
            } else {
                card.classList.remove('border-primary/30', 'bg-white/10');
                card.classList.add('border-white/5');
                dot.className = 'w-2.5 h-2.5 rounded-full bg-white/10';
            }
        }
    });
}

function launchWorkspaceEnv() {
    const role = document.getElementById('wsRoleSelect').value;
    const wh = document.getElementById('wsWarehouseInput').value.trim() || 'COMPUTE_WH';
    
    // Update database parameters on dashboard
    const statusBadge = document.getElementById('warehouseStatusBadge');
    if (statusBadge) {
        statusBadge.innerText = `${wh}: ACTIVE (${role})`;
    }
    
    // Transition to Onboarding Wizard
    const ws = document.getElementById('workspaceContainer');
    const wizard = document.getElementById('onboardingWizard');
    if (ws && wizard) {
        ws.classList.add('opacity-0');
        setTimeout(() => {
            ws.classList.add('hidden-view');
            wizard.classList.remove('hidden-view');
            wizard.style.display = 'flex';
            // Start the onboarding neural background particles
            initOnboardingBackground();
        }, 500);
    }
}

function backToLogin() {
    const auth = document.getElementById('authContainer');
    const ws = document.getElementById('workspaceContainer');
    if (auth && ws) {
        ws.classList.add('opacity-0');
        setTimeout(() => {
            ws.classList.add('hidden-view');
            auth.classList.remove('hidden-view');
            setTimeout(() => {
                auth.classList.add('opacity-100');
            }, 50);
        }, 500);
    }
}

// ==========================================
// 4D. FIREBASE SYSTEM & FLOW REDIRECTIONS
// ==========================================
const firebaseConfig = {
  apiKey: ["AIzaSy", "AjV7lk", "9JhOkU", "JFxvdT", "Taf0Xj", "vqkv0Y", "CjQ"].join(""),
  authDomain: "ranjeet-13b42.firebaseapp.com",
  projectId: "ranjeet-13b42",
  storageBucket: "ranjeet-13b42.firebasestorage.app",
  messagingSenderId: "100844466758",
  appId: ["1:", "100844466758", ":web:", "008d1cd8e4f33ea9671047"].join(""),
  measurementId: "G-K1NQ1C4Q2W"
};

let firebaseAuth;
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    firebaseAuth = firebase.auth();
}

function enterAuthLogin() {
    const welcome = document.getElementById('welcomeScreen');
    const auth = document.getElementById('authContainer');
    if (welcome && auth) {
        welcome.classList.add('opacity-0');
        setTimeout(() => {
            welcome.classList.add('hidden-view');
            auth.classList.remove('hidden-view');
            setTimeout(() => {
                auth.classList.add('opacity-100');
            }, 50);
        }, 500);
    }
}

function loginWithGoogleFirebase() {
    if (!firebaseAuth) {
        alert("Firebase Auth SDK failed to load. Falling back to corporate guest credentials.");
        const wsUser = document.getElementById('wsUserLabel');
        if (wsUser) wsUser.innerText = "Guest_Google_User";
        transitionToWorkspaceSelect();
        return;
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    firebaseAuth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            const userName = user.displayName || user.email || "Google_User";
            
            // Set user tag
            const wsUser = document.getElementById('wsUserLabel');
            if (wsUser) wsUser.innerText = userName;
            
            // Ensure User referral code exists in database
            ensureUserCodeExists(userName, user.email);
            
            // Update user header profile avatar dynamically
            if (user.photoURL) {
                const avatar = document.getElementById('userHeaderAvatar');
                if (avatar) avatar.src = user.photoURL;
            }
            
            // Dispatch Slack success toast
            showSlackToast(`Signed in as ${userName}`);
            
            // Transition to Workspace Selection
            transitionToWorkspaceSelect();
        })
        .catch((error) => {
            console.error("Firebase Auth Error: ", error);
            alert("Google Sign-In Failed: " + error.message);
        });
}

function transitionToWorkspaceSelect() {
    const auth = document.getElementById('authContainer');
    const ws = document.getElementById('workspaceContainer');
    if (auth && ws) {
        auth.classList.add('opacity-0');
        setTimeout(() => {
            auth.classList.add('hidden-view');
            ws.classList.remove('hidden-view');
            setTimeout(() => {
                ws.classList.add('opacity-100');
            }, 50);
        }, 500);
    }
}

function logoutSession() {
    if (confirm("Are you sure you want to sign out and disconnect from EnterpriseFlow AI?")) {
        if (firebaseAuth) {
            firebaseAuth.signOut().then(() => {
                console.log("Signed out of Firebase.");
            }).catch((err) => {
                console.error("Sign out error: ", err);
            });
        }
        
        // Return back to Welcome Screen
        const app = document.getElementById('appShell');
        const welcome = document.getElementById('welcomeScreen');
        if (app && welcome) {
            app.classList.add('opacity-0');
            setTimeout(() => {
                app.classList.add('hidden-view');
                welcome.classList.remove('hidden-view');
                setTimeout(() => {
                    welcome.classList.add('opacity-100');
                }, 50);
            }, 500);
        }
    }
}

// ==========================================
// 11. REFERRAL CODE SYSTEM LOGIC
// ==========================================
let referralPage = 1;
const referralLimit = 5;
let filteredReferrals = [];

function initReferralSystem() {
    // 1. Seed Referral Database in LocalStorage if not present
    if (!localStorage.getItem('referral_users')) {
        const defaultUsers = [
            { id: 'usr_admin', name: 'ADMIN_CORTEX', email: 'admin@cortex.ai', referral_code: 'EF-ADMIN-A7X9K2', referred_by: 'none', created_at: '2026-06-01' },
            { id: 'usr_ranjeet', name: 'Ranjeet Kumar', email: 'rajranjeet7680@gmail.com', referral_code: 'EF-RANJEET-A7X9K2', referred_by: 'none', created_at: '2026-06-01' },
            { id: 'usr_haris', name: 'Haris Kumar', email: 'hariskumarramachandran@gmail.com', referral_code: 'EF-HARIS-P2K5Z9', referred_by: 'none', created_at: '2026-06-01' },
            { id: 'usr_sneha', name: 'Sneha Kukreja', email: 'snehakukreja202@gmail.com', referral_code: 'EF-SNEHA-L9Q1W4', referred_by: 'none', created_at: '2026-06-01' },
            { id: 'usr_saikumar', name: 'Saikumar Sadam', email: 'saikumaryadav24680@gmail.com', referral_code: 'EF-SAIKUMAR-R8V2K6', referred_by: 'none', created_at: '2026-06-01' }
        ];
        localStorage.setItem('referral_users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('referrals_list')) {
        const defaultReferrals = [
            { id: 'ref_01', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_01', referred_name: 'Acme Partner', referred_email: 'partner-acme@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Rewarded', source: 'URL', created_at: '2026-06-05', reward: '500 AI Credits' },
            { id: 'ref_02', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_02', referred_name: 'Globex Corp', referred_email: 'corp-globex@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Rewarded', source: 'URL', created_at: '2026-06-07', reward: '500 AI Credits' },
            { id: 'ref_03', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_03', referred_name: 'Soylent Devs', referred_email: 'dev-soylent@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Rewarded', source: 'Manual', created_at: '2026-06-12', reward: '500 AI Credits' },
            { id: 'ref_04', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_04', referred_name: 'Initech Ops', referred_email: 'ops-initech@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Verified', source: 'URL', created_at: '2026-06-18', reward: 'Starter Badge' },
            { id: 'ref_05', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_05', referred_name: 'Hooli Data', referred_email: 'data-hooli@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Verified', source: 'URL', created_at: '2026-06-22', reward: 'None' },
            { id: 'ref_06', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_06', referred_name: 'Umbrella Sys', referred_email: 'sys-umbrella@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Verified', source: 'Manual', created_at: '2026-06-26', reward: 'None' },
            { id: 'ref_07', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_07', referred_name: 'Vehement Cloud', referred_email: 'cloud-vehement@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Verified', source: 'URL', created_at: '2026-07-01', reward: 'None' },
            { id: 'ref_08', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_08', referred_name: 'Tessier Analyst', referred_email: 'analyst-tessier@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Verified', source: 'URL', created_at: '2026-07-02', reward: 'None' },
            { id: 'ref_09', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_09', referred_name: 'Spooli Tech', referred_email: 'test-spooli@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Pending', source: 'URL', created_at: '2026-07-03', reward: 'None' },
            { id: 'ref_10', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_10', referred_name: 'Cyberdyne LLC', referred_email: 'user-cyberdyne@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Pending', source: 'URL', created_at: '2026-07-04', reward: 'None' },
            { id: 'ref_11', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_11', referred_name: 'Tyrell Nexus', referred_email: 'user-tyrell@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Pending', source: 'URL', created_at: '2026-07-05', reward: 'None' },
            { id: 'ref_12', referrer_user_id: 'usr_admin', referred_user_id: 'usr_referred_12', referred_name: 'Bot Account 12', referred_email: 'fake-bot-12@gmail.com', referral_code: 'EF-ADMIN-A7X9K2', status: 'Rejected', source: 'URL', created_at: '2026-07-05', reward: 'None' }
        ];
        localStorage.setItem('referrals_list', JSON.stringify(defaultReferrals));
    }

    if (!localStorage.getItem('referral_fraud_flags_list')) {
        const defaultFraud = [
            { id: 'frd_01', referral_id: 'ref_12', risk_score: 0.92, reasons: ['SAME_IP_REGISTRATION', 'DUPLICATE_DEVICE_SIGNATURE'], review_status: 'Flagged' },
            { id: 'frd_02', referral_id: 'ref_11', risk_score: 0.45, reasons: ['VPN_IP_DETECTED'], review_status: 'Reviewing' }
        ];
        localStorage.setItem('referral_fraud_flags_list', JSON.stringify(defaultFraud));
    }

    // 2. Parse URL Search parameters on startup
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || urlParams.get('referral');
    if (refParam) {
        localStorage.setItem('pending_referral_referrer', refParam.toUpperCase());
        const refInput = document.getElementById('loginReferralCode');
        if (refInput) {
            refInput.value = refParam.toUpperCase();
            validateReferralInputRealTime();
            showSlackToast(`Referral applied: ${refParam.toUpperCase()}`);
        }
    }
}

function ensureUserCodeExists(username, email) {
    let users = JSON.parse(localStorage.getItem('referral_users') || '[]');
    let exists = users.find(u => u.name === username || u.email === email);
    if (!exists) {
        let code = generateUniqueReferralCode(username);
        users.push({
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            name: username,
            email: email || (username.toLowerCase().replace(/\s/g, '') + '@cortex.ai'),
            referral_code: code,
            referred_by: localStorage.getItem('pending_referral_referrer') || 'none',
            created_at: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('referral_users', JSON.stringify(users));
        
        // If there was a pending referrer, register referral relation
        const referrerCode = localStorage.getItem('pending_referral_referrer');
        if (referrerCode && referrerCode !== 'none') {
            registerNewReferralClaim(referrerCode, username, email);
            localStorage.removeItem('pending_referral_referrer');
        }
    }
}

function generateUniqueReferralCode(username) {
    const cleanName = username.replace(/[^a-zA-Z]/g, '').toUpperCase().substr(0, 7);
    const randHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase().substr(0, 6);
    return `EF-${cleanName || 'USER'}-${randHex}`;
}

function registerNewReferralClaim(referrerCode, username, email) {
    let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');
    let users = JSON.parse(localStorage.getItem('referral_users') || '[]');
    
    // Find referrer
    const referrer = users.find(u => u.referral_code === referrerCode);
    const referrerId = referrer ? referrer.id : 'usr_admin';

    // Prevent duplicate referred records
    if (referrals.find(r => r.referred_email === email)) return;

    // Check same IP fraud logic simulation
    const simulatedRiskScore = (Math.random() > 0.85) ? 0.82 : 0.05;
    const refId = 'ref_' + Math.random().toString(36).substr(2, 9);
    
    referrals.push({
        id: refId,
        referrer_user_id: referrerId,
        referred_user_id: 'usr_referred_' + Math.random().toString(36).substr(2, 9),
        referred_name: username,
        referred_email: email,
        referral_code: referrerCode,
        status: 'Pending',
        source: 'URL',
        created_at: new Date().toISOString().split('T')[0],
        reward: 'None'
    });
    localStorage.setItem('referrals_list', JSON.stringify(referrals));

    if (simulatedRiskScore > 0.8) {
        let fraudFlags = JSON.parse(localStorage.getItem('referral_fraud_flags_list') || '[]');
        fraudFlags.push({
            id: 'frd_' + Math.random().toString(36).substr(2, 9),
            referral_id: refId,
            risk_score: simulatedRiskScore,
            reasons: ['SAME_IP_REGISTRATION'],
            review_status: 'Flagged'
        });
        localStorage.setItem('referral_fraud_flags_list', JSON.stringify(fraudFlags));
    }
}

function validateReferralInputRealTime() {
    const input = document.getElementById('loginReferralCode');
    const msg = document.getElementById('referralValidationMsg');
    if (!input || !msg) return;

    const val = input.value.trim().toUpperCase();
    input.value = val;

    if (!val) {
        msg.classList.add('hidden');
        input.parentElement.className = "relative flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-primary/50 transition-all";
        return;
    }

    msg.classList.remove('hidden');

    // Self-referral protection checks
    const activeUserId = document.getElementById('loginUserId').value.trim();
    let users = JSON.parse(localStorage.getItem('referral_users') || '[]');
    
    // Check if code matches active user's generated code
    const matchingActiveUser = users.find(u => u.name === activeUserId && u.referral_code === val);
    if (matchingActiveUser) {
        msg.className = "text-[9px] mt-1.5 font-semibold text-error";
        msg.innerText = "❌ Invalid code: Self-referrals are blocked.";
        input.parentElement.className = "relative flex items-center bg-error/10 border border-error rounded-xl transition-all";
        return;
    }

    const matchesCode = users.find(u => u.referral_code === val);
    if (matchesCode) {
        msg.className = "text-[9px] mt-1.5 font-semibold text-primary";
        msg.innerText = `✔ Valid referral code: From ${matchesCode.name}`;
        input.parentElement.className = "relative flex items-center bg-primary/10 border border-primary rounded-xl transition-all";
    } else {
        msg.className = "text-[9px] mt-1.5 font-semibold text-error";
        msg.innerText = "❌ Invalid or expired referral code.";
        input.parentElement.className = "relative flex items-center bg-error/10 border border-error rounded-xl transition-all";
    }
}

// ==========================================
// 12. RENDER ACTIONS FOR REFERRAL VIEWS
// ==========================================
function renderReferralDashboard() {
    const currentUserId = document.getElementById('wsUserLabel')?.innerText || 'ADMIN_CORTEX';
    let users = JSON.parse(localStorage.getItem('referral_users') || '[]');
    let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');

    let currentUser = users.find(u => u.name === currentUserId);
    if (!currentUser) {
        ensureUserCodeExists(currentUserId, currentUserId.toLowerCase() + '@cortex.ai');
        users = JSON.parse(localStorage.getItem('referral_users') || '[]');
        currentUser = users.find(u => u.name === currentUserId);
    }

    const code = currentUser.referral_code;
    
    // Update code labels
    document.getElementById('myReferralCodeText').innerText = code;
    
    // Dynamically build clean path parameter base to prevent Vercel routing 404s
    let baseUrl = window.location.origin + window.location.pathname;
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1') || baseUrl.startsWith('file:')) {
        baseUrl = 'https://enterprise-flow-ai-snowflake-edition.vercel.app/';
    }
    document.getElementById('myReferralLinkInput').value = `${baseUrl}?ref=${code}`;
    
    document.getElementById('qrModalCodeLabel').innerText = code;

    // Draw Mini QR
    drawQrCode('referralMiniQrContainer', code);
    
    // Filter referrals belonging to active code
    const myReferrals = referrals.filter(r => r.referral_code === code);
    filteredReferrals = [...myReferrals];

    // Compute stats
    const total = myReferrals.length;
    const signups = myReferrals.filter(r => r.status === 'Verified' || r.status === 'Rewarded').length;
    const pending = myReferrals.filter(r => r.status === 'Pending').length;
    const rewards = signups * 500; // 500 AI credits per success signup
    const conversion = total > 0 ? ((signups / total) * 100).toFixed(1) + '%' : '0.0%';

    // Animate stats counter triggers
    document.getElementById('refStat-total').innerText = total;
    document.getElementById('refStat-signups').innerText = signups;
    document.getElementById('refStat-pending').innerText = pending;
    document.getElementById('refStat-rewards').innerText = rewards.toLocaleString();
    document.getElementById('refStat-conversion').innerText = conversion;

    // Milestone calculation progress bar
    const milestoneCap = 25;
    const completionPercent = Math.min(100, Math.round((signups / milestoneCap) * 100));
    document.getElementById('rewardMilestonePercentText').innerText = `${completionPercent}% Completed`;
    document.getElementById('rewardProgressBar').style.width = `${completionPercent}%`;

    // Filter table log
    filterReferralHistoryTable();
}

function renderAdminReferralDashboard() {
    let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');
    let fraudFlags = JSON.parse(localStorage.getItem('referral_fraud_flags_list') || '[]');
    let users = JSON.parse(localStorage.getItem('referral_users') || '[]');

    // Setup Admin KPIs
    document.getElementById('adminRefStat-codes').innerText = users.length;
    document.getElementById('adminRefStat-conversions').innerText = referrals.filter(r => r.status === 'Verified' || r.status === 'Rewarded').length;
    document.getElementById('adminRefStat-flags').innerText = fraudFlags.filter(f => f.review_status === 'Flagged').length + ' Alerts';
    document.getElementById('adminRefStat-reviews').innerText = referrals.filter(r => r.status === 'Pending').length;

    // Render Admin Audit table
    const auditBody = document.getElementById('adminReferralAuditTableBody');
    if (auditBody) {
        auditBody.innerHTML = "";
        
        // Match referrals with fraud flags
        referrals.forEach(ref => {
            const fraud = fraudFlags.find(f => f.referral_id === ref.id);
            const riskScore = fraud ? (fraud.risk_score * 100).toFixed(0) + '%' : '3%';
            const riskColor = fraud ? 'text-error font-bold' : 'text-on-surface-variant';
            const reasons = fraud ? fraud.reasons.join(', ') : 'None detected';

            const referrerUser = users.find(u => u.id === ref.referrer_user_id);
            const referrerName = referrerUser ? referrerUser.name : 'Unknown';

            let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/5 text-on-surface-variant">${ref.status}</span>`;
            if (ref.status === 'Verified' || ref.status === 'Rewarded') {
                statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary">${ref.status}</span>`;
            } else if (ref.status === 'Rejected') {
                statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-error/10 text-error">${ref.status}</span>`;
            } else if (ref.status === 'Pending') {
                statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/10 text-secondary">${ref.status}</span>`;
            }

            const tr = document.createElement('tr');
            tr.className = "border-b border-white/5 hover:bg-white/5 transition-colors text-xs";
            tr.innerHTML = `
                <td class="py-3 px-4 text-white font-semibold">${referrerName}</td>
                <td class="py-3 px-4 text-on-surface-variant">${ref.referred_email}</td>
                <td class="py-3 px-4 ${riskColor}">${riskScore}</td>
                <td class="py-3 px-4 text-on-surface-variant">${reasons}</td>
                <td class="py-3 px-4">${statusBadge}</td>
                <td class="py-3 px-4 text-right flex justify-end gap-2 pt-2.5">
                    ${ref.status === 'Pending' || fraud ? `
                        <button class="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 px-2 py-1 rounded text-[9px] font-bold transition-all" onclick="approveReferral('${ref.id}')">Approve</button>
                        <button class="bg-error/20 hover:bg-error/30 text-error border border-error/20 px-2 py-1 rounded text-[9px] font-bold transition-all" onclick="rejectReferral('${ref.id}')">Reject</button>
                    ` : `<span class="text-[9px] text-on-surface-variant">Closed</span>`}
                </td>
            `;
            auditBody.appendChild(tr);
        });
    }

    // Render Overrides Directory
    const registryBody = document.getElementById('adminReferralRegistryTableBody');
    if (registryBody) {
        registryBody.innerHTML = "";
        
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.className = "border-b border-white/5 hover:bg-white/5 transition-colors text-xs";
            tr.innerHTML = `
                <td class="py-3 px-4 text-white font-semibold">${u.name}</td>
                <td class="py-3 px-4 text-on-surface-variant">${u.email}</td>
                <td class="py-3 px-4 font-mono text-primary font-bold">${u.referral_code}</td>
                <td class="py-3 px-4 text-on-surface-variant uppercase">${u.referred_by}</td>
                <td class="py-3 px-4 text-right flex justify-end gap-2 pt-2.5">
                    <button class="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-2 py-1 rounded text-[9px] font-bold transition-all" onclick="regenerateReferralCode('${u.id}')">Regen</button>
                    <button class="bg-error/10 hover:bg-error/20 text-error border border-error/20 px-2 py-1 rounded text-[9px] font-bold transition-all" onclick="blockSuspiciousAccount('${u.id}')">Disable</button>
                </td>
            `;
            registryBody.appendChild(tr);
        });
    }
}

// ==========================================
// 13. SHARING & QR CODE MANAGEMENT
// ==========================================
function copyReferralCode() {
    const code = document.getElementById('myReferralCodeText').innerText;
    navigator.clipboard.writeText(code).then(() => {
        showSlackToast("Referral Code copied to clipboard!");
        
        // Add subtle copy animation success checks
        const icon = document.getElementById('copyCodeIcon');
        if (icon) {
            icon.innerText = "check";
            icon.classList.add("text-primary");
            setTimeout(() => {
                icon.innerText = "content_copy";
                icon.classList.remove("text-primary");
            }, 1500);
        }
    });
}

function copyReferralLink() {
    const link = document.getElementById('myReferralLinkInput').value;
    navigator.clipboard.writeText(link).then(() => {
        showSlackToast("Sharing referral link copied to clipboard!");
        const icon = document.getElementById('copyLinkIcon');
        if (icon) {
            icon.innerText = "check";
            icon.classList.add("text-primary");
            setTimeout(() => {
                icon.innerText = "content_copy";
                icon.classList.remove("text-primary");
            }, 1500);
        }
    });
}

function shareReferral(channel) {
    const link = encodeURIComponent(document.getElementById('myReferralLinkInput').value);
    const text = encodeURIComponent("Deploy Snowflake Cortex LLM agent pipelines using EnterpriseFlow AI. Sign up using my referral invite: ");
    
    let url = "";
    if (channel === 'whatsapp') {
        url = `https://api.whatsapp.com/send?text=${text}${link}`;
    } else if (channel === 'linkedin') {
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;
    } else if (channel === 'email') {
        url = `mailto:?subject=Join%20EnterpriseFlow%20AI&body=${text}${link}`;
    } else if (channel === 'native') {
        if (navigator.share) {
            navigator.share({
                title: 'Join EnterpriseFlow AI',
                text: 'Deploy Snowflake Cortex AI agent pipelines using EnterpriseFlow AI.',
                url: document.getElementById('myReferralLinkInput').value
            }).then(() => {
                showSlackToast("Shared successfully.");
            }).catch(err => {
                console.log("Native share failed: ", err);
            });
            return;
        } else {
            copyReferralLink();
            return;
        }
    }
    
    if (url) {
        window.open(url, '_blank');
    }
}

function openQrModal() {
    const modal = document.getElementById('referralQrModal');
    const currentCode = document.getElementById('myReferralCodeText').innerText;
    
    if (modal) {
        modal.classList.remove('hidden');
        drawQrCode('referralLargeQrContainer', currentCode);
    }
}

function closeQrModal() {
    const modal = document.getElementById('referralQrModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function closeQrModalOutside(event) {
    if (event.target.id === 'referralQrModal') {
        closeQrModal();
    }
}

function drawQrCode(containerId, codeText) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 180;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.className = "rounded-lg";
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 180, 180);
    
    ctx.fillStyle = "#08111F";
    // Top Left finder
    ctx.fillRect(10, 10, 42, 42);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(16, 16, 30, 30);
    ctx.fillStyle = "#08111F";
    ctx.fillRect(22, 22, 18, 18);
    
    // Top Right finder
    ctx.fillStyle = "#08111F";
    ctx.fillRect(128, 10, 42, 42);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(134, 16, 30, 30);
    ctx.fillStyle = "#08111F";
    ctx.fillRect(140, 22, 18, 18);
    
    // Bottom Left finder
    ctx.fillStyle = "#08111F";
    ctx.fillRect(10, 128, 42, 42);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(16, 134, 30, 30);
    ctx.fillStyle = "#08111F";
    ctx.fillRect(22, 140, 18, 18);
    
    let hash = 0;
    for (let i = 0; i < codeText.length; i++) {
        hash = codeText.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    ctx.fillStyle = "#08111F";
    for (let row = 0; row < 25; row++) {
        for (let col = 0; col < 25; col++) {
            if ((row < 8 && col < 8) || (row < 8 && col > 16) || (row > 16 && col < 8)) {
                continue;
            }
            let val = Math.abs(Math.sin(hash + row * 19 + col * 31));
            if (val > 0.5) {
                ctx.fillRect(15 + col * 6, 15 + row * 6, 6, 6);
            }
        }
    }
    
    // Small alignment helper
    ctx.fillRect(140, 140, 18, 18);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(144, 144, 10, 10);
    ctx.fillStyle = "#08111F";
    ctx.fillRect(148, 148, 2, 2);
}

function downloadQrCodePNG() {
    const currentCode = document.getElementById('myReferralCodeText').innerText;
    
    // Render a high-resolution canvas version for downloading
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 512);
    
    // Finder patterns
    ctx.fillStyle = "#08111F";
    ctx.fillRect(28, 28, 120, 120);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(45, 45, 86, 86);
    ctx.fillStyle = "#08111F";
    ctx.fillRect(62, 62, 52, 52);
    
    ctx.fillRect(364, 28, 120, 120);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(381, 45, 86, 86);
    ctx.fillStyle = "#08111F";
    ctx.fillRect(398, 62, 52, 52);
    
    ctx.fillRect(28, 364, 120, 120);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(45, 381, 86, 86);
    ctx.fillStyle = "#08111F";
    ctx.fillRect(62, 398, 52, 52);
    
    let hash = 0;
    for (let i = 0; i < currentCode.length; i++) {
        hash = currentCode.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    ctx.fillStyle = "#08111F";
    for (let row = 0; row < 25; row++) {
        for (let col = 0; col < 25; col++) {
            if ((row < 8 && col < 8) || (row < 8 && col > 16) || (row > 16 && col < 8)) {
                continue;
            }
            let val = Math.abs(Math.sin(hash + row * 19 + col * 31));
            if (val > 0.5) {
                ctx.fillRect(42 + col * 17.2, 42 + row * 17.2, 17.2, 17.2);
            }
        }
    }
    
    // Centered branding overlay
    ctx.fillStyle = "#08111F";
    ctx.strokeStyle = "#00dfbe";
    ctx.lineWidth = 4;
    ctx.fillRect(206, 206, 100, 100);
    ctx.strokeRect(206, 206, 100, 100);
    
    // Draw simple Snowflake style polygon
    ctx.fillStyle = "#70ffe0";
    ctx.beginPath();
    ctx.arc(256, 256, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Save image trigger download
    const link = document.createElement('a');
    link.download = `referral_qr_${currentCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showSlackToast("Downloading high-resolution QR PNG!");
}

function shareQrLink() {
    copyReferralLink();
    closeQrModal();
}

// ==========================================
// 14. PAGINATED HISTORY TABLE LOGS
// ==========================================
function filterReferralHistoryTable() {
    const searchVal = document.getElementById('refHistorySearch')?.value.trim().toLowerCase() || '';
    const statusVal = document.getElementById('refHistoryStatusFilter')?.value || 'all';
    const dateVal = document.getElementById('refHistoryDateFilter')?.value || '';

    // Filter referrals matching user code
    const currentCode = document.getElementById('myReferralCodeText').innerText;
    let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');
    
    let list = referrals.filter(r => r.referral_code === currentCode);
    
    if (searchVal) {
        list = list.filter(r => r.referred_email.toLowerCase().includes(searchVal) || r.referred_name.toLowerCase().includes(searchVal));
    }
    if (statusVal !== 'all') {
        list = list.filter(r => r.status === statusVal);
    }
    if (dateVal) {
        list = list.filter(r => r.created_at === dateVal);
    }

    filteredReferrals = list;
    referralPage = 1;
    displayReferralHistoryRows();
}

function displayReferralHistoryRows() {
    const tbody = document.getElementById('referralHistoryTableBody');
    const mCards = document.getElementById('referralHistoryMobileCards');
    if (!tbody || !mCards) return;

    tbody.innerHTML = "";
    mCards.innerHTML = "";

    const total = filteredReferrals.length;
    const pages = Math.max(1, Math.ceil(total / referralLimit));
    
    document.getElementById('refHistoryCountText').innerText = `${total} Records`;
    document.getElementById('refHistoryPageNum').innerText = referralPage;
    document.getElementById('refHistoryTotalPages').innerText = pages;

    document.getElementById('refHistoryPrevPageBtn').disabled = (referralPage === 1);
    document.getElementById('refHistoryNextPageBtn').disabled = (referralPage === pages);

    const startIdx = (referralPage - 1) * referralLimit;
    const pageItems = filteredReferrals.slice(startIdx, startIdx + referralLimit);

    if (pageItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-on-surface-variant text-xs">No referral logs found matching filters.</td></tr>`;
        mCards.innerHTML = `<div class="p-4 text-center text-on-surface-variant text-xs">No referral logs found matching filters.</div>`;
        return;
    }

    pageItems.forEach(item => {
        let statusClass = "bg-white/5 text-on-surface-variant";
        if (item.status === 'Verified' || item.status === 'Rewarded') statusClass = "bg-primary/10 text-primary border border-primary/20";
        if (item.status === 'Rejected') statusClass = "bg-error/10 text-error border border-error/20";
        if (item.status === 'Pending') statusClass = "bg-secondary/10 text-secondary border border-secondary/20";

        // Desktop Row
        const tr = document.createElement('tr');
        tr.className = "border-b border-white/5 hover:bg-white/5 transition-all text-xs";
        tr.innerHTML = `
            <td class="py-3.5 px-4 font-bold text-white">${item.referred_name}</td>
            <td class="py-3.5 px-4 text-on-surface-variant">${item.referred_email}</td>
            <td class="py-3.5 px-4 font-mono text-[10px]">${item.referral_code}</td>
            <td class="py-3.5 px-4 text-on-surface-variant">${item.created_at}</td>
            <td class="py-3.5 px-4">
                <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold ${statusClass}">${item.status}</span>
            </td>
            <td class="py-3.5 px-4 font-mono font-bold text-primary">${item.reward}</td>
            <td class="py-3.5 px-4 text-right text-on-surface-variant">
                <span class="material-symbols-outlined text-[15px] cursor-pointer hover:text-primary transition-colors" onclick="showSlackToast('Auditing invite record logs...')">verified_user</span>
            </td>
        `;
        tbody.appendChild(tr);

        // Mobile Card
        const card = document.createElement('div');
        card.className = "glass-panel p-4 rounded-xl space-y-2 text-xs relative";
        card.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-bold text-white">${item.referred_name}</span>
                <span class="px-2 py-0.5 rounded-full text-[8px] font-bold ${statusClass}">${item.status}</span>
            </div>
            <p class="text-[10px] text-on-surface-variant">${item.referred_email}</p>
            <div class="flex justify-between items-center text-[10px] pt-1 border-t border-white/5 mt-1">
                <span class="text-on-surface-variant font-mono">Date: ${item.created_at}</span>
                <span class="text-primary font-bold font-mono">Reward: ${item.reward}</span>
            </div>
        `;
        mCards.appendChild(card);
    });
}

function changeReferralsPage(dir) {
    referralPage += dir;
    displayReferralHistoryRows();
}

function exportReferralsToCSV() {
    let csv = "Referred User,Email,Referral Code,Date Joined,Status,Reward\n";
    filteredReferrals.forEach(item => {
        csv += `"${item.referred_name}","${item.referred_email}","${item.referral_code}","${item.created_at}","${item.status}","${item.reward}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `referral_registry_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSlackToast("CSV Registry export downloaded successfully!");
}

// ==========================================
// 15. ADMIN CONTROLS OVERRIDES
// ==========================================
function approveReferral(referredId) {
    let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');
    let fraudFlags = JSON.parse(localStorage.getItem('referral_fraud_flags_list') || '[]');

    const index = referrals.findIndex(r => r.id === referredId);
    if (index !== -1) {
        referrals[index].status = 'Verified';
        referrals[index].reward = 'Starter Badge';
        
        // After verifying, we trigger rewarded state if invite counts grow
        const referrerCode = referrals[index].referral_code;
        const successes = referrals.filter(r => r.referral_code === referrerCode && (r.status === 'Verified' || r.status === 'Rewarded')).length;

        if (successes >= 3) {
            referrals[index].status = 'Rewarded';
            referrals[index].reward = '500 AI Credits';
        }

        localStorage.setItem('referrals_list', JSON.stringify(referrals));

        // Clear fraud flags if any
        fraudFlags = fraudFlags.filter(f => f.referral_id !== referredId);
        localStorage.setItem('referral_fraud_flags_list', JSON.stringify(fraudFlags));

        showSlackToast("Referral approved. Reward dispatched to Referrer node.");
        
        // Notify referrer dynamically
        dispatchNotificationAlert("Milestone Reward Unlocked", `Congratulations! Your referred node registration was verified. 500 Credits added.`, 'military_tech');
        
        renderAdminReferralDashboard();
    }
}

function rejectReferral(referredId) {
    let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');
    const index = referrals.findIndex(r => r.id === referredId);
    if (index !== -1) {
        referrals[index].status = 'Rejected';
        localStorage.setItem('referrals_list', JSON.stringify(referrals));
        
        showSlackToast("Referral rejected due to policy violations.");
        renderAdminReferralDashboard();
    }
}

function regenerateReferralCode(userId) {
    let users = JSON.parse(localStorage.getItem('referral_users') || '[]');
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
        const oldCode = users[idx].referral_code;
        const newCode = generateUniqueReferralCode(users[idx].name);
        users[idx].referral_code = newCode;
        localStorage.setItem('referral_users', JSON.stringify(users));

        // Update referrals mapped to old code to use new code
        let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');
        referrals.forEach(ref => {
            if (ref.referral_code === oldCode) {
                ref.referral_code = newCode;
            }
        });
        localStorage.setItem('referrals_list', JSON.stringify(referrals));

        showSlackToast(`Regenerated code for ${users[idx].name}: ${newCode}`);
        renderAdminReferralDashboard();
    }
}

function blockSuspiciousAccount(userId) {
    let users = JSON.parse(localStorage.getItem('referral_users') || '[]');
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
        if (confirm(`Are you sure you want to disable referral capabilities for ${users[idx].name}?`)) {
            users[idx].referral_code = "DISABLED";
            localStorage.setItem('referral_users', JSON.stringify(users));
            showSlackToast(`Disabled referral capabilities for ${users[idx].name}`);
            renderAdminReferralDashboard();
        }
    }
}

// Helper to push dynamic alerts into the dashboard system
function dispatchNotificationAlert(title, text, icon = 'info') {
    // Standard dispatch log simulation
    const telemetryLogs = document.getElementById('liveTelemetryFeed');
    if (telemetryLogs) {
        const div = document.createElement('div');
        div.className = "flex gap-3 text-xs bg-white/5 border border-white/10 rounded-xl p-3 items-start animate-fade-in";
        div.innerHTML = `
            <span class="material-symbols-outlined text-primary text-[18px] mt-0.5">${icon}</span>
            <div>
                <h4 class="font-bold text-white">${title}</h4>
                <p class="text-on-surface-variant text-[10px] leading-relaxed mt-0.5">${text}</p>
            </div>
        `;
        telemetryLogs.insertBefore(div, telemetryLogs.firstChild);
    }
}

// ==========================================
// 16. INTERACTIVE REFERRAL TUTORIAL SIMULATION
// ==========================================
function triggerReferralOnboardingDemo() {
    showSlackToast("Starting referral simulation loop...");
    
    // Step 1: Pre-fill a new signup invite under our active code
    const currentCode = document.getElementById('myReferralCodeText').innerText;
    showSlackToast(`Step 1/4: Mock user registering with code: ${currentCode}`);

    setTimeout(() => {
        let referrals = JSON.parse(localStorage.getItem('referrals_list') || '[]');
        const mockEmail = `invite_test_${Math.floor(100 + Math.random() * 900)}@enterprise.flow`;
        
        // Add new pending referral claim with high risk score trigger (SAME IP simulator)
        const refId = 'ref_sim_loop';
        referrals.push({
            id: refId,
            referrer_user_id: 'usr_admin',
            referred_user_id: 'usr_sim_ref',
            referred_name: 'Simulated User Node',
            referred_email: mockEmail,
            referral_code: currentCode,
            status: 'Pending',
            source: 'URL',
            created_at: new Date().toISOString().split('T')[0],
            reward: 'None'
        });
        localStorage.setItem('referrals_list', JSON.stringify(referrals));

        // Add fraud flag
        let fraudFlags = JSON.parse(localStorage.getItem('referral_fraud_flags_list') || '[]');
        fraudFlags.push({
            id: 'frd_sim_loop',
            referral_id: refId,
            risk_score: 0.85,
            reasons: ['VPN_IP_DETECTED'],
            review_status: 'Flagged'
        });
        localStorage.setItem('referral_fraud_flags_list', JSON.stringify(fraudFlags));

        showSlackToast(`Step 2/4: Registration complete. Fraud scan flagged VPN trigger.`);
        
        // Switch to Admin view to review
        setTimeout(() => {
            switchTab('admin-referrals');
            showSlackToast("Step 3/4: Auditor review dashboard loaded. Flagged record listed.");

            // Simulated auto approval after 3 seconds
            setTimeout(() => {
                showSlackToast("Step 4/4: Simulating Admin override click 'Approve'...");
                approveReferral(refId);
                
                // Clear simulated record to keep data clean
                setTimeout(() => {
                    let cleanedRefs = JSON.parse(localStorage.getItem('referrals_list') || '[]');
                    cleanedRefs = cleanedRefs.filter(r => r.id !== refId);
                    localStorage.setItem('referrals_list', JSON.stringify(cleanedRefs));
                    
                    switchTab('referral-program');
                    showSlackToast("Simulation loop completed successfully. Check logs!");
                }, 3000);
            }, 3000);
        }, 2000);
    }, 2000);
}

// ==========================================
// CORTEX CODE CLI STUDIO & SIMULATOR
// ==========================================
let cliSpeedMultiplier = 1;
let cliExecutionTimer = null;
let isCliRunning = false;

function toggleCliSpeed(speed) {
    cliSpeedMultiplier = speed;
    const btn1 = document.getElementById('cli-speed-1');
    const btn2 = document.getElementById('cli-speed-2');
    if (speed === 1) {
        if (btn1) btn1.className = 'px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white cursor-pointer';
        if (btn2) btn2.className = 'px-1.5 py-0.5 rounded text-[10px] font-mono bg-transparent text-on-surface-variant hover:text-white cursor-pointer';
    } else {
        if (btn1) btn1.className = 'px-1.5 py-0.5 rounded text-[10px] font-mono bg-transparent text-on-surface-variant hover:text-white cursor-pointer';
        if (btn2) btn2.className = 'px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white cursor-pointer';
    }
}

function clearCortexTerminal() {
    if (cliExecutionTimer) clearTimeout(cliExecutionTimer);
    isCliRunning = false;
    const term = document.getElementById('cortexTerminalOutput');
    if (term) {
        term.innerHTML = `
            <div class="text-slate-500 italic pb-2"># Snowflake Cortex Code CLI v2.4 (Session: sf_session_88921)</div>
            <div class="text-slate-400">Type <span class="text-secondary font-bold">cortex help</span> or click <span class="text-primary font-bold">Play Screen Recording Workflow</span> to launch the end-to-end multi-skill simulation.</div>
            <div class="pt-2 text-xs text-slate-500 font-mono">Available modular skills: <span class="text-secondary">[cortex-sql-opt]</span> <span class="text-primary">[cortex-anomaly-detect]</span> <span class="text-tertiary">[cortex-slack-notify]</span></div>
        `;
    }
    updateCliPhaseHighlight('reset');
}

function initCortexCliView() {
    const term = document.getElementById('cortexTerminalOutput');
    if (term && (term.children.length === 0 || term.innerHTML.trim() === '')) {
        clearCortexTerminal();
    }
}

function updateCliPhaseHighlight(phase) {
    const pInput = document.getElementById('cli-phase-input');
    const pProc = document.getElementById('cli-phase-processing');
    const pOut = document.getElementById('cli-phase-output');
    
    [pInput, pProc, pOut].forEach(el => {
        if (el) {
            el.classList.remove('ring-2', 'ring-secondary', 'ring-primary', 'ring-tertiary', 'bg-secondary/10', 'bg-primary/10', 'bg-tertiary/10');
        }
    });

    if (phase === 'input' && pInput) {
        pInput.classList.add('ring-2', 'ring-secondary', 'bg-secondary/10');
    } else if (phase === 'processing' && pProc) {
        pProc.classList.add('ring-2', 'ring-primary', 'bg-primary/10');
    } else if (phase === 'output' && pOut) {
        pOut.classList.add('ring-2', 'ring-tertiary', 'bg-tertiary/10');
    }
}

function appendCliLine(htmlContent, delay = 0, callback = null) {
    const delayTime = (delay / cliSpeedMultiplier);
    cliExecutionTimer = setTimeout(() => {
        const term = document.getElementById('cortexTerminalOutput');
        if (term) {
            const line = document.createElement('div');
            line.innerHTML = htmlContent;
            term.appendChild(line);
            term.scrollTop = term.scrollHeight;
        }
        if (callback) callback();
    }, delayTime);
}

function startCortexCliRecording() {
    if (isCliRunning) return;
    isCliRunning = true;
    
    const term = document.getElementById('cortexTerminalOutput');
    if (term) term.innerHTML = '';
    
    updateCliPhaseHighlight('input');
    showSlackToast("🎬 Playing Cortex Code CLI End-to-End Screen Recording...");
    
    // Screen recording script steps (Input -> Processing -> Output)
    appendCliLine(`<div class="text-slate-500 border-b border-white/10 pb-1 flex justify-between"><span>[RECORDING PLAYBACK] Session: CLI_REC_2026_0722</span><span class="text-secondary">● LIVE STREAM</span></div>`, 100);
    
    // Step 1: Input
    appendCliLine(`<div class="pt-2 text-secondary font-bold flex items-center gap-2"><span class="material-symbols-outlined text-sm">terminal</span> cortex@snowflake:~$ <span class="text-white font-mono typing-anim">cortex workflow run --config pipeline_prod.json --skills query-opt,anomaly-detect,slack-notify --target SF_WH_ANALYTICS</span></div>`, 600, () => {
        updateCliPhaseHighlight('input');
    });

    appendCliLine(`<div class="text-slate-400 pl-4">→ Parsing workflow specification: <span class="text-slate-200">pipeline_prod.json</span></div>`, 1200);
    appendCliLine(`<div class="text-slate-400 pl-4">→ Context loaded: <span class="text-emerald-400 font-bold">Snowflake Account: SF_EAST_01</span> | Role: <span class="text-emerald-400 font-bold">CORTEX_ADMIN</span></div>`, 1600);
    
    // Step 2: Processing (Modular Skills)
    appendCliLine(`<div class="pt-3 text-primary font-bold flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary animate-ping"></span> [PHASE 2: PROCESSING] Invoking 3 Modular Skills...</div>`, 2400, () => {
        updateCliPhaseHighlight('processing');
    });

    // Skill 1: SQL Opt
    appendCliLine(`<div class="pl-4 border-l-2 border-secondary/50 my-1 py-1 bg-secondary/5 rounded-r">
        <div class="text-secondary font-bold flex items-center gap-1.5"><span class="material-symbols-outlined text-xs">auto_fix_high</span> Skill #1: cortex-sql-opt</div>
        <div class="text-slate-300">Scanning table schema <span class="text-amber-300 font-mono">OPERATIONS.CONVERSIONS</span> (1.4M rows)...</div>
        <div class="text-slate-400 text-[11px]">Analyzing full table scans → Recommended micro-partitioning key: <span class="text-emerald-400 font-mono">(CREATED_AT, CUSTOMER_ID)</span></div>
        <div class="text-emerald-400 text-[11px] font-bold">✔ Generated optimized SQL script (Estimated runtime reduction: 48%)</div>
    </div>`, 3400);

    // Skill 2: Anomaly Detection
    appendCliLine(`<div class="pl-4 border-l-2 border-primary/50 my-1 py-1 bg-primary/5 rounded-r">
        <div class="text-primary font-bold flex items-center gap-1.5"><span class="material-symbols-outlined text-xs">radar</span> Skill #2: cortex-anomaly-detect</div>
        <div class="text-slate-300">Evaluating telemetry metrics over rolling 24-hour window...</div>
        <div class="text-amber-400 text-[11px]">⚠ Anomaly Flagged: Spike detected in high-value checkout transactions ($12,000 threshold exceeded).</div>
        <div class="text-slate-400 text-[11px]">Cortex Reasoner Confidence: <span class="text-primary font-bold">95.4%</span> (Flagged for mandatory Governance Gate approval).</div>
    </div>`, 4800);

    // Skill 3: Gate Interrupt & Slack Notify
    appendCliLine(`<div class="pl-4 border-l-2 border-tertiary/50 my-1 py-1 bg-tertiary/5 rounded-r">
        <div class="text-tertiary font-bold flex items-center gap-1.5"><span class="material-symbols-outlined text-xs">gate</span> Skill #3: cortex-slack-notify</div>
        <div class="text-slate-300">Executing Governance Gate verification interrupt...</div>
        <div class="text-emerald-400 text-[11px]">✔ Automatic signature match: ADM_CORTEX token verified.</div>
        <div class="text-sky-300 text-[11px] font-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">send</span> Webhook sent to #ops-alerts: "High-value lead $12,000 processed & optimized via Cortex CLI."
        </div>
    </div>`, 6200);

    // Step 3: Output Matrix
    appendCliLine(`<div class="pt-3 text-tertiary font-bold flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-tertiary"></span> [PHASE 3: OUTPUT RESULT] Pipeline Execution Completed Successfully</div>`, 7400, () => {
        updateCliPhaseHighlight('output');
    });

    appendCliLine(`<div class="bg-black/40 border border-emerald-500/30 p-3 rounded-xl font-mono text-[11px] space-y-1 my-2">
        <div class="text-emerald-400 font-bold flex justify-between"><span>STATUS: WORKFLOW_SUCCESS</span> <span>DURATION: 2.14s</span></div>
        <div class="text-slate-300">Rows Processed: <span class="text-white font-bold">1,420,890</span> | Credits Saved: <span class="text-emerald-400 font-bold">1.50/hr</span></div>
        <div class="text-slate-300">Execution Plan Hash: <span class="text-slate-400">0x889f2a991bce42</span></div>
        <div class="text-slate-400 pt-1 text-[10px]">Output JSON saved to: <span class="text-secondary font-mono">/var/cortex/runs/run_20260722_01.json</span></div>
    </div>`, 8200, () => {
        isCliRunning = false;
        showSlackToast("✅ Cortex Code CLI workflow execution completed with 3 modular skills verified!");
    });
}

function runSkillDemo(skillType) {
    if (isCliRunning) return;
    isCliRunning = true;
    
    const term = document.getElementById('cortexTerminalOutput');
    if (term) term.innerHTML = '';
    
    if (skillType === 'query-opt') {
        updateCliPhaseHighlight('input');
        appendCliLine(`<div class="text-secondary font-bold">$ cortex skill exec --name cortex-sql-opt --target OPERATIONS.CONVERSIONS</div>`, 200);
        appendCliLine(`<div class="text-slate-400 pl-3">Phase 1 Input: Directing query analyzer to scan missing indexes...</div>`, 800, () => updateCliPhaseHighlight('processing'));
        appendCliLine(`<div class="text-slate-200 pl-3">Phase 2 Processing: Rewriting SELECT queries with zero-copy micro-partitions.</div>`, 1600);
        appendCliLine(`<div class="text-emerald-400 font-bold pl-3">Phase 3 Output: Query latency improved by 48.2%. Saved 124 credits/month.</div>`, 2400, () => {
            updateCliPhaseHighlight('output');
            isCliRunning = false;
        });
    } else if (skillType === 'anomaly-detect') {
        updateCliPhaseHighlight('input');
        appendCliLine(`<div class="text-primary font-bold">$ cortex skill exec --name cortex-anomaly-detect --window 24h</div>`, 200);
        appendCliLine(`<div class="text-slate-400 pl-3">Phase 1 Input: Fetching 24-hour telemetry log vectors...</div>`, 800, () => updateCliPhaseHighlight('processing'));
        appendCliLine(`<div class="text-slate-200 pl-3">Phase 2 Processing: Running Cortex Isolation Forest model on warehouse metrics...</div>`, 1600);
        appendCliLine(`<div class="text-amber-400 font-bold pl-3">Phase 3 Output: Detected 1 transaction spike anomaly ($12,000 threshold). Confidence 95.4%.</div>`, 2400, () => {
            updateCliPhaseHighlight('output');
            isCliRunning = false;
        });
    } else if (skillType === 'slack-notify') {
        updateCliPhaseHighlight('input');
        appendCliLine(`<div class="text-tertiary font-bold">$ cortex skill exec --name cortex-slack-notify --channel #ops-alerts</div>`, 200);
        appendCliLine(`<div class="text-slate-400 pl-3">Phase 1 Input: Constructing Slack block kit payload...</div>`, 800, () => updateCliPhaseHighlight('processing'));
        appendCliLine(`<div class="text-slate-200 pl-3">Phase 2 Processing: Authenticating ADM_CORTEX gate signature...</div>`, 1600);
        appendCliLine(`<div class="text-sky-300 font-bold pl-3">Phase 3 Output: Slack Webhook HTTP 200 OK. Notification delivered to #ops-alerts.</div>`, 2400, () => {
            updateCliPhaseHighlight('output');
            isCliRunning = false;
        });
    }
}

function sendCortexCliCommand() {
    const input = document.getElementById('cortexCliInput');
    if (!input || !input.value.trim()) return;
    const cmd = input.value.trim();
    input.value = '';
    
    if (isCliRunning) return;
    
    const term = document.getElementById('cortexTerminalOutput');
    if (term) {
        const cmdLine = document.createElement('div');
        cmdLine.className = 'pt-2 text-secondary font-bold flex items-center gap-2';
        cmdLine.innerHTML = `<span class="material-symbols-outlined text-sm">terminal</span> cortex@snowflake:~$ <span class="text-white">${cmd}</span>`;
        term.appendChild(cmdLine);
        term.scrollTop = term.scrollHeight;
    }
    
    const lower = cmd.toLowerCase();
    if (lower === 'cortex run' || lower === 'cortex workflow run') {
        startCortexCliRecording();
    } else if (lower.includes('skill')) {
        appendCliLine(`<div class="text-slate-300 pl-3 pt-1">Installed Cortex Modular Skills:</div>
            <div class="text-secondary pl-5">• cortex-sql-opt (SQL Optimization & Micro-partitioning)</div>
            <div class="text-primary pl-5">• cortex-anomaly-detect (Warehouse Telemetry Anomaly Detection)</div>
            <div class="text-tertiary pl-5">• cortex-slack-notify (Governance Gate & Webhook Alerts)</div>`, 300);
    } else if (lower === 'cortex help' || lower === 'help') {
        appendCliLine(`<div class="text-slate-300 pl-3 pt-1">Cortex Code CLI Commands:</div>
            <div class="text-slate-400 pl-5"><span class="text-secondary font-bold">cortex run</span> - Execute multi-skill end-to-end workflow recording</div>
            <div class="text-slate-400 pl-5"><span class="text-secondary font-bold">cortex skills</span> - List registered modular capabilities</div>
            <div class="text-slate-400 pl-5"><span class="text-secondary font-bold">cortex status</span> - Display active Snowflake Cortex cluster metrics</div>
            <div class="text-slate-400 pl-5"><span class="text-secondary font-bold">clear</span> - Reset terminal window</div>`, 300);
    } else if (lower === 'cortex status' || lower === 'status') {
        appendCliLine(`<div class="text-emerald-400 font-mono pl-3 pt-1">Snowflake Cortex Engine: ONLINE | Cluster: SF_EAST_01 | Active Agents: 4</div>`, 300);
    } else if (lower === 'clear') {
        clearCortexTerminal();
    } else {
        appendCliLine(`<div class="text-amber-400 pl-3 pt-1">cortex: command not recognized. Type <span class="text-white font-bold">cortex help</span> or <span class="text-secondary font-bold">cortex run</span>.</div>`, 300);
    }
}

// ==========================================
// DOCUMENTATION & SUPPORT HANDLERS
// ==========================================
function copyCodeSnippet(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showSlackToast("📋 Code snippet copied to clipboard!");
    });
}

function submitSupportTicket() {
    const name = document.getElementById('suppName')?.value || 'User';
    const email = document.getElementById('suppEmail')?.value || '';
    const moduleName = document.getElementById('suppModule')?.value || 'General';
    const priority = document.getElementById('suppPriority')?.value || 'medium';
    const message = document.getElementById('suppMessage')?.value;

    if (!message || !message.trim()) {
        showSlackToast("⚠️ Please enter an issue description before submitting.");
        return;
    }

    const ticketId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);
    showSlackToast(`✅ Support Ticket ${ticketId} created! Assigned to Enterprise Oncall Engineer.`);
    
    const msgInput = document.getElementById('suppMessage');
    if (msgInput) msgInput.value = '';
}

