import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Calculator, Utensils, User } from "lucide-react"

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
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Calculate Your Macros, Transform Your Health
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Personalized nutrition plans based on your body metrics. Start your journey to better health today.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button className="px-8">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Everything you need to track and optimize your nutrition
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Personalized Macros</CardTitle>
                  <Calculator className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Get precise macro calculations based on your age, height, weight, and activity level.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Custom Diet Plans</CardTitle>
                  <Utensils className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Receive tailored meal suggestions that match your macro requirements and food preferences.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Progress Tracking</CardTitle>
                  <User className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Monitor your progress over time and adjust your nutrition plan as your body changes.
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Three simple steps to optimize your nutrition
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">1</div>
                <h3 className="text-xl font-bold">Create an Account</h3>
                <p className="text-center text-gray-500">Register and provide your basic information to get started.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">2</div>
                <h3 className="text-xl font-bold">Enter Your Metrics</h3>
                <p className="text-center text-gray-500">
                  Input your age, height, weight, and activity level for accurate calculations.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">3</div>
                <h3 className="text-xl font-bold">Get Your Plan</h3>
                <p className="text-center text-gray-500">
                  Receive your personalized macro breakdown and diet suggestions.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/register">
                <Button className="px-8">
                  Start Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2024 EasyMacros. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

