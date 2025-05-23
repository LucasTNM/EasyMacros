"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Utensils, User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from 'axios';
import ThemeToggleButton from "@/components/theme-toggle-button"

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    userInfo: {
      idade: 0,
      sexo: "",
      peso: 0,
      altura: 0,
      nivelAtividade: "",
      objetivo: "",
    },
    userMetabolism: {
      taxaMetabolicaBasal: 0,
      gastoTotalDiario: 0,
      consumo: 0,
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
    },
    Chat: {
      dieta: "",
      ultimaRequisicao: "",
    }
  });

  const [dietPlan, setDietPlan] = useState<{ title: string; items: string[] }[]>([]);
  const [generateDietError, setGenerateDietError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const apiUser = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    withCredentials: true,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const emailResponse = await apiUser.get(`/user/email`, { withCredentials: true });
        const email = emailResponse.data.email;

        if (!email) {
          throw new Error("Email do usuário não encontrado.");
        }

        const response = await apiUser.get(`/user/find/${email}`);

        if (!response.data) {
          throw new Error("Falha ao buscar os dados do usuário.");
        }

        const data = response.data;

        if (!data.userInfo || !data.userMetabolism) {
          throw new Error("Dados do usuário incompletos.");
        }

        const dieta = data.Chat?.dieta || `
        Atenção: Esta dieta não é personalizada, tente gerar a dieta novamente mais tarde.
        Motivo: o uso de tokens da api do openRouter chegou ao seu limite.
        Café da manhã: 2 ovos cozidos, 1 fatia de pão integral, 1 banana.
        Almoço: 100g de peito de frango grelhado, 1/2 xícara de arroz integral, salada de folhas verdes com azeite.
        Lanche: 1 iogurte natural, 10 amêndoas.
        Jantar: 1 omelete com 2 ovos e vegetais, 1 fatia de pão integral.
      `;

        const processedDiet = processDietResponse(dieta);
        setDietPlan(processedDiet);

        setUserData({
          nome: data.nome,
          email: data.email,
          userInfo: {
            idade: data.userInfo.idade,
            sexo: data.userInfo.sexo,
            peso: data.userInfo.peso,
            altura: data.userInfo.altura,
            nivelAtividade: data.userInfo.nivelAtividade,
            objetivo: data.userInfo.objetivo,
          },
          userMetabolism: {
            taxaMetabolicaBasal: data.userMetabolism.taxaMetabolicaBasal,
            gastoTotalDiario: data.userMetabolism.gastoTotalDiario,
            consumo: data.userMetabolism.consumo,
            calorias: data.userMetabolism.calorias,
            proteinas: data.userMetabolism.proteinas,
            carboidratos: data.userMetabolism.carboidratos,
            gorduras: data.userMetabolism.gorduras,
          },
          Chat: {
            dieta: data.Chat?.dieta || `
              Atenção: Esta dieta não é personalizada, tente gerar a dieta novamente mais tarde.
              Motivo: o uso de tokens da api do openRouter chegou ao seu limite.
              Café da manhã: 2 ovos cozidos, 1 fatia de pão integral, 1 banana.
              Almoço: 100g de peito de frango grelhado, 1/2 xícara de arroz integral, salada de folhas verdes com azeite.
              Lanche: 1 iogurte natural, 10 amêndoas.
              Jantar: 1 omelete com 2 ovos e vegetais, 1 fatia de pão integral.
            `,
            ultimaRequisicao: data.Chat?.ultimaRequisicao || "",
          },
        });
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);

        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const errorMessage = isMobile
          ? "Erro detectado em dispositivo móvel. Verifique sua conexão ou tente outro navegador."
          : err.message || "Erro desconhecido ao carregar o dashboard.";

        setErrorMessage(errorMessage);

        setTimeout(() => {
          router.push("/login");
        }, 10000);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await apiUser.post(`/user/logout`);
    router.push("/");
  };

  const handlePercentage = () => {
    const { proteinas, carboidratos, gorduras, consumo } = userData.userMetabolism;

    const caloriasProteinas = proteinas * 4;
    const caloriasCarboidratos = carboidratos * 4;
    const caloriasGorduras = gorduras * 9;

    const porcentagemProteinas = parseFloat(((caloriasProteinas / consumo) * 100).toFixed(2));
    const porcentagemCarboidratos = parseFloat(((caloriasCarboidratos / consumo) * 100).toFixed(2));
    const porcentagemGorduras = parseFloat(((caloriasGorduras / consumo) * 100).toFixed(2));

    return {
      porcentagemProteinas,
      porcentagemCarboidratos,
      porcentagemGorduras,
    };
  };

  const { porcentagemProteinas, porcentagemCarboidratos, porcentagemGorduras } = handlePercentage();

  const processDietResponse = (dieta: string) => {
    const sections = dieta.split(/(?=Café da manhã|Almoço|Lanche|Jantar|Total do dia)/g);

    const dietPlan = sections.map((section) => {
      const [title, ...items] = section.split(/-\s/).map((item) => item.trim());
      return {
        title: title.replace(":", ""),
        items: items.filter((item) => item),
      };
    });

    return dietPlan;
  };

  const calculateWaterIntake = (peso: number) => {
    const waterInmililiters = (peso * 35);
    return waterInmililiters;
  };

  const gainOrLoss = () => {
    const decider = userData.userInfo.objetivo;
    if (decider === "Emagrecimento") {
      return "retiradas";
    } else if (decider === "Ganho de massa") {
      return "Adicionais";
    }
    return "retiradas";
  };

  const getNextAvailableDate = (ultimaRequisicao: string) => {
    const lastRequestDate = new Date(ultimaRequisicao);
    const nextAvailableDate = new Date(lastRequestDate);
    nextAvailableDate.setDate(lastRequestDate.getDate() + 7);
    return nextAvailableDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleGenerateDiet = async () => {
    try {
      const email = userData.email;
      const response = await apiUser.post(`/chat/generateDiet/${email}`);

      if (!response) {
        const nextAvailableDate = getNextAvailableDate(userData.Chat.ultimaRequisicao);
        throw new Error(`A nova dieta só poderá ser gerada a partir de: ${nextAvailableDate}`);
      }

      const dieta = response.data.dieta || "Nenhuma dieta disponível no momento.";
      const processedDiet = processDietResponse(dieta);
      setDietPlan(processedDiet);
      setGenerateDietError("");
    } catch (err: any) {
      if (err.response?.status === 429) {
        const nextAvailableDate = getNextAvailableDate(userData.Chat.ultimaRequisicao);
        setGenerateDietError(`Limite semanal atingido. Tente novamente em: ${nextAvailableDate}`);
      } else {
        setGenerateDietError("Erro ao gerar nova dieta. Por favor, tente novamente mais tarde.");
      }
    }
  };

  const Wellcome = () => {
    if(userData.userInfo.sexo === "Masculino") {
      return "Bem vindo,";
    } else {
      return "Bem vinda,";
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            <span className="text-xl font-bold">EasyMacros</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <Link href="/dashboard/profile/edit">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container">
          {errorMessage ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
              <p>{errorMessage}</p>
              <p>Você será redirecionado para a página de login em 10 segundos...</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8">{Wellcome()} {userData.nome}</h1>
              <Tabs defaultValue="macros" className="space-y-8">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-sm">
                  <p>
                    Você pode personalizar melhor seus macronutrientes editando suas informações no perfil
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="macros">Macronutrientes</TabsTrigger>
                  <TabsTrigger value="diet">Sugestão de dieta</TabsTrigger>
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                </TabsList>

                <TabsContent value="macros" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Gasto total</CardTitle>
                        <CardDescription>Quantidade de calorias gastas diariamente</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userData.userMetabolism.gastoTotalDiario}</div>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">TMB</CardTitle>
                        <CardDescription>Taxa Metabólica basal estimada</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userData.userMetabolism.taxaMetabolicaBasal}</div>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Calorias</CardTitle>
                        <CardDescription>Calorias {gainOrLoss()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userData.userMetabolism.calorias}</div>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Consumo diário</CardTitle>
                        <CardDescription>Meta de calorias</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userData.userMetabolism.consumo}</div>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Proteinas</CardTitle>
                        <CardDescription>{porcentagemProteinas}% das calorias</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-3xl font-bold">{userData.userMetabolism.proteinas}g</div>
                        <Progress value={porcentagemProteinas} className="h-2" />
                      </CardContent>
                    </Card>
                    <Card className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Carboidratos</CardTitle>
                        <CardDescription>{porcentagemCarboidratos}% das calorias</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-3xl font-bold">{userData.userMetabolism.carboidratos}g</div>
                        <Progress value={porcentagemCarboidratos} className="h-2" />
                      </CardContent>
                    </Card>
                    <Card className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Gorduras</CardTitle>
                        <CardDescription>{porcentagemGorduras}% das calorias</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-3xl font-bold">{userData.userMetabolism.gorduras}g</div>
                        <Progress value={porcentagemGorduras} className="h-2" />
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="shadow-md mt-6">
                    <CardHeader>
                      <CardTitle>Tabela de macros</CardTitle>
                      <CardDescription>Seu controle de macronutrientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-primary"></div>
                              <span>Proteinas</span>
                            </div>
                            <span className="font-medium">{userData.userMetabolism.proteinas}g ({porcentagemProteinas}%)</span>
                          </div>
                          <Progress value={porcentagemProteinas} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                              <span>Carboidratos</span>
                            </div>
                            <span className="font-medium">{userData.userMetabolism.carboidratos}g ({porcentagemCarboidratos}%)</span>
                          </div>
                          <Progress value={porcentagemCarboidratos} className="h-2 bg-blue-100" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                              <span>Gorduras</span>
                            </div>
                            <span className="font-medium">{userData.userMetabolism.gorduras}g ({porcentagemGorduras}%)</span>
                          </div>
                          <Progress value={porcentagemGorduras} className="h-2 bg-yellow-100" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="diet" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plano de dieta sugerido</CardTitle>
                      <CardDescription>Baseado na necessidade dos seus macronutrientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {dietPlan.length > 0 ? (
                          dietPlan.map((section, index) => (
                            <div key={index}>
                              <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.items.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <p>Nenhuma dieta disponível no momento.</p>
                        )}
                        {generateDietError && (
                          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mt-4">
                            {generateDietError}
                          </div>
                        )}
                        <Button className="mt-4" onClick={handleGenerateDiet}>
                          Solicitar nova dieta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dicas para Preparação de Refeições</CardTitle>
                      <CardDescription>Facilite a adesão à sua dieta</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Mantenha-se hidratado bebendo pelo menos {calculateWaterIntake(userData.userInfo.peso)} ml de água por dia</li>
                        <li>Prepare refeições em grande quantidade nos finais de semana para economizar tempo durante a semana</li>
                        <li>Use uma balança de cozinha para medir as porções com precisão</li>
                        <li>Armazene as refeições em recipientes com porções controladas</li>
                        <li>Mantenha lanches saudáveis sempre à mão para evitar escolhas não saudáveis</li>
                        <li>Ajuste seu plano alimentar com base no seu nível de atividade quando necessário</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Perfil</CardTitle>
                      <CardDescription>Seus dados atuais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium mb-2">Informações pessoais</h3>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Nome:</dt>
                              <dd>{userData.nome}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Idade:</dt>
                              <dd>{userData.userInfo.idade} anos</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Gênero:</dt>
                              <dd className="capitalize">{userData.userInfo.sexo}</dd>
                            </div>
                          </dl>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Medidas do corpo</h3>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Altura:</dt>
                              <dd>{userData.userInfo.altura} cm</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Peso:</dt>
                              <dd>{userData.userInfo.peso} kg</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Nível de atividade:</dt>
                              <dd className="capitalize">{userData.userInfo.nivelAtividade.replace(/([A-Z])/g, " $1").trim()}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link href="/dashboard/profile/edit">
                          <Button>Editar Perfil</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

