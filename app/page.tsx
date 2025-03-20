import { headers } from 'next/headers'

export default async function Home() {
  const headersList = await headers()
  const user = headersList.get('X-Authenticated-User')
  const groups = headersList.get('X-User-Groups')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Bienvenido a la Aplicación</h1>
        
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Información del Usuario</h2>
            <p className="mb-2">Usuario: {user}</p>
            {groups && <p>Grupos: {groups}</p>}
            <a
              href="http://localhost:9091/logout"
              className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar Sesión
            </a>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Por favor, inicia sesión para continuar</p>
            <a
              href="http://localhost:9091"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Iniciar Sesión
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
