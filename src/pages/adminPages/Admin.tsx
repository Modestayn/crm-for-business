import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../api/auth.ts';

import AdminLayout from '../../components/AdminPanel/AdminLayout.tsx';
import StatsBar from '../../components/AdminPanel/StatusBar.tsx';
import TeachersTab from '../../components/AdminPanel/TeachersTab.tsx';

import type { Teacher, DashboardStats } from '../../types/admin.ts';

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Головна');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/users')
        ]);

        if (statsRes.data.status === 'success') {
          const s = statsRes.data.data.teacher_stats;
          setStats({
            students: { val: s.total_students.toString(), up: '+12%' },
            groups: { val: s.active_groups.toString(), up: 'Live' },
            revenue: { val: '$4,200', up: '+5%' },
            attendance: { val: '94%', up: '-2%' }
          });
        }

        if (usersRes.data.status === 'success') {
          const rawUsers = usersRes.data.data;
          const formattedTeachers = rawUsers
            .filter((user: any) => user.roles.some((role: any) => role.name === 'teacher'))
            .map((user: any) => ({
              id: user.id.toString(),
              name: user.name,
              role: user.specialization || 'Mentor',
              load: `${user.weekly_load || 0} год/тижд`,
              groups: (user.groups || []).map((g: any) => ({
                id: g.id.toString(),
                name: g.name,
                studentsCount: g.students_count || 0,
                maxStudents: g.max_students || 15,
                progress: g.progress || 0,
                status: g.status || 'Активна'
              }))
            }));
          setTeachers(formattedTeachers);
        }
      } catch (error) {
        console.error('Data loading failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Логіка пошуку ---
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.groups.some(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, teachers]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuConfig = [
    {
      title: 'Персонал',
      items: [
        { name: 'Головна', desc: 'Загальна інформація' },
        { name: 'Викладачі', desc: 'Навантаження та групи' },
        { name: 'Студенти', desc: 'Профілі та оплати' },
      ]
    },
    {
      title: 'Навчання',
      items: [
        { name: 'Групи та Класи', desc: 'Керування складом' },
        { name: 'Журнал відвідуваності', desc: 'Відмітки Н та З' },
        { name: 'Розклад занять', desc: 'Планування уроків' },
      ]
    },
    {
      title: 'Система',
      items: [
        { name: 'Логи системи', desc: 'Дії адміністраторів' },
        { name: 'Налаштування', desc: 'Доступи та ролі' },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black italic animate-pulse text-2xl">
        CRM_LMS: ЗАВАНТАЖЕННЯ ДАНИХ...
      </div>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      logout={handleLogout}
      menuConfig={menuConfig}
    >
      {(activeTab === 'Головна' || activeTab === 'Викладачі') && (
        <StatsBar stats={stats} />
      )}

      <div className="min-h-[400px]">
        {activeTab === 'Викладачі' && (
          <TeachersTab
            teachers={filteredTeachers}
            expandedTeacher={expandedTeacher}
            setExpandedTeacher={setExpandedTeacher}
          />
        )}

        {activeTab === 'Головна' && (
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center">
            <h3 className="text-xl font-bold italic text-indigo-400 mb-2">Dashboard Overview</h3>
            <p className="text-slate-500 text-sm">Тут будуть графіки та останні сповіщення системи.</p>
          </div>
        )}

        {activeTab !== 'Викладачі' && activeTab !== 'Головна' && (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 italic">Розділ "{activeTab}" знаходиться в розробці...</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}