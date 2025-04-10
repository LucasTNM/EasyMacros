# 🥦 EasyMacros

**PT-BR | EN**

Deploy (acesso ao projeto): https://easy-macros.vercel.app/

---

## 📌 Descrição | Description

**PT-BR:**  
EasyMacros é uma plataforma web que calcula e recomenda dietas personalizadas com base nas necessidades nutricionais de cada usuário. Através de uma fórmula precisa e da integração com inteligência artificial, o sistema gera planos alimentares completos e balanceados, adaptados aos objetivos individuais — como perda de peso ou ganho de massa muscular.

**EN:**  
EasyMacros is a web platform that calculates and recommends personalized diets based on each user's nutritional needs. Using a precise formula and AI integration, the system generates complete and balanced meal plans tailored to individual goals—such as weight loss or muscle gain.

---

## 🎯 Funcionalidades | Features

- 📊 Cálculo do metabolismo basal com base na fórmula de Mifflin-St Jeor.  
- 🧮 Distribuição automática de macronutrientes (proteínas, carboidratos e gorduras).  
- 🧠 Geração de dietas personalizadas por Inteligência Artificial (IA).  
- 🔒 Autenticação com JWT e segurança de senha com bcrypt.  
- 📧 Recuperação de senha com envio de código por e-mail.  
- 📆 Controle de limite semanal de requisições ao assistente nutricional.  
- 📱 Interface responsiva e intuitiva.

---

## 🛠️ Tecnologias | Technologies

### 💻 Frontend
- React.js
- Vite
- TailwindCSS
- Axios

### 🧪 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Autenticação)
- bcrypt (Criptografia de senhas)
- Nodemailer (Envio de e-mails)
- OpenRouter API (Claude 3 Haiku)

---

## 🚀 Como executar o projeto | How to run the project

1.Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/EasyMacros.git
   ```

2.Acesse as pastas Back-end e Front-end para backend e frontend respectivamente.

3.Instale as dependências:
  ```bash
  npm install
  ```
4.Configure suas variáveis de ambiente .env no backend e frontend:

MONGO_URI=...

JWT_SECRET=...

OPENROUTER_API_KEY=...

EMAIL_USER=...

EMAIL_PASS=...

5.Inicie o backend:
  ```bash
  node server.js
  ```

6.Inicie o frontend:
  ```bash
  npm run dev
  ```

📧 Contato

Desenvolvido por Lucas - Estudante de Ciência da Computação no IFB - Taguatinga
Entre em contato pelo LinkedIn ou envie um e-mail para lucasstma01@gmail.com

⭐ Se você gostou do projeto, deixe uma estrela no repositório!
