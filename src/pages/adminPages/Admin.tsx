import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../api/auth.ts';

import AdminLayout from '../../components/AdminPanel/AdminLayout.tsx';
import StatsBar from '../../components/AdminPanel/StatusBar.tsx';
import TeachersTab from '../../components/AdminPanel/TeachersTab.tsx';

import type { Teacher, DashboardStats } from '../../types/admin.ts';
import { useTranslation } from 'react-i18next';

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Головна');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const { t } = useTranslation();

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
              role: user?.specialization || t('Admin.role'),
              load: `${user?.weekly_load ?? 0} ${t('Admin.load')}`,
              groups: (user.groups || []).map((g: any) => ({
                id: g.id.toString(),
                name: g.name,
                studentsCount: g.students_count || 0,
                maxStudents: g.max_students || 15,
                progress: g.progress || 0,
                status: g.status || `${t('Admin.status')}`,
              })),
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
      title: t('Admin.title1'),
      items: [
        { name: t('Admin.name1'), desc: t('Admin.desc1') },
        { name: t('Admin.name2'), desc: t('Admin.desc2') },
        { name: t('Admin.name3'), desc: t('Admin.desc3') },
      ]
    },
    {
      title: t('Admin.title2'),
      items: [
        { name: t('Admin.name4'), desc: t('Admin.desc4') },
        { name: t('Admin.name5'), desc: t('Admin.desc5') },
        { name: t('Admin.name6'), desc: t('Admin.desc6') },
      ]
    },
    {
      title: t('Admin.title3'),
      items: [
        { name: t('Admin.name7'), desc: t('Admin.desc7') },
        { name: t('Admin.name8'), desc: t('Admin.desc8') },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black italic animate-pulse text-2xl">
        {t('Admin.div')}
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
      {(activeTab === t('Admin.activeTab1') || activeTab === t('Admin.activeTab2')) && (
        <StatsBar stats={stats} />
      )}

      <div className="min-h-[400px]">
        {activeTab === t('Admin.activeTab2') && (
          <TeachersTab
            teachers={filteredTeachers}
            expandedTeacher={expandedTeacher}
            setExpandedTeacher={setExpandedTeacher}
          />
        )}

        {activeTab === t('Admin.activeTab1') && (
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center">
            <h3 className="text-xl font-bold italic text-indigo-400 mb-2">{t('Admin.Dashboard')}</h3>
            <p className="text-slate-500 text-sm">{t('Admin.graf')}</p>
          </div>
        )}

        {activeTab !== t('Admin.activeTab2') && activeTab !== t('Admin.activeTab1') && (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 italic">{t('Admin.p1')} "{activeTab}" {t('Admin.p2')}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}