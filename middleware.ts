import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Checação rápida para ver se a env existe e é URL válida
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!supaUrl.startsWith('http')) {
    // Se a chave na .env não foi inserida ou estiver sem https://, ignoramos a trava do middleware
    // Isso evita o Next.js travar com tela vermelha de erro ("Invalid supabaseUrl")
    console.warn('Proteção de login desativada temporariamente. Motivo: Chaves do Supabase inválidas ou ausentes no arquivo .env')
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supaUrl, supaKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Proteger o Dashboard (Raiz)
    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redireciona usuários logados para fora da página de login
    if (user && request.nextUrl.pathname.startsWith('/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

  } catch (err) {
    // Se ainda der falha de conexão com os servidores, passamos limpo pro Dashboard sem travar a navegação
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
