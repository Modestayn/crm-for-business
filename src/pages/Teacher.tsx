
export default function Teacher() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-black">Панель Викладача (Роль: teacher)</h1>
      <p className="mb-2">Тут реалізовано захист роллю 'teacher'.</p>
      <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
        <li>Отримати список груп: <code className="bg-gray-200 p-1 rounded">GET /api/teacher/groups</code></li>
        <li>Отримати деталі певної групи: <code className="bg-gray-200 p-1 rounded">GET /api/teacher/groups/&#123;id&#125;</code></li>
        <li>Отримати список студентів: <code className="bg-gray-200 p-1 rounded">GET /api/teacher/students</code></li>
        <li>Оновити оцінку для студента: <code className="bg-gray-200 p-1 rounded">PUT/PATCH /api/teacher/students/&#123;id&#125;/grade</code></li>
      </ul>
    </div>
  )
}