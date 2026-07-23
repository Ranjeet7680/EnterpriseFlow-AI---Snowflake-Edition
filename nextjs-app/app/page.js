"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [greeting, setGreeting] = useState('Welcome to EnterpriseFlow AI Vercel Edge!');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [viewMode, setViewMode] = useState('simulator'); // 'simulator' or 'guide'
  
  // Mobile mockup state
  const [mobileTab, setMobileTab] = useState('dashboard');
  const [mobileToast, setMobileToast] = useState(null);
  const [mobileAlerts, setMobileAlerts] = useState(7);
  
  const [logs, setLogs] = useState([
    { time: '11:32:01', msg: 'Edge Config initialized successfully', type: 'ok' },
    { time: '11:32:12', msg: 'Proxy matcher configured for path: /welcome', type: 'info' },
    { time: '11:32:30', msg: 'Checked local .env.local: EDGE_CONFIG active', type: 'ok' }
  ]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleSimulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const randomGreetings = [
        "Welcome to the Edge of Snowflake Speed!",
        "Hello from Vercel Edge Runtime!",
        "Autonomous Agent Mesh Connected.",
        "PII Sensitive Guardrails Enabled."
      ];
      const selected = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
      setGreeting(selected);
      setLogs(prev => [
        {
          time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          msg: `Pulled new value from Edge Config mock: "${selected}"`,
          type: 'ok'
        },
        ...prev.slice(0, 4)
      ]);
      showToast(`Updated Edge Config value!`, 'success');
    }, 800);
  };

  const showToast = (msg, type = 'info') => {
    setMobileToast({ msg, type });
    setTimeout(() => setMobileToast(null), 3000);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background Orbs */}
      <div className="float-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Header */}
      <header style={{
        height: '70px',
        background: 'var(--gl)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--br)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="EnterpriseFlow AI Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(0,229,195,0.4))' }} />
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.3px' }}>EnterpriseFlow AI</h1>
            <p style={{ fontSize: '8px', color: 'var(--txm)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px' }}>MOBILE CENTER &amp; EDGE</p>
          </div>
        </div>

        {/* Mode Selector Switch */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--br)'
        }}>
          <button 
            onClick={() => setViewMode('simulator')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'simulator' ? 'var(--p)' : 'transparent',
              color: viewMode === 'simulator' ? '#060b13' : 'var(--txm)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>phone_iphone</span>
            Mobile App
          </button>
          <button 
            onClick={() => setViewMode('guide')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'guide' ? 'var(--p)' : 'transparent',
              color: viewMode === 'guide' ? '#060b13' : 'var(--txm)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>terminal</span>
            Edge Console
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {viewMode === 'simulator' ? (
          /* MOBILE PHONE SIMULATOR */
          <div className="animate-slideup" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Mobile Command Center Simulator</h2>
              <p style={{ fontSize: '13px', color: 'var(--txm)' }}>Fully optimized touch interfaces and layout navigation.</p>
            </div>

            {/* Simulated Phone Shell */}
            <div className="mock-phone">
              <div className="mock-screen">
                {/* Status Bar */}
                <div style={{
                  height: '24px',
                  background: 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 16px',
                  fontSize: '9px',
                  fontFamily: 'JetBrains Mono',
                  color: 'var(--txm)'
                }}>
                  <span>11:37 AM</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>wifi</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>signal_cellular_alt</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>battery_full</span>
                  </div>
                </div>

                {/* App Header */}
                <header style={{
                  height: '52px',
                  background: 'var(--gl)',
                  borderBottom: '1px solid var(--br)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      background: 'rgba(0,229,195,0.08)',
                      border: '1px solid var(--brp)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <polygon points="12,2 22,8.5 22,17.5 12,22 2,17.5 2,8.5" stroke="var(--p)" strokeWidth="2"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800 }}>EnterpriseFlow AI</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', position: 'relative' }}>
                    <button 
                      onClick={() => {
                        setMobileAlerts(0);
                        showToast("Cleared active alerts", "success");
                      }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--br)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--txm)'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>notifications</span>
                      {mobileAlerts > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '-2px',
                          right: '-2px',
                          width: '6px',
                          height: '6px',
                          background: 'var(--err)',
                          borderRadius: '99px'
                        }} />
                      )}
                    </button>
                  </div>
                </header>

                {/* Main Screen Content View */}
                <div className="mock-content">
                  {/* Toast overlay inside mockup */}
                  {mobileToast && (
                    <div style={{
                      position: 'absolute',
                      top: '80px',
                      left: '12px',
                      right: '12px',
                      background: 'var(--s2)',
                      border: '1px solid var(--br)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      zIndex: 999,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      animation: 'slideUp 0.3s ease'
                    }}>
                      <span className="material-symbols-outlined" style={{ 
                        fontSize: '16px', 
                        color: mobileToast.type === 'success' ? 'var(--p)' : 'var(--sec)'
                      }}>
                        {mobileToast.type === 'success' ? 'check_circle' : 'info'}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{mobileToast.msg}</span>
                    </div>
                  )}

                  {/* Dashboard Tab */}
                  {mobileTab === 'dashboard' && (
                    <div style={{ padding: '16px' }} className="animate-slideup">
                      <div style={{ textAlign: 'left', marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Good morning, Ranjeet 👋</h3>
                        <p style={{ fontSize: '10px', color: 'var(--txm)', fontFamily: 'JetBrains Mono' }}>CORTEX_USER · PROD_DB</p>
                      </div>

                      {/* Hero Value */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(0,229,195,0.06), rgba(173,198,255,0.04))',
                        border: '1px solid var(--brp)',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'left',
                        position: 'relative',
                        overflow: 'hidden',
                        marginBottom: '14px'
                      }}>
                        <div style={{ fontSize: '10px', color: 'var(--txm)', textTransform: 'uppercase', letterSpacing: '1px' }}>Pipeline Value</div>
                        <div style={{ fontSize: '28px', fontWeight: 900, marginTop: '4px' }}>₹2.4M</div>
                        <span style={{
                          background: 'rgba(0, 229, 195, 0.1)',
                          color: 'var(--p)',
                          fontSize: '9px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '99px',
                          display: 'inline-block',
                          marginTop: '8px'
                        }}>+18.3% vs last week</span>
                      </div>

                      {/* Sparkline Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ background: 'var(--s1)', border: '1px solid var(--br)', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
                          <span style={{ fontSize: '9px', color: 'var(--txm)', textTransform: 'uppercase' }}>Active Queries</span>
                          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>847</div>
                          <div style={{ height: '4px', background: 'var(--br)', borderRadius: '99px', marginTop: '8px', overflow: 'hidden' }}>
                            <div style={{ width: '70%', height: '100%', background: 'var(--p)' }} />
                          </div>
                        </div>
                        <div style={{ background: 'var(--s1)', border: '1px solid var(--br)', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
                          <span style={{ fontSize: '9px', color: 'var(--txm)', textTransform: 'uppercase' }}>Agents Status</span>
                          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>12 Online</div>
                          <div style={{ height: '4px', background: 'var(--br)', borderRadius: '99px', marginTop: '8px', overflow: 'hidden' }}>
                            <div style={{ width: '90%', height: '100%', background: 'var(--acc)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Action Feed */}
                      <div style={{ textAlign: 'left' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txm)', marginBottom: '8px' }}>Recent Activity</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {[
                            { title: 'Anomaly root-cause analysis', desc: 'Triggered by Cortex Agent on 12 tables', time: '2m ago', color: 'var(--err)' },
                            { title: 'Inventory reorder workflow complete', desc: '847 SKUs reordered across nodes', time: '14m ago', color: 'var(--p)' }
                          ].map((item, i) => (
                            <div key={i} style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid var(--br)',
                              borderRadius: '10px',
                              padding: '10px',
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'center'
                            }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '99px', background: item.color }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', fontWeight: 700 }}>{item.title}</div>
                                <div style={{ fontSize: '9px', color: 'var(--txm)' }}>{item.desc}</div>
                              </div>
                              <span style={{ fontSize: '8px', color: 'var(--txd)', fontFamily: 'JetBrains Mono' }}>{item.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agents Grid Tab */}
                  {mobileTab === 'agents' && (
                    <div style={{ padding: '16px' }} className="animate-slideup">
                      <div style={{ textAlign: 'left', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800 }}>AI Agent Mesh</h3>
                        <p style={{ fontSize: '10px', color: 'var(--txm)' }}>Select an agent to initiate remote execution</p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                          { name: 'Cortex Analyst', desc: 'NLP · SQL', emoji: '🧠', status: 'Running', color: 'var(--p)' },
                          { name: 'Inventory Bot', desc: 'Reorders', emoji: '📦', status: 'Running', color: 'var(--p)' },
                          { name: 'Anomaly Check', desc: 'Data Audit', emoji: '⚠️', status: 'Idle', color: 'var(--txm)' },
                          { name: 'Compliance AI', desc: 'Regulation', emoji: '⚖️', status: 'Idle', color: 'var(--txm)' }
                        ].map((agent, i) => (
                          <div 
                            key={i} 
                            onClick={() => showToast(`Executing ${agent.name}...`, 'info')}
                            style={{
                              background: 'var(--s1)',
                              border: '1px solid var(--br)',
                              borderRadius: '14px',
                              padding: '12px',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{ fontSize: '20px' }}>{agent.emoji}</span>
                            <div style={{ fontSize: '11px', fontWeight: 800, marginTop: '6px' }}>{agent.name}</div>
                            <div style={{ fontSize: '8px', color: 'var(--txm)' }}>{agent.desc}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                              <div style={{ width: '4px', height: '4px', borderRadius: '99px', background: agent.color }} />
                              <span style={{ fontSize: '8px', fontWeight: 600, color: agent.color }}>{agent.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Profile & Settings Tab */}
                  {mobileTab === 'profile' && (
                    <div style={{ padding: '16px' }} className="animate-slideup">
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(0,229,195,0.06), rgba(173,198,255,0.04))',
                        border: '1px solid var(--br)',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'center',
                        marginBottom: '14px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '99px',
                          background: 'linear-gradient(135deg, var(--p), var(--sec))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#060b13'
                        }}>RK</div>
                        <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Ranjeet Kumar</h4>
                        <p style={{ fontSize: '9px', color: 'var(--p)' }}>Project Architect</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--br)', borderRadius: '12px', overflow: 'hidden' }}>
                        {[
                          { name: 'Vercel Edge Config', desc: 'greeting: "hello world"', icon: 'cloud' },
                          { name: 'Active Schema', desc: 'PROD_DB · SALES_SCHEMA', icon: 'database' },
                          { name: 'Compute Warehouse', desc: 'COMPUTE_WH · XS Size', icon: 'speed' }
                        ].map((pref, i) => (
                          <div key={i} style={{
                            background: 'var(--s1)',
                            padding: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--p)' }}>{pref.icon}</span>
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700 }}>{pref.name}</div>
                                <div style={{ fontSize: '9px', color: 'var(--txm)' }}>{pref.desc}</div>
                              </div>
                            </div>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--txd)' }}>chevron_right</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mock Bottom Navigation Bar */}
                <nav className="mock-bottom-nav">
                  <div 
                    className={`mock-nav-item ${mobileTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setMobileTab('dashboard')}
                  >
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Dashboard</span>
                  </div>
                  <div 
                    className={`mock-nav-item ${mobileTab === 'agents' ? 'active' : ''}`}
                    onClick={() => setMobileTab('agents')}
                  >
                    <span className="material-symbols-outlined">smart_toy</span>
                    <span>Agents</span>
                  </div>
                  <div 
                    className={`mock-nav-item ${mobileTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setMobileTab('profile')}
                  >
                    <span className="material-symbols-outlined">person</span>
                    <span>Profile</span>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        ) : (
          /* EDGE CONSOLE & CLI GUIDE */
          <div className="responsive-grid animate-slideup">
            {/* Left Box */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: 'var(--s1)',
                border: '1px solid var(--br)',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--p), var(--sec), var(--p))',
                  animation: 'pipelineFlow 4s linear infinite'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{
                      background: 'rgba(0, 229, 195, 0.1)',
                      color: 'var(--p)',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      fontFamily: 'JetBrains Mono'
                    }}>LIVE ENDPOINT</span>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>Vercel Edge Config Store</h2>
                  </div>
                  <button 
                    onClick={handleSimulateRefresh}
                    disabled={isRefreshing}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--br)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--tx)',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    <span className="material-symbols-outlined" style={{
                      fontSize: '14px',
                      animation: isRefreshing ? 'ringSpin 1s linear infinite' : 'none'
                    }}>sync</span>
                    Simulate Update
                  </button>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--br)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '10px', color: 'var(--txm)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>Current Greeting:</p>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    color: 'var(--tx)', 
                    marginTop: '4px',
                    fontFamily: 'JetBrains Mono',
                    background: 'linear-gradient(135deg, #fff, var(--sec))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    "{greeting}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '99px', background: 'var(--p)' }}></div>
                  <p style={{ fontSize: '11px', color: 'var(--txm)' }}>
                    Matched path: <code style={{ color: 'var(--p)', fontFamily: 'JetBrains Mono' }}>/welcome</code>
                  </p>
                </div>
              </div>

              {/* Terminal setup */}
              <div style={{
                background: 'var(--s1)',
                border: '1px solid var(--br)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Terminal Integration Guide</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'env-pull', label: '1. Pull Vercel Environment Variables', cmd: 'vercel env pull .env.local' },
                    { id: 'install-sdk', label: '2. Install Edge Config Package', cmd: 'npm install @vercel/edge-config' },
                    { id: 'run-dev', label: '3. Boot Dev Server', cmd: 'npm run dev' }
                  ].map((step) => (
                    <div key={step.id} style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--br)',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '12px', fontWeight: 700 }}>{step.label}</h4>
                        <code style={{
                          display: 'block',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '11px',
                          color: 'var(--p)',
                          marginTop: '4px'
                        }}>{step.cmd}</code>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(step.cmd, step.id)}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--br)',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: copiedCmd === step.id ? 'var(--p)' : 'var(--txm)'
                        }}
                      >
                        {copiedCmd === step.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Right Box */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: 'var(--s1)',
                border: '1px solid var(--br)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '280px'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--p)' }}>terminal</span>
                  Edge Logs
                </h3>
                <div style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--br)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  overflowY: 'auto'
                }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ lineBreak: 'anywhere', textAlign: 'left' }}>
                      <span style={{ color: 'var(--txd)', marginRight: '4px' }}>[{log.time}]</span>
                      <span style={{ color: log.type === 'ok' ? 'var(--p)' : 'var(--sec)', marginRight: '4px' }}>{log.type.toUpperCase()}:</span>
                      {log.msg}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid var(--br)',
        color: 'var(--txd)',
        fontSize: '10px',
        fontFamily: 'JetBrains Mono'
      }}>
        EnterpriseFlow AI · Powered by Next.js &amp; Vercel Edge Network
      </footer>
    </div>
  );
}
