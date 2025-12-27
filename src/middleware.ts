import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Este middleware é executado antes de uma requisição ser completada.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Cria um cliente Supabase que pode ser usado em Server Components, Route Handlers e Middleware.
  const supabase = createMiddlewareClient({ req, res });

  // Pega a sessão do usuário. O auth-helpers cuida de atualizar o cookie da sessão.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Se o usuário NÃO está logado e tenta acessar páginas protegidas
  if (!session) {
    // Lista de rotas públicas
    const publicRoutes = ["/welcome", "/login", "/signup", "/auth/callback"];
    
    // Se a rota atual NÃO for pública e não for arquivo estático (já tratado no config matcher)
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (!isPublicRoute) {
      const url = req.nextUrl.clone();
      url.pathname = "/welcome";
      return NextResponse.redirect(url);
    }
  }

  // Se o usuário ESTÁ logado e tenta acessar páginas públicas de auth ou welcome
  if (session && (pathname === "/login" || pathname === "/signup" || pathname === "/welcome")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return res;
}

// Configuração para definir em quais rotas o middleware deve ser executado.
// O matcher abaixo faz com que ele rode em TODAS as rotas, exceto as de arquivos estáticos.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
