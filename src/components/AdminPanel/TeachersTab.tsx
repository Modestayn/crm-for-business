import { UserPlus, Filter, ChevronDown, Settings } from 'lucide-react';
import type { Teacher } from '../../types/admin.ts';

interface TeachersTabProps {
  teachers: Teacher[];
  expandedTeacher: string | null;
  setExpandedTeacher: (id: string | null) => void;
}

export default function TeachersTab({ teachers, expandedTeacher, setExpandedTeacher }: TeachersTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-black tracking-tight italic">Викладачі та групи</h3>
        <div className="flex gap-3">
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-600/30">
            <UserPlus size={16} /> ДОДАТИ ВИКЛАДАЧА
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {teachers.length > 0 ? teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-300">
            <div
              onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
              className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${
                expandedTeacher === teacher.id ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'
              }`}
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
                <div className={`p-2 rounded-full bg-white/5 transition-transform duration-500 ${
                  expandedTeacher === teacher.id ? 'rotate-180 bg-indigo-500/20 text-indigo-400' : 'text-slate-500'
                }`}>
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${
              expandedTeacher === teacher.id ? 'max-h-[800px] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <div className="p-6 bg-black/20 overflow-x-auto">
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
                      <td className="py-4 text-sm font-black">{group.studentsCount} <span className="text-[10px] text-slate-500">/ {group.maxStudents}</span></td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${group.progress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{group.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-[9px] font-black uppercase">
                        <span className={group.status === 'Активна' ? 'text-green-400' : 'text-amber-400'}>{group.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white text-[10px] font-black rounded-lg transition-all border border-indigo-500/20">ЖУРНАЛ</button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-slate-500 font-bold italic">Записів не знайдено</div>
        )}
      </div>
    </div>
  );
}