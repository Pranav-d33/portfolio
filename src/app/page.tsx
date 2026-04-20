"use client";

import React, { useState, useEffect, useCallback } from 'react';

/* ─── Typing effect hook ─── */
function useTypingEffect(phrases: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setText(isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
}

/* ─── Scroll-triggered reveal hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}


export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('');
  const [showTopBtn, setShowTopBtn] = useState(false);

  const typedText = useTypingEffect([
    'training transformers from scratch',
    'building agentic AI systems',
    'engineering MCP servers',
    'exploring RF + ML at the edge',
  ], 60, 35, 1800);

  useScrollReveal();

  /* ─── Intersection-based scroll-spy ─── */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
    
    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  /* ─── Custom cursor follower ─── */
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* ─── Theme toggle ─── */
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  /* ─── Back-to-top visibility ─── */
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navItems = [
    { id: 'education', label: '01' },
    { id: 'projects', label: '02' },
    { id: 'skills', label: '03' },
    { id: 'research', label: '04' },
    { id: 'contact', label: '05' }
  ];

  return (
    <>
      
      {/* CUSTOM CURSOR FOLLOWER */}
      <div 
        id="custom-cursor" 
        className="fixed top-0 left-0 pointer-events-none z-[10000] hidden md:flex items-center justify-center w-4 h-4 -ml-2 -mt-2 text-accent font-mono text-lg opacity-70"
      >
        +
      </div>
      
      {/* REAL-TIME SCROLL SPY */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-end gap-5">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-center gap-3"
            aria-label={`Scroll to ${item.id}`}
          >
            <span className={`text-[10px] font-mono transition-all duration-300 ${activeSection === item.id ? 'text-accent opacity-100 translate-x-0' : 'text-t3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {item.label}
            </span>
            <div className={`w-1.5 transition-all duration-300 rounded-full ${activeSection === item.id ? 'h-6 bg-accent' : 'h-1.5 bg-border-dim group-hover:bg-t3'}`} />
          </a>
        ))}
      </div>

      {/* NAVIGATION */}
      <nav className='sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm py-4 border-b border-border-dim/10'>
        <div className='flex justify-between items-center max-w-[720px] mx-auto px-6'>
          <div className='text-section font-medium group cursor-default'>
            <span className='inline-block transition-transform duration-300 group-hover:scale-110'>P</span>
            <span className='inline-block transition-transform duration-300 group-hover:scale-110 delay-75'>D</span>
          </div>
          <div className='flex gap-6 items-center text-eyebrow'>
            <a href='#projects' className={`nav-link transition-colors ${activeSection === 'projects' ? 'text-accent' : 'hover:text-t1'}`}>Projects</a>
            <a href='#skills' className={`nav-link transition-colors ${activeSection === 'skills' ? 'text-accent' : 'hover:text-t1'}`}>Skills</a>
            <a href='#research' className={`nav-link transition-colors ${activeSection === 'research' ? 'text-accent' : 'hover:text-t1'}`}>Research</a>
            <a href='#contact' className={`nav-link transition-colors ${activeSection === 'contact' ? 'text-accent' : 'hover:text-t1'}`}>Contact</a>
            
            {/* Sun / Moon theme toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='theme-toggle ml-2 w-7 h-7 flex items-center justify-center rounded-full border border-border-dim hover:border-t2 transition-all duration-300 hover:rotate-180'
              aria-label='Toggle theme'
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-t3">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-t3">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className='flex flex-col max-w-[720px] mx-auto px-6 pt-16'>
        {/* HERO SECTION */}
        <section className='animate-reveal stagger-1 section-gap'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-6'>
                <div className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-accent'></span>
                </div>
                <span className='text-tag text-accent'>Open to residencies & fellowships</span>
              </div>
              <h1 className='text-hero mb-4 text-t1 hero-gradient'>
                Pranav Dhiran
              </h1>
              <div className='text-body text-t3 mb-6 font-mono h-6 flex items-center'>
                <span className='text-accent mr-1'>›</span>
                <span>{typedText}</span>
                <span className='typing-cursor'>|</span>
              </div>
              <div className='text-body font-medium text-t2 mb-8 max-w-lg'>
                Electronics engineer turned AI builder. I work across the stack — from transformer pre-training and RL fine-tuning to shipping multi-agent systems.
              </div>
              <div className='flex gap-4 items-center'>
                <a href='/resume_v4.pdf' className='ghost-button group'>
                  <span className='inline-block transition-transform duration-200 group-hover:-translate-y-0.5'>Resume</span>
                  <span className='inline-block ml-1 transition-transform duration-200 group-hover:translate-y-0.5'>↓</span>
                </a>
                <div className='flex gap-3 text-tag text-t3'>
                  <a href='mailto:dhiranpranav72@gmail.com' className='hover:text-t2 transition-colors'>Email</a>
                  <span>·</span>
                  <a href='https://github.com/Pranav-d33' className='hover:text-t2 transition-colors'>GitHub</a>
                  <span>·</span>
                  <a href='https://linkedin.com/in/pranav-dhiran' className='hover:text-t2 transition-colors'>LinkedIn</a>
                </div>
              </div>
            </div>
            {/* Profile Image */}
            <div className='profile-image-wrapper w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full border border-border-dim ml-6 lg:ml-8 flex-shrink-0 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-sm'>
              <img src="/portfolio_image.jpeg" alt="Pranav Dhiran" className="w-full h-full object-cover scale-[2.0] origin-bottom" />
            </div>
          </div>

          <div className='mt-10 text-label text-t3 font-mono tracking-wide'>
            Committed to building AI solutions that solve real-world challenges.
          </div>
        </section>

        {/* EDUCATION */}
        <section id='education' className='scroll-reveal section-gap section-divider pt-16'>
          <div className='text-eyebrow mb-1'>01</div>
          <h2 className='text-section border-b border-border-dim py-2 mb-6'>Education</h2>
          <div className='flex flex-col gap-12'>
            <div className='experience-rule pl-4'>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <div className='text-tag font-mono text-t3 mb-1'>2023 — Present</div>
                  <div className='text-body font-medium'>Shri Guru Gobind Singhji Institute of Engineering & Technology, Nanded</div>
                </div>
              </div>
              <div className='text-body text-t2'>
                B.Tech — Electronics & Telecommunication Engineering
              </div>
              <div className='text-label text-t3 mt-1'>
                Minor in Information Technology
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id='projects' className='scroll-reveal section-gap section-divider pt-16'>
          <div className='text-eyebrow mb-1'>02</div>
          <h2 className='text-section border-b border-border-dim py-2 mb-6'>Selected Work</h2>
          <div className='flex flex-col'>
            
            <div className='project-card hover-arrow group border-b border-border-dim pb-6 mb-6'>
              <div className='flex justify-between items-center'>
                <div className='flex-1'>
                  <div className='text-body font-medium mb-1'>Small Language Model From Scratch — TinyStories</div>
                  <div className='text-body text-t2 mb-4'>
                    Pre-trained a GPT-style autoregressive transformer (6L, 6H, 384-dim) on TinyStories from scratch — custom BPE tokenization, mmap pipelines, AMP mixed precision, gradient accumulation, warmup + cosine LR scheduling, temperature/top-k sampling.
                  </div>
                  <div className='mb-4'>
                    <span className='tag'>PyTorch</span>
                    <span className='tag'>Hugging Face</span>
                    <span className='tag'>AMP</span>
                    <span className='tag'>NLP</span>
                  </div>
                  <div className='flex gap-4 text-tag'>
                    <a href='https://github.com/Pranav-d33/small_language_model_from_scratch-TinyStories' className='text-accent underline'>GitHub</a>
                  </div>
                </div>
                <div className='arrow text-t3 ml-4 text-2xl'>→</div>
              </div>
            </div>

            <div className='project-card hover-arrow group border-b border-border-dim pb-6 mb-6'>
              <div className='flex justify-between items-center'>
                <div className='flex-1'>
                  <div className='text-body font-medium mb-1'>Medaura — Agentic Pharmacy System</div>
                  <div className='text-body text-t2 mb-4'>
                    Full-stack multi-agent AI system — five specialized agents (Ordering, Safety, Forecast, Procurement, UI) with a custom orchestration pipeline for autonomous medication ordering across four languages.
                  </div>
                  <div className='mb-4'>
                    <span className='tag'>FastAPI</span>
                    <span className='tag'>LangChain</span>
                    <span className='tag'>ChromaDB</span>
                    <span className='tag'>Langfuse</span>
                    <span className='tag'>React</span>
                  </div>
                  <div className='flex gap-4 text-tag'>
                    <a href='https://aipharmacyproject-blond.vercel.app' className='text-accent underline'>medaura.vercel.app →</a>
                  </div>
                </div>
                <div className='arrow text-t3 ml-4 text-2xl'>→</div>
              </div>
            </div>
            
            <div className='project-card hover-arrow group border-b border-border-dim pb-6 mb-6'>
              <div className='flex justify-between items-center'>
                <div className='flex-1'>
                  <div className='text-body font-medium mb-1'>GNU Radio MCP Server — LLM-to-SDR Bridge</div>
                  <div className='text-body text-t2 mb-4'>
                    MCP server bridging LLMs to live GNU Radio SDR flowgraphs — 13 tools with Pydantic v2 validation, lifespan-managed ZMQ context, and stdio/streamable-HTTP transport. Includes async IQ capture with Welch PSD, peak detection, and automated frequency sweep.
                  </div>
                  <div className='mb-4'>
                    <span className='tag'>Python</span>
                    <span className='tag'>FastMCP</span>
                    <span className='tag'>ZMQ</span>
                    <span className='tag'>XML-RPC</span>
                    <span className='tag'>GNU Radio</span>
                  </div>
                  <div className='flex gap-4 text-tag'>
                    <a href='https://github.com/Pranav-d33/gnuradio-mcp-server' className='text-accent underline'>GitHub</a>
                  </div>
                </div>
                <div className='arrow text-t3 ml-4 text-2xl'>→</div>
              </div>
            </div>

            <div className='project-card hover-arrow group'>
              <div className='flex justify-between items-center'>
                <div className='flex-1'>
                  <div className='text-body font-medium mb-1'>RF Watch — Open-Source Real-Time RF Spectrum Monitor</div>
                  <div className='text-body text-t2 mb-4'>
                    Real-time RF spectrum analyzer using HackRF One + GNU Radio — FFT-based spectral feature extraction with a lightweight ML classifier for passive detection of unknown transmitters. Built on work from SIH 2025, originally developed as an anti-drone detection system for ITBP.
                  </div>
                  <div className='mb-4'>
                    <span className='tag'>Python</span>
                    <span className='tag'>GNU Radio</span>
                    <span className='tag'>HackRF One</span>
                    <span className='tag'>Signal Processing</span>
                  </div>
                  <div className='flex gap-4 text-tag'>
                    <a href='https://github.com/Pranav-d33/RFwatch' className='text-accent underline'>GitHub</a>
                  </div>
                </div>
                <div className='arrow text-t3 ml-4 text-2xl'>→</div>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL SKILLS */}
        <section id='skills' className='scroll-reveal section-gap section-divider pt-16'>
          <div className='text-eyebrow mb-1'>03</div>
          <h2 className='text-section border-b border-border-dim py-2 mb-6'>Technical Skills</h2>
          <div className='flex flex-col gap-8'>

            <div className='skill-category'>
              <div className='flex items-center gap-2 mb-3'>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <span className='text-label font-medium text-t3 uppercase tracking-wider'>Languages &amp; Frameworks</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {['Python', 'PyTorch', 'TensorFlow', 'Hugging Face Transformers'].map(s => (
                  <span key={s} className='skill-pill'>{s}</span>
                ))}
              </div>
            </div>

            <div className='skill-category'>
              <div className='flex items-center gap-2 mb-3'>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <span className='text-label font-medium text-t3 uppercase tracking-wider'>LLM Engineering</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {['Instruction Fine-Tuning', 'LoRA', 'PEFT', 'INT4/INT8 Quantization', 'Unsloth', 'LangChain', 'LangGraph', 'OpenAI/Gemini APIs', 'ChromaDB', 'FAISS'].map(s => (
                  <span key={s} className='skill-pill'>{s}</span>
                ))}
              </div>
            </div>

            <div className='skill-category'>
              <div className='flex items-center gap-2 mb-3'>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span className='text-label font-medium text-t3 uppercase tracking-wider'>Agentic &amp; MCP</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {['Multi-Agent Systems', 'Tool-Use', 'Function Calling', 'MCP Server Engineering', 'FastMCP', 'XML-RPC', 'ZMQ', 'LangSmith', 'Langfuse'].map(s => (
                  <span key={s} className='skill-pill'>{s}</span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* RESEARCH & ACHIEVEMENTS */}
        <section id='research' className='scroll-reveal section-gap section-divider pt-16'>
          <div className='text-eyebrow mb-1'>04</div>
          <h2 className='text-section border-b border-border-dim py-2 mb-6'>Research & Achievements</h2>
          <div className='flex flex-col gap-10'>
            <div>
              <div className='text-label font-medium text-t3 uppercase tracking-wider mb-4'>Research Interests</div>
              <div className='flex flex-wrap gap-2'>
                {['RLHF', 'RLAIF', 'GRPO', 'Scaling Laws', 'MoE', 'SSMs', 'Efficient Inference', 'Multi-Agent Reasoning', 'Tokenization'].map(topic => (
                  <span key={topic} className='skill-pill'>{topic}</span>
                ))}
              </div>
            </div>

            <div>
              <div className='text-label font-medium text-t3 uppercase tracking-wider mb-4'>Certifications</div>
              <div className='flex flex-col gap-2'>
                <div className='text-body text-t2'>• Fine-tuning & RL for LLMs: Intro to Post-training — <span className='text-t1 font-medium'>DeepLearning.AI</span></div>
                <div className='text-body text-t2'>• AI Agents in LangGraph — <span className='text-t1 font-medium'>DeepLearning.AI</span></div>
                <div className='text-body text-t2'>• Quantization Fundamentals — <span className='text-t1 font-medium'>Hugging Face</span></div>
                <div className='text-body text-t2'>• MCP: Build Rich-Context AI Apps — <span className='text-t1 font-medium'>Anthropic</span></div>
              </div>
            </div>
            
            <div>
              <div className='text-label font-medium text-t3 uppercase tracking-wider mb-4'>Awards & Recognition</div>
              <div className='flex flex-col gap-2'>
                <div className='text-body text-t2'>• Global Finalist (Top 6 Internationally) — <span className='text-t1 font-medium'>UWA Hack For Impact 2026</span></div>
                <div className='text-body text-t2'>• National Finalist — <span className='text-t1 font-medium'>Smart India Hackathon (SIH) 2024 & 2025</span></div>
                <div className='text-body text-t2'>• Regional Qualifier — <span className='text-t1 font-medium'>Nxt Wave x OpenAI Buildathon</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id='contact' className='scroll-reveal section-gap section-divider pt-16'>
          <div className='text-eyebrow mb-1'>05</div>
          <h2 className='text-section border-b border-border-dim py-2 mb-6'>Contact</h2>
          <div className='flex flex-col gap-4'>
            <a href='mailto:dhiranpranav72@gmail.com' className='text-body text-t1 hover:text-accent transition-colors'>dhiranpranav72@gmail.com</a>
            <div className='flex gap-3 text-tag text-t3'>
              <a href='https://github.com/Pranav-d33' className='hover:text-t2 transition-colors'>GitHub</a>
              <span>·</span>
              <a href='https://linkedin.com/in/pranav-dhiran' className='hover:text-t2 transition-colors'>LinkedIn</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className='py-12 border-t border-border-dim/10 mt-10'>
          <div className='footer-gradient-line mb-8'></div>
          <div className='text-tag text-t3'>© {new Date().getFullYear()} Pranav Dhiran</div>
        </footer>
      </main>

      {/* BACK TO TOP */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full border border-border-dim bg-surface/80 backdrop-blur-sm flex items-center justify-center text-t3 hover:text-accent hover:border-accent transition-all duration-300 ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label='Scroll to top'
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </>
  );
}