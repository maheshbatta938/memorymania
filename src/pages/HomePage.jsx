import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Search, Code, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 px-3.5 py-1.5 rounded-full text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Shield size={14} className="animate-pulse" />
            <span>Encrypted Snippet Manager</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white tracking-tight">
            Store your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">important snippets</span> securely.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
            NotesApp is a professional, zero-knowledge developer stashing vault. Securely encrypt, quickly search, and easily share code notes from anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto flex items-center justify-center">
                Get Started
                <ArrowRight size={18} className="ml-1.5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex justify-center">
          <div className="relative w-full max-w-lg">
            {/* Glowing backdrop border */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl blur opacity-30 animate-tilt"></div>
            
            {/* Mock Editor Window */}
            <div className="relative bg-slate-950/95 dark:bg-slate-950/90 text-slate-100 rounded-xl border border-slate-800/80 shadow-2xl overflow-hidden font-mono text-sm">
              <div className="bg-slate-900/80 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3.5 h-3.5 bg-red-500 rounded-full opacity-80" />
                  <div className="w-3.5 h-3.5 bg-yellow-500 rounded-full opacity-80" />
                  <div className="w-3.5 h-3.5 bg-green-500 rounded-full opacity-80" />
                </div>
                <div className="text-xs text-slate-500 font-semibold flex items-center">
                  <Terminal size={12} className="mr-1.5" />
                  zero-knowledge-aes.js
                </div>
              </div>
              <pre className="p-5 overflow-x-auto whitespace-pre leading-relaxed select-none h-64">
                <code>
{`<span className="text-purple-400">import</span> CryptoJS <span className="text-purple-400">from</span> <span className="text-teal-300">'crypto-js'</span>;

<span className="text-gray-500">// Client-Side Zero-Knowledge Encryption</span>
<span className="text-blue-400">const</span> <span className="text-yellow-300">encryptSnippet</span> = (content, password) => {
  <span className="text-blue-400">return</span> CryptoJS.AES.<span className="text-yellow-300">encrypt</span>(
    content, 
    password
  ).<span className="text-yellow-300">toString</span>();
};

<span className="text-blue-400">const</span> payload = {
  title: <span className="text-teal-300">"API Keys"</span>,
  content: <span className="text-yellow-300">encryptSnippet</span>(rawKeys, userPass),
  isEncrypted: <span className="text-teal-400">true</span>
};`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200/55 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Designed for professional developers
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Clean features constructed to stash code snippets securely and make quick shares instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 flex flex-col items-start">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg text-purple-600 dark:text-purple-400 mb-5">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2.5">
                Zero-Knowledge Privacy
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Encrypt your code snippets locally in the browser using AES-256 before storage. Even our servers can never inspect your secret data.
              </p>
            </div>

            <div className="glass-card p-6 flex flex-col items-start">
              <div className="bg-teal-100 dark:bg-teal-900/50 p-3 rounded-lg text-teal-600 dark:text-teal-400 mb-5">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2.5">
                Instant Fuzzy Search
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Quickly locate stored files, config templates, and passwords using global search filtering by title, tag, content, or language.
              </p>
            </div>

            <div className="glass-card p-6 flex flex-col items-start">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-blue-600 dark:text-blue-400 mb-5">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2.5">
                Rich Code Highlighting
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Integrated VS-Code power editor featuring autocomplete, line numbering, copy-to-clipboard, file downloads, and public shared URLs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-r from-purple-800 to-teal-700 dark:from-purple-950/70 dark:to-teal-900/70 rounded-2xl p-10 md:p-16 text-center shadow-xl border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Ready to organize your stashes?
            </h2>
            <p className="text-purple-100 text-base md:text-lg">
              Join developers around the world using NotesApp to organize snippets, secure environment config templates, and share code easily.
            </p>
            <div className="pt-4">
              <Link to="/signup">
                <Button className="bg-white hover:bg-slate-100 text-purple-700 hover:text-purple-800 px-8 py-3.5 shadow-xl font-bold">
                  Start Storing Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;