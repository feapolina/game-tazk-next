import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  // Se o usuário cancelou ou houve erro no OAuth
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=oauth-cancelled`
    );
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=auth-callback-error`
        );
      }
    } catch (error) {
      console.error("Unexpected error during code exchange:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth-callback-error`
      );
    }
  }

  // Redirecionar para a página inicial após login bem-sucedido
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
