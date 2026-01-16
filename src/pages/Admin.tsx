
export default function Admin() {
  return (
      <nav className='p-10 bg-gray-100 min-h-screen' style={{
        background: 'radial-gradient(circle, #f0f4f8, #d9e2ec, #bcccdc, #9fb3c8, #829ab1)',
      }}>

      </nav>

  )
}

// <div className="p-10 bg-gray-100 min-h-screen">
//   <h1 className="text-3xl font-bold mb-4 text-black">Адмін Панель (Роль: admin)</h1>
//   <p className="mb-2">Тут реалізовано захист роллю 'admin'.</p>
//   <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
//     <li>Отримати список усіх користувачів: <code className="bg-gray-200 p-1 rounded">GET /api/admin/users</code></li>
//     <li>Створити нового користувача: <code className="bg-gray-200 p-1 rounded">POST /api/admin/users</code></li>
//     <li>Отримати деталі конкретного користувача: <code className="bg-gray-200 p-1 rounded">GET /api/admin/users/&#123;id&#125;</code></li>
//     <li>Оновити дані користувача: <code className="bg-gray-200 p-1 rounded">PUT/PATCH /api/admin/users/&#123;id&#125;</code></li>
//     <li>Видалити користувача: <code className="bg-gray-200 p-1 rounded">DELETE /api/admin/users/&#123;id&#125;</code></li>
//   </ul>
// </div>