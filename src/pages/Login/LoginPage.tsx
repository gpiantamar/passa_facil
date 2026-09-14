import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, ArrowRight, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { login } from "../../services/api.js";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login: saveToken } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);
    try {
      const result = await login({ email: data.email, password: data.password });
      saveToken(result.token);
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Não foi possível fazer login. Tente novamente."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 mb-4 flex-shrink-0">
            <Wind className="w-7 h-7 text-white flex-shrink-0" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">PassaFácil</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão simples para sua passadoria.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">
            Entrar na sua conta
          </h2>

          {/* Erro do servidor */}
          {serverError && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              required
              {...register("email")}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••"
              error={errors.password?.message}
              required
              {...register("password")}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4 flex-shrink-0" />}
              className="mt-1"
            >
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          PassaFácil &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
