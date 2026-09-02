import React from "react";
import { useNavigate } from "react-router-dom";
import { Wind, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@passafacil.com.br",
      password: "123456",
    },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <Wind className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">PassaFácil</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão simples para sua passadoria.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">
            Entrar na sua conta
          </h2>

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
              rightIcon={<ArrowRight className="w-4 h-4" />}
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
