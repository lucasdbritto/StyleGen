/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard ,
  LayoutTemplate, 
  Archive, 
  Settings, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Palette,
  Type as TypeIcon,
  Layout as LayoutIcon,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  Loader2,
  Share2,
  X,
  Save,
  FileText,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, StyleGuide, ArchivedGuide } from './types';
import { generateStyleGuide } from './services/gemini';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- Components ---

const Header = ({ currentPage, setPage, onOpenSettings, onOpenHelp }: { 
  currentPage: Page, 
  setPage: (p: Page) => void,
  onOpenSettings: () => void,
  onOpenHelp: () => void
}) => (
  <header className="fixed top-0 w-full z-50 glass-header shadow-[0_40px_40px_rgba(0,0,0,0.06)]">
    <nav className="flex justify-between items-center px-8 h-20 w-full">
      <div 
        className="font-brand text-2xl tracking-wider text-primary cursor-pointer"
        onClick={() => setPage('dashboard')}
      >
        StyleGen
      </div>
      <div className="hidden md:flex items-center gap-8 font-body text-sm font-semibold tracking-tight">
        <button 
          onClick={() => setPage('dashboard')}
          className={`${currentPage === 'dashboard' ? 'text-primary border-b-2 border-primary-container pb-1' : 'text-on-surface/60 hover:text-secondary'} transition-all duration-300 ease-out`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setPage('templates')}
          className={`${currentPage === 'templates' ? 'text-primary border-b-2 border-primary-container pb-1' : 'text-on-surface/60 hover:text-secondary'} transition-all duration-300 ease-out`}
        >
          Templates
        </button>
        <button 
          onClick={() => setPage('archives')}
          className={`${currentPage === 'archives' ? 'text-primary border-b-2 border-primary-container pb-1' : 'text-on-surface/60 hover:text-secondary'} transition-all duration-300 ease-out`}
        >
          Archives
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSettings}
          className="text-on-surface/60 hover:text-secondary transition-colors"
        >
          <Settings size={20} />
        </button>
        <button 
          onClick={onOpenHelp}
          className="text-on-surface/60 hover:text-secondary transition-colors"
        >
          <HelpCircle size={20} />
        </button>
        <button 
          onClick={() => setPage('dashboard')}
          className="ml-2 px-6 py-2.5 rounded-full luminous-gradient text-on-primary font-bold text-sm active:scale-95 transition-transform"
        >
          New Guide
        </button>
      </div>
    </nav>
  </header>
);

const Footer = ({ onShare }: { onShare: () => void }) => (
  <footer className="w-full py-12 border-t border-white/10 bg-surface mt-auto">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-8">
      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="font-brand text-lg text-primary">StyleGen</div>
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface/40">
          © 2024 LUMINOUS EDITOR. BUILT FOR PRECISION.
        </p>
      </div>
      <div className="flex gap-8 font-body text-xs uppercase tracking-widest text-on-surface/40">
        <button onClick={() => alert("Em breve!")} className="hover:text-secondary transition-colors">Privacy</button>
        <button onClick={() => alert("Em breve!")} className="hover:text-secondary transition-colors">Terms</button>
        <button onClick={() => alert("Em breve!")} className="hover:text-secondary transition-colors">API Documentation</button>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={onShare}
          className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
        >
          <Share2 size={14} className="text-on-surface/60" />
        </button>
      </div>
    </div>
  </footer>
);

// --- Views ---

const Dashboard = ({ onGenerate }: { onGenerate: (prompt: string) => void }) => {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-secondary text-xs font-bold tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          Inteligência Criativa
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-8 leading-tight">
          É um prazer recebê-lo em nossa plataforma.
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Compreendemos a importância da sua jornada e estamos à inteira disposição para caminhar ao seu lado com total dedicação e cuidado.
        </p>
      </section>

      <section className="w-full max-w-3xl mb-24">
        <div className="relative group">
          <div className="absolute -inset-1 luminous-gradient rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
          <form 
            onSubmit={(e) => { e.preventDefault(); if (input.trim()) onGenerate(input); }}
            className="relative flex flex-col md:flex-row gap-4 p-3 bg-surface-container-low rounded-[2.5rem]"
          >
            <div className="flex-grow flex items-center px-6">
              <Sparkles className="text-outline mr-4" size={24} />
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline font-body text-lg py-4"
                placeholder="Ex: site para uma cafeteria jovem"
              />
            </div>
            <button 
              type="submit"
              className="luminous-gradient text-on-primary px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/20 active:scale-95 transition-all duration-300 whitespace-nowrap"
            >
              Gerar Guia
            </button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
        <div className="md:col-span-2 group">
          <div className="h-full p-10 rounded-lg bg-surface-container-low transition-colors duration-500 hover:bg-surface-container-high border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageSquare size={80} />
            </div>
            <h3 className="font-headline text-2xl font-bold text-primary mb-4">Tom de Voz</h3>
            <p className="text-on-surface/60 font-body text-sm leading-relaxed max-w-[200px]">
              Definição da personalidade verbal e diretrizes de comunicação para sua marca.
            </p>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="h-full p-10 rounded-lg bg-surface-container-low transition-colors duration-500 hover:bg-surface-container-high border-none relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4">Paleta de Cores</h3>
                <p className="text-on-surface/60 font-body text-sm leading-relaxed max-w-md">
                  Harmonias cromáticas baseadas na psicologia das cores e tendências do setor escolhido.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-full bg-primary shadow-inner"></div>
                <div className="w-12 h-12 rounded-full bg-secondary shadow-inner"></div>
                <div className="w-12 h-12 rounded-full bg-surface-container-highest shadow-inner"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="h-full p-10 rounded-lg bg-surface-container-low transition-colors duration-500 hover:bg-surface-container-high border-none relative overflow-hidden group">
            <h3 className="font-headline text-2xl font-bold text-primary mb-4">Tipografia</h3>
            <p className="text-on-surface/60 font-body text-sm leading-relaxed mb-6">
              Seleção criteriosa de famílias tipográficas que equilibram estética e legibilidade.
            </p>
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-5xl font-bold text-on-surface/20 group-hover:text-primary/40 transition-colors">Aa</span>
              <span className="font-body text-3xl font-light text-on-surface/10 group-hover:text-primary/20 transition-colors">Abc</span>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="p-8 rounded-lg bg-surface-container-low transition-colors duration-500 hover:bg-surface-container-high border-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-secondary/20 flex items-center justify-center">
                <LayoutIcon className="text-secondary text-xl" size={20} />
              </div>
              <h3 className="font-headline text-xl font-bold text-primary">Layout e Componentes</h3>
            </div>
          </div>
          <div className="p-8 rounded-lg bg-surface-container-low transition-colors duration-500 hover:bg-surface-container-high border-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                <Lightbulb className="text-primary text-xl" size={20} />
              </div>
              <h3 className="font-headline text-xl font-bold text-primary">Racional de Design</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Templates = ({ onSelect }: { onSelect: (t: string) => void }) => {
  const templates = [
    { title: 'E-commerce', category: 'Varejo Digital', desc: 'Focado em conversão e experiência de compra premium.', color: 'text-secondary', icon: <Palette size={48} /> },
    { title: 'SaaS', category: 'Tecnologia', desc: 'Interface técnica e limpa, ideal para plataformas de software.', color: 'text-primary', icon: <LayoutIcon size={48} /> },
    { title: 'Blog', category: 'Conteúdo', desc: 'Layout editorial focado em legibilidade e hierarquia.', color: 'text-on-surface-variant', icon: <MessageSquare size={48} /> },
    { title: 'Portfólio', category: 'Criativos', desc: 'Destaque seu trabalho com grids assimétricos e impacto visual.', color: 'text-secondary', icon: <Sparkles size={48} />, large: true },
    { title: 'App Mobile', category: 'Mobile', desc: 'Componentes otimizados para toque e fluxos intuitivos.', color: 'text-primary', icon: <LayoutIcon size={48} /> },
    { title: 'Institucional', category: 'Corporativo', desc: 'Transmita credibilidade e solidez com layouts estruturados.', color: 'text-on-surface-variant', icon: <Archive size={48} /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="mb-20 max-w-3xl">
        <h1 className="font-brand text-6xl md:text-8xl text-white leading-tight mb-6 tracking-tighter text-glow">
          Templates de Design
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-2xl">
          Escolha um ponto de partida para o seu próximo guia de estilo. Estruturas prontas, pensadas para converter e encantar.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((t, i) => (
          <div 
            key={i}
            onClick={() => onSelect(t.title)}
            className={`group relative bg-surface-container-low rounded-lg p-8 hover:bg-surface-container-high transition-all duration-500 ease-out cursor-pointer overflow-hidden ${t.large ? 'lg:col-span-2' : ''}`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
              {t.icon}
            </div>
            <div className="relative z-10">
              <div className="h-48 mb-8 rounded-lg overflow-hidden bg-surface-container-highest flex items-center justify-center">
                <img 
                  src={`https://picsum.photos/seed/${t.title}/800/600`} 
                  alt={t.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <span className={`inline-block text-xs font-bold uppercase tracking-widest ${t.color} mb-3`}>{t.category}</span>
              <h3 className="font-headline text-2xl font-bold text-white mb-3">{t.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{t.desc}</p>
              <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Explorar <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-surface-container-low border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h3 className="font-headline text-xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-on-surface/60 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-8">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Archives = ({ 
  archives, 
  onDelete, 
  onView, 
  onEdit,
  onExport
}: { 
  archives: ArchivedGuide[], 
  onDelete: (id: string) => void,
  onView: (guide: ArchivedGuide) => void,
  onEdit: (guide: ArchivedGuide) => void,
  onExport: (guide: ArchivedGuide) => void
}) => {
  const [search, setSearch] = useState('');
  
  const filtered = archives.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.layout.style.toLowerCase().includes(search.toLowerCase())
  );

  const recent = archives.length > 0 ? archives[0] : null;

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen">
      <header className="mb-16">
        <h1 className="font-brand text-5xl md:text-7xl text-white mb-4 tracking-tight leading-none">Seus Arquivos</h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-light">Gerencie e acesse todos os guias de estilo que você já criou.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 bg-surface-container-low rounded-lg p-10 relative overflow-hidden group hover:bg-surface-container-high transition-all duration-500 border border-white/5">
          {recent ? (
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Mais Recente</span>
                  <span className="text-on-surface/40 text-xs uppercase tracking-widest">Criado em {recent.date}</span>
                </div>
                <h3 className="font-brand text-4xl text-white mb-2">{recent.name}</h3>
                <p className="text-on-surface-variant font-light max-w-sm">{recent.designRationale.substring(0, 150)}...</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-12">
                <button 
                  onClick={() => onView(recent)}
                  className="luminous-gradient text-on-primary font-bold px-8 py-3 rounded-full flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Eye size={18} /> Visualizar
                </button>
                <button 
                  onClick={() => onEdit(recent)}
                  className="bg-surface-container-highest text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-all active:scale-95"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onExport(recent)}
                  className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all"
                  title="Exportar PDF"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
              <Archive size={48} className="text-on-surface/20 mb-4" />
              <p className="text-on-surface/40">Nenhum projeto arquivado ainda.</p>
            </div>
          )}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-bl from-primary/30 to-transparent blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        <div className="md:col-span-4 bg-surface-container-low rounded-lg p-10 flex flex-col justify-between border border-white/5">
          <div>
            <h4 className="text-on-surface/40 text-xs uppercase tracking-widest mb-8">Resumo da Biblioteca</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-on-surface/60">Total de Projetos</span>
                <span className="text-3xl font-headline font-bold text-white">{archives.length}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-on-surface/60">Status: Publicado</span>
                <span className="text-3xl font-headline font-bold text-secondary">
                  {archives.filter(a => a.status === 'Publicado').length}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-surface-container-highest rounded-xl p-4 flex items-center gap-3">
              <Archive className="text-on-surface/40" size={18} />
              <input 
                className="bg-transparent border-none text-white placeholder:text-on-surface/20 focus:ring-0 w-full text-sm" 
                placeholder="Buscar arquivos..." 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-12 mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left">
                  <th className="px-6 py-4 text-on-surface/40 text-xs uppercase tracking-widest font-normal">Nome do Projeto</th>
                  <th className="px-6 py-4 text-on-surface/40 text-xs uppercase tracking-widest font-normal">Criado em</th>
                  <th className="px-6 py-4 text-on-surface/40 text-xs uppercase tracking-widest font-normal">Status</th>
                  <th className="px-6 py-4 text-on-surface/40 text-xs uppercase tracking-widest font-normal text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                    <td className="px-6 py-6 rounded-l-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Palette className="text-primary" size={20} />
                        </div>
                        <div>
                          <div className="text-white font-bold font-headline text-lg">{a.name}</div>
                          <div className="text-on-surface/40 text-xs">{a.layout.style}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-on-surface/40 text-sm">{a.date}</td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${a.status === 'Publicado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-on-surface/10 text-on-surface/40'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 rounded-r-lg text-right">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onView(a)}
                          className="p-2 hover:text-white transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => onEdit(a)}
                          className="p-2 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => onExport(a)}
                          className="p-2 hover:text-white transition-colors"
                          title="Exportar PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(a.id)}
                          className="p-2 hover:text-red-400 transition-colors"
                          title="Deletar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-on-surface/20 italic">
                      Nenhum resultado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuideResult = ({ 
  guide, 
  onBack, 
  onSave,
  isSaved 
}: { 
  guide: StyleGuide, 
  onBack: () => void,
  onSave: (name: string) => void,
  isSaved: boolean
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [projectName, setProjectName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    
    try {
      // Esperar fontes carregarem
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      // Pequeno atraso para garantir que o layout estabilizou
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1C1B1B',
        logging: false,
        allowTaint: false,
        imageTimeout: 15000,
        ignoreElements: (element) => element.classList.contains('motion-reduce')
      });
      
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Calcular dimensões para caber em uma única página longa
      const imgProps = { width: canvas.width, height: canvas.height };
      const pdfWidth = 210; // Largura A4 em mm
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Criar PDF com tamanho customizado (página única sem cortes)
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      pdf.save(`guia-estilo-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Houve um problema ao gerar o PDF. Por favor, tente novamente ou use a opção de exportar da lista de projetos.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="text-on-surface/60 hover:text-primary flex items-center gap-2 transition-colors"
        >
          <ArrowRight size={16} className="rotate-180" /> Voltar
        </button>
        <div className="flex gap-3">
          {!isSaved && (
            <button 
              onClick={() => setShowSaveDialog(true)}
              className="px-6 py-2 rounded-full bg-surface-container-high text-white font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Save size={16} /> Salvar no Arquivo
            </button>
          )}
          <button 
            onClick={handleExportPDF}
            className="px-6 py-2 rounded-full luminous-gradient text-on-primary font-bold text-sm flex items-center gap-2"
          >
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </div>

      <div ref={printRef} className="rounded-lg p-12" style={{ backgroundColor: '#1C1B1B', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div className="flex justify-between items-start mb-12">
          <h2 className="font-brand text-4xl" style={{ color: '#ffffff' }}>Guia de Estilo Gerado</h2>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(229, 226, 225, 0.4)' }}>Gerado por StyleGen AI</p>
            <p className="text-xs" style={{ color: 'rgba(229, 226, 225, 0.4)' }}>{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="space-y-16">
          {/* Tom de Voz */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <MessageSquare style={{ color: '#F9ABFF' }} />
              <h3 className="font-headline text-2xl font-bold" style={{ color: '#DCE1FF' }}>🗣️ Tom de Voz</h3>
            </div>
            <p className="text-lg mb-6 font-medium" style={{ color: '#E5E2E1' }}>{guide.toneOfVoice.style}</p>
            <ul className="space-y-3">
              {guide.toneOfVoice.examples.map((ex, i) => (
                <li key={i} className="flex items-start gap-3 italic" style={{ color: '#C6C5D0' }}>
                  <CheckCircle2 size={18} style={{ color: '#F9ABFF' }} className="shrink-0 mt-1" />
                  "{ex}"
                </li>
              ))}
            </ul>
          </section>

          {/* Paleta de Cores */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <Palette style={{ color: '#F9ABFF' }} />
              <h3 className="font-headline text-2xl font-bold" style={{ color: '#DCE1FF' }}>🎨 Paleta de Cores</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {guide.colorPalette.map((color, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div 
                    className="h-24 rounded-lg" 
                    style={{ backgroundColor: color.hex, border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}
                  />
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#ffffff' }}>{color.name}</p>
                    <p className="font-mono text-xs mb-2 uppercase" style={{ color: '#F9ABFF' }}>{color.hex}</p>
                    <p className="text-[10px] leading-tight" style={{ color: '#C6C5D0' }}>{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tipografia */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <TypeIcon style={{ color: '#F9ABFF' }} />
              <h3 className="font-headline text-2xl font-bold" style={{ color: '#DCE1FF' }}>🔡 Tipografia</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F9ABFF' }}>Títulos</p>
                <p className="text-4xl font-bold mb-4" style={{ fontFamily: guide.typography.headings.name, color: '#ffffff' }}>
                  {guide.typography.headings.name}
                </p>
                <p className="text-sm leading-relaxed italic" style={{ color: '#C6C5D0' }}>
                  {guide.typography.headings.justification}
                </p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F9ABFF' }}>Corpo</p>
                <p className="text-xl mb-4" style={{ fontFamily: guide.typography.body.name, color: '#E5E2E1' }}>
                  {guide.typography.body.name}
                </p>
                <p className="text-sm leading-relaxed italic" style={{ color: '#C6C5D0' }}>
                  {guide.typography.body.justification}
                </p>
              </div>
            </div>
          </section>

          {/* Layout e Componentes */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <LayoutIcon style={{ color: '#F9ABFF' }} />
              <h3 className="font-headline text-2xl font-bold" style={{ color: '#DCE1FF' }}>🧩 Layout e Componentes</h3>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F9ABFF' }}>Estilo Visual</span>
                <p style={{ color: '#E5E2E1' }}>{guide.layout.style}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F9ABFF' }}>Botões</span>
                <p style={{ color: '#E5E2E1' }}>{guide.layout.buttons}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F9ABFF' }}>Cards e Navegação</span>
                <p style={{ color: '#E5E2E1' }}>{guide.layout.cardsAndNav}</p>
              </div>
            </div>
          </section>

          {/* Racional de Design */}
          <section className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(220, 225, 255, 0.05)', border: '1px solid rgba(220, 225, 255, 0.1)' }}>
            <div className="flex items-center gap-4 mb-6">
              <Lightbulb style={{ color: '#DCE1FF' }} />
              <h3 className="font-headline text-2xl font-bold" style={{ color: '#DCE1FF' }}>💡 Racional de Design</h3>
            </div>
            <p className="leading-relaxed italic" style={{ color: '#C6C5D0' }}>
              {guide.designRationale}
            </p>
          </section>
        </div>
      </div>

      <Modal 
        isOpen={showSaveDialog} 
        onClose={() => setShowSaveDialog(false)} 
        title="Salvar Projeto"
      >
        <div className="space-y-6">
          <p className="text-on-surface-variant text-sm">Dê um nome ao seu projeto para salvá-lo em seus arquivos.</p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-widest">Nome do Projeto</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ex: Agência Lumos"
              className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => {
              if (projectName.trim()) {
                onSave(projectName);
                setShowSaveDialog(false);
              }
            }}
            disabled={!projectName.trim()}
            className="w-full py-4 rounded-xl luminous-gradient text-on-primary font-bold active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            Confirmar e Salvar
          </button>
        </div>
      </Modal>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<StyleGuide | null>(null);
  const [archives, setArchives] = useState<ArchivedGuide[]>(() => {
    const saved = localStorage.getItem('stylegen_archives');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [viewingSavedId, setViewingSavedId] = useState<string | null>(null);
  const [editingGuide, setEditingGuide] = useState<ArchivedGuide | null>(null);
  const [exportingGuide, setExportingGuide] = useState<StyleGuide | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('stylegen_archives', JSON.stringify(archives));
  }, [archives]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    setGuide(null);
    setViewingSavedId(null);
    try {
      const result = await generateStyleGuide(prompt);
      setGuide(result);
      setPage('dashboard');
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao gerar o guia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (name: string) => {
    if (!guide) return;
    const newArchive: ArchivedGuide = {
      ...guide,
      id: Date.now().toString(),
      name,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Publicado'
    };
    setArchives([newArchive, ...archives]);
    setViewingSavedId(newArchive.id);
    showToast("Projeto salvo com sucesso!");
  };

  const handleDelete = (id: string) => {
    setArchives(archives.filter(a => a.id !== id));
    if (viewingSavedId === id) {
      setGuide(null);
      setViewingSavedId(null);
    }
    showToast("Projeto excluído.");
  };

  const handleView = (savedGuide: ArchivedGuide) => {
    setGuide(savedGuide);
    setViewingSavedId(savedGuide.id);
    setPage('dashboard');
  };

  const handleEdit = (savedGuide: ArchivedGuide) => {
    setEditingGuide(savedGuide);
  };

  const handleUpdateProject = (newName: string, newStatus: 'Rascunho' | 'Publicado') => {
    if (!editingGuide) return;
    setArchives(archives.map(a => a.id === editingGuide.id ? { ...a, name: newName, status: newStatus } : a));
    setEditingGuide(null);
    showToast("Projeto atualizado!");
  };

  const handleExport = async (guideToExport: ArchivedGuide) => {
    setExportingGuide(guideToExport);
    
    // Esperar fontes carregarem
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Esperar o container oculto renderizar
    setTimeout(async () => {
      if (exportRef.current) {
        try {
          const canvas = await html2canvas(exportRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#1C1B1B',
            logging: false,
            allowTaint: false,
            imageTimeout: 15000
          });
          
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          
          // Calcular dimensões para caber em uma única página longa
          const imgProps = { width: canvas.width, height: canvas.height };
          const pdfWidth = 210; // Largura A4 em mm
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          // Criar PDF com tamanho customizado (página única sem cortes)
          const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
          });
          
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          
          pdf.save(`projeto-${guideToExport.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
        } catch (error) {
          console.error('Erro ao exportar PDF:', error);
          alert('Erro ao gerar o PDF. Tente novamente.');
        }
      }
      setExportingGuide(null);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentPage={page} 
        setPage={(p) => { setPage(p); setGuide(null); setViewingSavedId(null); }} 
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
      />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <Loader2 size={64} className="text-primary animate-spin mb-8" />
              <h2 className="font-headline text-2xl font-bold text-white mb-2">Criando seu Guia de Estilo...</h2>
              <p className="text-on-surface-variant">Nossa IA está analisando as melhores tendências para o seu tema.</p>
            </motion.div>
          ) : guide ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GuideResult 
                guide={guide} 
                onBack={() => { setGuide(null); setViewingSavedId(null); }} 
                onSave={handleSave}
                isSaved={!!viewingSavedId}
              />
            </motion.div>
          ) : page === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Dashboard onGenerate={handleGenerate} />
            </motion.div>
          ) : page === 'templates' ? (
            <motion.div
              key="templates"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Templates onSelect={handleGenerate} />
            </motion.div>
          ) : (
            <motion.div
              key="archives"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Archives 
                archives={archives} 
                onDelete={handleDelete}
                onView={handleView}
                onEdit={handleEdit}
                onExport={handleExport}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onShare={() => {
        navigator.clipboard.writeText(window.location.href);
        showToast("Link copiado para a área de transferência!");
      }} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Export Container */}
      {exportingGuide && (
        <div className="fixed -left-[9999px] top-0 w-[800px]">
          <div ref={exportRef} className="p-12" style={{ backgroundColor: '#1C1B1B', color: '#ffffff' }}>
            <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-8">
              <div>
                <h1 className="text-5xl font-brand mb-2" style={{ color: '#ffffff' }}>Guia de Estilo</h1>
                <p className="text-xl font-headline" style={{ color: '#DCE1FF' }}>{exportingGuide.name || 'Projeto StyleGen'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(229, 226, 225, 0.4)' }}>Gerado por StyleGen AI</p>
                <p className="text-xs" style={{ color: 'rgba(229, 226, 225, 0.4)' }}>{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="space-y-16">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-headline font-bold" style={{ color: '#DCE1FF' }}>🗣️ Tom de Voz</h2>
                </div>
                <p className="text-lg mb-6" style={{ color: '#E5E2E1' }}>{exportingGuide.toneOfVoice.style}</p>
                <ul className="space-y-3">
                  {exportingGuide.toneOfVoice.examples.map((ex, i) => (
                    <li key={i} className="italic" style={{ color: '#C6C5D0' }}>"{ex}"</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-headline font-bold mb-8" style={{ color: '#DCE1FF' }}>🎨 Paleta de Cores</h2>
                <div className="grid grid-cols-5 gap-4">
                  {exportingGuide.colorPalette.map((c, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="h-20 rounded-lg border" style={{ backgroundColor: c.hex, borderColor: 'rgba(255,255,255,0.1)' }}></div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: '#ffffff' }}>{c.name}</p>
                        <p className="font-mono text-xs" style={{ color: '#F9ABFF' }}>{c.hex}</p>
                        <p className="text-[10px] leading-tight" style={{ color: '#C6C5D0' }}>{c.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-headline font-bold mb-8" style={{ color: '#DCE1FF' }}>🔡 Tipografia</h2>
                <div className="grid grid-cols-2 gap-12">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F9ABFF' }}>Títulos</p>
                    <p className="text-4xl font-bold mb-4" style={{ fontFamily: exportingGuide.typography.headings.name, color: '#ffffff' }}>
                      {exportingGuide.typography.headings.name}
                    </p>
                    <p className="text-sm italic" style={{ color: '#C6C5D0' }}>{exportingGuide.typography.headings.justification}</p>
                  </div>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F9ABFF' }}>Corpo</p>
                    <p className="text-xl mb-4" style={{ fontFamily: exportingGuide.typography.body.name, color: '#E5E2E1' }}>
                      {exportingGuide.typography.body.name}
                    </p>
                    <p className="text-sm italic" style={{ color: '#C6C5D0' }}>{exportingGuide.typography.body.justification}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-headline font-bold mb-8" style={{ color: '#DCE1FF' }}>🧩 Layout e Componentes</h2>
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F9ABFF' }}>Estilo Visual</span>
                    <p style={{ color: '#E5E2E1' }}>{exportingGuide.layout.style}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F9ABFF' }}>Botões</span>
                    <p style={{ color: '#E5E2E1' }}>{exportingGuide.layout.buttons}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F9ABFF' }}>Cards e Navegação</span>
                    <p style={{ color: '#E5E2E1' }}>{exportingGuide.layout.cardsAndNav}</p>
                  </div>
                </div>
              </section>

              <section className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(220, 225, 255, 0.05)', border: '1px solid rgba(220, 225, 255, 0.1)' }}>
                <h2 className="text-2xl font-headline font-bold mb-4" style={{ color: '#DCE1FF' }}>💡 Racional de Design</h2>
                <p className="italic leading-relaxed" style={{ color: '#C6C5D0' }}>{exportingGuide.designRationale}</p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Configurações">
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest">Preferências de IA</h4>
            <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl">
              <span className="text-white text-sm">Criatividade Elevada</span>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest">Conta</h4>
            <div className="p-4 bg-surface-container-highest rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">L</div>
              <div>
                <p className="text-white text-sm font-bold">Lucas G.</p>
                <p className="text-on-surface/40 text-xs">Plano Pro Ativo</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              alert("Configurações salvas com sucesso!");
              setShowSettings(false);
            }}
            className="w-full py-4 rounded-xl luminous-gradient text-on-primary font-bold active:scale-95 transition-all"
          >
            Salvar Alterações
          </button>
        </div>
      </Modal>

      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Central de Ajuda">
        <div className="space-y-6">
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={16} />
              <span className="font-bold text-sm">Como funciona?</span>
            </div>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Digite o tema do seu projeto (ex: "Cafeteria Cyberpunk") e nossa IA gerará um guia completo de UI/UX em segundos.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <FileText className="text-secondary" size={18} />
              <span className="text-white text-sm">Documentação da API</span>
              <ExternalLink size={14} className="ml-auto text-on-surface/20" />
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <MessageSquare className="text-secondary" size={18} />
              <span className="text-white text-sm">Suporte via Chat</span>
              <ExternalLink size={14} className="ml-auto text-on-surface/20" />
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={!!editingGuide} 
        onClose={() => setEditingGuide(null)} 
        title="Editar Projeto"
      >
        {editingGuide && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-widest">Nome do Projeto</label>
              <input 
                type="text" 
                defaultValue={editingGuide.name}
                id="rename-input"
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-widest">Status</label>
              <select 
                id="status-input"
                defaultValue={editingGuide.status}
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
              >
                <option value="Publicado">Publicado</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setEditingGuide(null)}
                className="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const nameInput = document.getElementById('rename-input') as HTMLInputElement;
                  const statusInput = document.getElementById('status-input') as HTMLSelectElement;
                  if (nameInput.value.trim()) {
                    handleUpdateProject(nameInput.value.trim(), statusInput.value as any);
                  }
                }}
                className="flex-[2] py-4 rounded-xl luminous-gradient text-on-primary font-bold active:scale-95 transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 -left-64 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 -right-64 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div> 
  );
}
