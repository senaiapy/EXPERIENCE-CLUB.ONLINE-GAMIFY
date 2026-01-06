Prompt para Geração de Modelo de App (APP.md)

Persona: Você é um Product Manager (Gerente de Produto) e UI/UX Designer sênior, especializado em aplicativos de gamificação e fidelidade.

Tarefa: Crie a estrutura de um documento de "whiteboard" (em formato Markdown) para um novo aplicativo de gamificação chamado "Experience Club". Este aplicativo permite que usuários ganhem "Moedas" (que têm um valor prometido de 1 USD cada) ao completar tarefas. O objetivo principal do usuário é acumular 1.000 Moedas para resgate.

A principal mecânica de retenção é que as tarefas não estão todas disponíveis imediatamente; há um tempo de espera (delay) obrigatório (ex: 24 horas) entre a conclusão de uma tarefa e o desbloqueio da próxima.

O documento (APP.md) deve detalhar as principais telas (fluxo do usuário) e os componentes de UI/UX necessários para cada tela, com foco especial em como o delay é comunicado ao usuário.

Estrutura Obrigatória do APP.md:

Conceito do App: Breve descrição do Experience Club.

Fluxo de Onboarding (Primeiro Acesso):

Tela de Splash/Login.

Tela de Registro (Tarefa 1: Ganhar 50 Moedas).

Tela Principal (Dashboard):

O componente mais importante. Deve mostrar o progresso e o status da próxima ação.

[UI: Card de Saldo] (Ex: "Saldo Atual: 50 Moedas")

[UI: Equivalência em USD] (Ex: "Valor: $50,00 USD")

[UI: Barra de Progresso Visual] (Ex: "Meta de Resgate: 50 / 1.000 Moedas")

[UI: Seção de Próxima Tarefa (Crítico)]:

Se disponível: [Botão Grande: "Próxima Tarefa: Instalar o App (+50 Moedas)"]

Se em delay: [UI: Timer] (Ex: "Próxima tarefa desbloqueia em: 23h 59m 10s") com [UI: Ícone de cadeado].

Tela de Tarefas (A Fazer / Jornada):

Uma lista vertical ou mapa visual (estilo "jornada") que mostra as tarefas concluídas, a tarefa atual e as tarefas futuras (bloqueadas).

[UI: Tarefa Concluída] (Ex: "Registro: +50 Moedas" [Ícone: Check ✔])

[UI: Tarefa Atual] (Ex: "Instale nosso App", "+50 Moedas", [Botão: "Começar"])

[UI: Tarefa Futura Bloqueada] (Ex: "Envie 5 Convites", "+50 Moedas" [Ícone: Cadeado 🔒])

[UI: Tarefa em Cooldown] (Ex: "Tirar Selfie", "+50 Moedas" [Timer: "Disponível em 12:30:05"])

Tela de Referência (Indique e Ganhe):

(Tarefa 3: Enviar link para 5 amigos).

[UI: Link de Convite Pessoal]

[Botão: "Compartilhar no WhatsApp"]

[UI: Status de Convidados] (Ex: "Amigo 1: Registrado!", "Amigo 2: Pendente").

Tela de Perfil / Tarefa de Selfie:

(Tarefa 4: Tirar selfie ao lado da tela).

[UI: Upload de Imagem] (Com instruções claras).

[UI: Status de Verificação] (Pendente / Aprovado).

Tela de Resgate (Loja):

O que acontece ao atingir 1.000 Moedas.

[UI: Mensagem de Parabéns]

[UI: Lista de Lojas Afiliadas]

[UI: Loja Interna] (Produtos para resgate).
