import { useState } from 'react';
import {
  ShieldCheck, LogOut, Menu, X, Search, ChevronDown
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  logout: () => void;
  menuConfig: any[];
}

export default function AdminLayout({
                                      children,
                                      activeTab,
                                      setActiveTab,
                                      searchQuery,
                                      setSearchQuery,
                                      logout,
                                      menuConfig
                                    }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex bg-[#0f172a] font-sans text-white overflow-hidden">

      {/* Background Decor (залишаємо як було) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]"></div>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`fixed md:relative z-50 h-screen transition-all duration-300 ${isMobileMenuOpen ? 'left-0' : '-left-full md:left-0'} w-72 bg-white/5 backdrop-blur-3xl border-r border-white/10 p-6 flex flex-col`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight italic">CRM_LMS</span>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-2">
          {menuConfig.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">{section.title}</h3>
              {section.items.map((item: any) => (
                <button
                  key={item.name}
                  onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${activeTab === item.name ? 'bg-indigo-500/20 text-white border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}
                >
                  <span className={activeTab === item.name ? 'text-indigo-400' : 'group-hover:text-indigo-300'}>{item.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm leading-none mb-1">{item.name}</p>
                    <p className="text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors whitespace-nowrap">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={20} /> <span>Вийти</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto no-scrollbar">

        {/* --- HEADER --- */}
        <header className="flex items-center justify-between p-6 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 bg-white/5 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-black tracking-tight">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative max-md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-64"
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right max-sm:hidden">
                <p className="text-xs font-bold leading-none">Admin_User</p>
                <p className="text-[10px] text-green-400 mt-1 font-mono">online</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black shadow-lg">AD</div>
            </div>
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}