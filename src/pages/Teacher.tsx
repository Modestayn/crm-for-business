import { useState, useEffect } from 'react';
import { api } from '../api/auth';
import {
  Users,
  GraduationCap,
  Clock,
  Star,
  Save
} from 'lucide-react';

// --- ТИПИ ---
interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  pivot: {
    grade: number;
  };
}

interface Group {
  id: number;
  name: string;
  status: string;
  progress: number;
  students: Student[];
}

export default function Teacher() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [editingGrade, setEditingGrade] = useState<{ studentId: number, grade: number } | null>(null);

  // 1. Завантаження груп та студентів
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/api/teacher/groups');
      if (response.data.status === 'success') {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.error("Помилка завантаження даних викладача:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Оновлення оцінки
  const handleUpdateGrade = async (groupId: number, studentId: number) => {
    if (!editingGrade) return;

    try {
      await api.patch(`/api/teacher/groups/${groupId}/students/${studentId}/grade`, {
        grade: editingGrade.grade
      });

      // Оновлюємо локальний стейт, щоб не перевантажувати всю сторінку
      setGroups(prev => prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            students: g.students.map(s => s.id === studentId ? { ...s, pivot: { ...s.pivot, grade: editingGrade.grade } } : s)
          };
        }
        return g;
      }));
      setEditingGrade(null);
    } catch (error) {
      alert("Не вдалося оновити оцінку");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-indigo-600 animate-pulse">
      ЗАВАНТАЖЕННЯ КАБІНЕТУ...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Мій Кабінет</h1>
          <p className="text-slate-500 font-medium">Керування групами та успішністю студентів</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Список груп */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Users size={16} /> Мої Групи
            </h2>
            {groups.map(group => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                  selectedGroup?.id === group.id
                    ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-500/10'
                    : 'border-transparent bg-white/50 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-black text-lg">{group.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    group.status === 'Активна' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {group.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1"><GraduationCap size={14}/> {group.students.length}</div>
                  <div className="flex items-center gap-1"><Clock size={14}/> {group.progress}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Список студентів вибраної групи */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black">Студенти: {selectedGroup.name}</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-tighter border-b border-slate-50">
                      <th className="pb-4">Студент</th>
                      <th className="pb-4 text-center">Поточна оцінка</th>
                      <th className="pb-4 text-right">Дія</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {selectedGroup.students.map(student => (
                      <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-bold text-slate-700">
                          {student.first_name} {student.last_name}
                          <p className="text-[10px] text-slate-400 font-medium">{student.email}</p>
                        </td>
                        <td className="py-4 text-center">
                          {editingGrade?.studentId === student.id ? (
                            <input
                              type="number"
                              className="w-16 p-1 border-2 border-indigo-500 rounded-lg text-center font-bold"
                              value={editingGrade.grade}
                              onChange={(e) => setEditingGrade({ studentId: student.id, grade: parseInt(e.target.value) })}
                              autoFocus
                            />
                          ) : (
                            <span className={`font-black text-lg ${student.pivot.grade >= 90 ? 'text-green-500' : 'text-indigo-500'}`}>
                                {student.pivot.grade}
                              </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          {editingGrade?.studentId === student.id ? (
                            <button
                              onClick={() => handleUpdateGrade(selectedGroup.id, student.id)}
                              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                            >
                              <Save size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingGrade({ studentId: student.id, grade: student.pivot.grade })}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            >
                              <Star size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10">
                <Users size={48} className="mb-4 opacity-20" />
                <p className="font-bold">Оберіть групу зліва, щоб переглянути студентів</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}