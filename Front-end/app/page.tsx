import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Calculator, Utensils, User } from "lucide-react"
import ThemeToggleButton from "@/components/theme-toggle-button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            <span className="text-xl font-bold">EasyMacros</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium">
              Início
            </Link>
            <Link href="#features" className="text-sm font-medium">
              Funcionalidades
            </Link>
            <Link href="#about" className="text-sm font-medium">
              Sobre
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Registrar</Button>
            </Link>
            <ThemeToggleButton />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Calcule Seus Macros, Transforme Sua Saúde
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Planos de nutrição personalizados com base nas métricas do seu corpo. Comece sua jornada para uma saúde melhor hoje.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button className="px-8">Começar</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline">Saiba Mais</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Funcionalidades</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Tudo o que você precisa para acompanhar e otimizar sua nutrição
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Macros Personalizados</CardTitle>
                  <Calculator className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Obtenha cálculos precisos de macros com base na sua idade, altura, peso e nível de atividade.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Planos de Dieta Personalizados</CardTitle>
                  <Utensils className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Receba sugestões de refeições adaptadas às suas necessidades de macros e preferências alimentares.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Acompanhamento de Progresso</CardTitle>
                  <User className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Monitore seu progresso ao longo do tempo e ajuste seu plano de nutrição conforme seu corpo muda.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como Funciona</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Três passos simples para otimizar sua nutrição
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">1</div>
                <h3 className="text-xl font-bold">Crie uma Conta</h3>
                <p className="text-center text-gray-500">Registre-se e forneça suas informações básicas para começar.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">2</div>
                <h3 className="text-xl font-bold">Insira Suas Métricas</h3>
                <p className="text-center text-gray-500">
                  Insira sua idade, altura, peso e nível de atividade para cálculos precisos.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">3</div>
                <h3 className="text-xl font-bold">Obtenha Seu Plano</h3>
                <p className="text-center text-gray-500">
                  Receba sua divisão personalizada de macros e sugestões de dieta.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/register">
                <Button className="px-8">
                  Comece Agora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2024 EasyMacros. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Termos
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

