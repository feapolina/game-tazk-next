"use client";

import type React from "react";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
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
import { Eye, EyeOff, Mail, Lock, User, Chrome, Check, X } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Validação de senha
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validações
    if (!isPasswordValid) {
      setError("A senha não atende aos critérios de segurança.");
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Conta criada com sucesso! Verifique seu email para confirmar a conta."
        );
        // Limpar formulário
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  const ValidationIcon = ({ isValid }: { isValid: boolean }) =>
    isValid ? (
      <Check className="h-3 w-3 text-green-400" />
    ) : (
      <X className="h-3 w-3 text-red-400" />
    );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/assets/logo_nebulosa_app.svg"
            width={250}
            height={50}
            alt="Logo"
          />
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Cadastro</CardTitle>
            <CardDescription className="text-gray-400">
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Validação de senha */}
                {formData.password && (
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <ValidationIcon isValid={passwordValidation.minLength} />
                      <span
                        className={
                          passwordValidation.minLength
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Mínimo 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ValidationIcon
                        isValid={passwordValidation.hasUppercase}
                      />
                      <span
                        className={
                          passwordValidation.hasUppercase
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Uma letra maiúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ValidationIcon
                        isValid={passwordValidation.hasLowercase}
                      />
                      <span
                        className={
                          passwordValidation.hasLowercase
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Uma letra minúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ValidationIcon isValid={passwordValidation.hasNumber} />
                      <span
                        className={
                          passwordValidation.hasNumber
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Um número
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ValidationIcon isValid={passwordValidation.hasSpecial} />
                      <span
                        className={
                          passwordValidation.hasSpecial
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Um caractere especial
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    <ValidationIcon isValid={passwordsMatch} />
                    <span
                      className={
                        passwordsMatch ? "text-green-400" : "text-red-400"
                      }
                    >
                      As senhas coincidem
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading || !isPasswordValid || !passwordsMatch}
              >
                {loading ? "Criando conta..." : "Criar conta"}
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
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-400">Já tem uma conta? </span>
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          © 2025 Nebula. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
