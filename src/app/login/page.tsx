"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react"; // Adicionado Suspense
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, Chrome, Loader2 } from "lucide-react"; // Adicionado Loader2 para o fallback

// 1. Todo o conteúdo original da página foi movido para este componente
function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams(); // O uso problemático está isolado aqui
  const supabase = createClientComponentClient();

  // Verificar se há erros na URL (vindos do callback)
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      const errorMessages: { [key: string]: string } = {
        "oauth-cancelled": "Login com Google foi cancelado.",
        "auth-callback-error": "Erro na autenticação. Tente novamente.",
      };
      setError(errorMessages[urlError] || "Erro na autenticação.");
    }
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Traduzir mensagens de erro comuns
        const errorMessages: { [key: string]: string } = {
          "Invalid login credentials": "Email ou senha incorretos.",
          "Email not confirmed": "Email ou senha inválidos.",
          "Too many requests": "Muitas tentativas. Tente novamente mais tarde.",
        };
        setError(
          errorMessages[error.message] || "Erro inesperado. Tente novamente."
        );
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 ">
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/logo_nebulosa_app.svg"
          width={180}
          height={40}
          alt="Nebula Logo"
          className="object-contain"
        />
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white">Login</CardTitle>
          <CardDescription className="text-gray-400">
            Digite suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">
                ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 cursor-pointer"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-400">Não tem uma conta? </span>
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500">
        © 2025 Nebula. Todos os direitos reservados.
      </div>
    </div>
  );
}

// 2. O componente exportado agora é apenas um wrapper com Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* O Suspense protege o build contra o erro do useSearchParams */}
      <Suspense 
        fallback={
          <div className="flex flex-col items-center gap-4 text-gray-400">
             <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
             <p>Carregando login...</p>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}