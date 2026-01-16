import { useState, useMemo } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Settings,
  Database,
  LogOut,
  Menu,
  X,
  Calendar,
  ClipboardList,
  GraduationCap,
  Briefcase,
  Layers,
  TrendingUp,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// --- ТИПИ ДАНИХ ---
interface Group {
  id: string;
  name: string;
  studentsCount: number;
  maxStudents: number;
  progress: number;
  status: 'Активна' | 'Набір' | 'Завершена';
}

interface Teacher {
  id: string;
  name: string;
  role: string;
  load: string;
  groups: Group[];
}

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Викладачі');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  // --- ДАНІ ДЛЯ ПРИКЛАДУ ---
  const teachersData: Teacher[] = [
    {
      id: 't1',
      name: 'Олександр Михайленко',
      role: 'Senior JavaScript Mentor',
      load: '24 год/тижд',
      groups: [
        { id: 'g1', name: 'JS_PRO_01', studentsCount: 15, maxStudents: 20, progress: 65, status: 'Активна' },
        { id: 'g2', name: 'REACT_BASE_04', studentsCount: 12, maxStudents: 15, progress: 30, status: 'Активна' },
      ]
    },
    {
      id: 't2',
      name: 'Марія Ковальчук',
      role: 'UI/UX Design Lead',
      load: '16 год/тижд',
      groups: [
        { id: 'g3', name: 'FIGMA_START', studentsCount: 18, maxStudents: 18, progress: 90, status: 'Активна' },
      ]
    },
    {
      id: 't3',
      name: 'Дмитро Степанов',
      role: 'Python Developer',
      load: '32 год/тижд',
      groups: [
        { id: 'g4', name: 'PY_AUTO_01', studentsCount: 10, maxStudents: 15, progress: 15, status: 'Набір' },
        { id: 'g5', name: 'DJANGO_PRO', studentsCount: 14, maxStudents: 20, progress: 0, status: 'Набір' },
      ]
    }
  ];

  // --- ЛОГІКА ПОШУКУ ---
  const filteredTeachers = useMemo(() => {
    return teachersData.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.groups.some(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const menuConfig = [
    {
      title: 'Персонал',
      items: [
        { name: 'Викладачі', icon: <Briefcase size={18} />, desc: 'Навантаження та групи' },
        { name: 'Студенти', icon: <GraduationCap size={18} />, desc: 'Профілі та оплати' },
      ]
    },
    {
      title: 'Навчання',
      items: [
        { name: 'Групи та Класи', icon: <Layers size={18} />, desc: 'Керування складом' },
        { name: 'Журнал відвідуваності', icon: <ClipboardList size={18} />, desc: 'Відмітки Н та З' },
        { name: 'Розклад занять', icon: <Calendar size={18} />, desc: 'Планування уроків' },
      ]
    },
    {
      title: 'Система',
      items: [
        { name: 'Логи системи', icon: <Database size={18} />, desc: 'Дії адміністраторів' },
        { name: 'Налаштування', icon: <Settings size={18} />, desc: 'Доступи та ролі' },
      ]
    }
  ];

  return (
    <div className="relative min-h-screen w-full flex bg-[#0f172a] font-sans text-white overflow-hidden">

      {/* Background Decor */}
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
              {section.items.map((item) => (
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
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={20} /> <span>Вийти</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto no-scrollbar">

        {/* Sticky Header */}
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
                placeholder="Пошук викладача чи групи..."
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

        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto">

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Студентів', val: '248', up: '+12%', icon: <GraduationCap size={20} /> },
              { label: 'Активних груп', val: '18', up: 'Live', icon: <Layers size={20} /> },
              { label: 'Прибуток', val: '$4,200', up: '+5%', icon: <TrendingUp size={20} /> },
              { label: 'Відвідуваність', val: '94%', up: '-2%', icon: <ClipboardList size={20} /> },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">{s.icon}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.up.includes('+') || s.up === 'Live' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{s.up}</span>
                </div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                <h4 className="text-2xl font-black mt-1">{s.val}</h4>
              </div>
            ))}
          </div>

          {/* --- CONTENT AREA --- */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-2xl font-black tracking-tight italic">Списки та керування</h3>
              <div className="flex gap-3">
                <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all hover:bg-white/10">
                  <Filter size={18} />
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-600/30 active:scale-95">
                  <UserPlus size={16} /> ДОДАТИ НОВИЙ ЗАПИС
                </button>
              </div>
            </div>

            {/* Teacher Accordion List */}
            <div className="space-y-4">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-300">
                  {/* Teacher Row */}
                  <div
                    onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
                    className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${expandedTeacher === teacher.id ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center font-black text-indigo-300 shadow-inner">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-black text-lg leading-none mb-1.5">{teacher.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{teacher.role}</span>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <span className="text-[10px] text-indigo-400 font-mono">{teacher.load}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right max-sm:hidden">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Груп в роботі</p>
                        <p className="text-lg font-black">{teacher.groups.length}</p>
                      </div>
                      <div className={`p-2 rounded-full bg-white/5 transition-transform duration-500 ${expandedTeacher === teacher.id ? 'rotate-180 bg-indigo-500/20 text-indigo-400' : 'text-slate-500'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Groups Table */}
                  <div className={`transition-all duration-500 ease-in-out ${expandedTeacher === teacher.id ? 'max-h-[800px] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-6 bg-black/20">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                          <tr className="text-[10px] text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                            <th className="pb-4 font-black">Назва групи</th>
                            <th className="pb-4 font-black">Студенти</th>
                            <th className="pb-4 font-black">Прогрес</th>
                            <th className="pb-4 font-black">Статус</th>
                            <th className="pb-4 font-black text-right">Дія</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                          {teacher.groups.map((group) => (
                            <tr key={group.id} className="group/row hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 font-bold text-sm text-slate-200">{group.name}</td>
                              <td className="py-4">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-sm font-black text-white">{group.studentsCount}</span>
                                  <span className="text-[10px] text-slate-500">/ {group.maxStudents}</span>
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: expandedTeacher === teacher.id ? `${group.progress}%` : '0%' }}></div>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400">{group.progress}%</span>
                                </div>
                              </td>
                              <td className="py-4">
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${group.status === 'Активна' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                    {group.status}
                                  </span>
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"><Settings size={14}/></button>
                                  <button className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white text-[10px] font-black rounded-lg transition-all border border-indigo-500/20">ЖУРНАЛ</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                      <button className="w-full mt-4 py-3 border border-dashed border-white/10 rounded-2xl text-[10px] uppercase font-black text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all active:scale-[0.99]">
                        + Призначити нову групу викладачу
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

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