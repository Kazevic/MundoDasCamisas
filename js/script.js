// ==========================================
// 1. ACESSIBILIDADE
// ==========================================
let tamanhoFonteAtual = 16; // Tamanho base

function mudarFonte(step) {
    tamanhoFonteAtual += (step * 2);
    // Muda o tamanho da fonte no elemento raiz (HTML) para refletir no site inteiro (usando rem no CSS)
    document.documentElement.style.fontSize = tamanhoFonteAtual + "px";
}

function toggleContraste() {
    // Adiciona ou remove uma classe "alto-contraste" do body
    document.body.classList.toggle('alto-contraste');
}

// ==========================================
// 2. FUNÇÃO DE FEEDBACK SEM ALERT
// ==========================================
function mostrarMensagem(mensagem, tipo = 'bg-danger') {
    const toastEl = document.getElementById('meuToast');
    const toastBody = document.getElementById('toastMensagem');

    // Muda a cor do toast (vermelho para erro, verde para sucesso)
    toastEl.className = `toast align-items-center text-white ${tipo} border-0`;
    toastBody.innerText = mensagem;

    // Chama o Toast do Bootstrap
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// ==========================================
// 3. MÁSCARA DO TELEFONE
// ==========================================
const celInput = document.getElementById('celular');
if (celInput) {
    celInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Tira tudo que não é número

        // Formata para (+55)XX-XXXXXXXXX
        if (value.length > 2 && value.length <= 4) {
            value = "(+55)" + value.substring(2);
        } else if (value.length > 4) {
            value = "(+55)" + value.substring(2, 4) + "-" + value.substring(4, 13);
        }
        e.target.value = value;
    });
}

// ==========================================
// 4. VALIDAÇÃO DO CADASTRO
// ==========================================
const formCadastro = document.getElementById('formCadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede a página de recarregar

        const nome = document.getElementById('nome').value.trim();
        const login = document.getElementById('login').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confSenha = document.getElementById('confirmaSenha').value.trim();
        const telefone = document.getElementById('celular').value.trim();

        // Regras (Expressões Regulares)
        const regexNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]{15,60}$/;
        const regexLogin = /^[A-Za-z]{6}$/;
        const regexSenha = /^[A-Za-z]{8}$/;

        // Validações
        if (!regexNome.test(nome)) {
            mostrarMensagem("Erro: O nome deve ter entre 15 e 60 caracteres alfabéticos.");
            return;
        }
        if (telefone.length < 17) { // Tamanho de (+55)XX-XXXXXXXX
            mostrarMensagem("Erro: Preencha o telefone no formato correto.");
            return;
        }
        if (!regexLogin.test(login)) {
            mostrarMensagem("Erro: O Login deve ter exatamente 6 caracteres alfabéticos.");
            return;
        }
        if (!regexSenha.test(senha)) {
            mostrarMensagem("Erro: A Senha deve ter exatamente 8 caracteres alfabéticos.");
            return;
        }
        if (senha !== confSenha) {
            mostrarMensagem("Erro: As senhas não conferem.");
            return;
        }

        // Se passou em tudo, SALVA NO LOCALSTORAGE
        localStorage.setItem('usuarioLogin', login);
        localStorage.setItem('usuarioSenha', senha);
        localStorage.setItem('usuarioNome', nome);

        mostrarMensagem("Cadastro realizado com sucesso! Redirecionando...", "bg-success");

        // Espera 2 segundos e manda para a tela de login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}
// ==========================================
// 4. LÓGICA DE LOGIN E CRIAÇÃO DA SESSÃO
// ==========================================
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede a página de recarregar

        const loginDigitado = document.getElementById('loginAcesso').value.trim();
        const senhaDigitada = document.getElementById('senhaAcesso').value.trim();

        // Puxa os dados salvos na tela de Cadastro
        const loginSalvo = localStorage.getItem('usuarioLogin');
        const senhaSalva = localStorage.getItem('usuarioSenha');

        // Compara os dados
        if (loginDigitado === loginSalvo && senhaDigitada === senhaSalva) {
            // Cria uma "chave" no localStorage dizendo que o usuário está logado
            localStorage.setItem('usuarioLogado', 'sim');

            // Redireciona para a Vitrine (Tela 3)
            window.location.href = 'index.html';
        } else {
            mostrarMensagem("Login ou Senha incorretos!", "bg-danger");
        }
    });
}
// ==========================================
// 5. CONTROLE DE SESSÃO NAS PÁGINAS DA LOJA
// ==========================================
function verificarSessao() {
    // Verifica qual página o usuário está acessando agora
    const urlAtual = window.location.pathname;

    // Se ele está logado de verdade
    const estaLogado = localStorage.getItem('usuarioLogado');
    const nomeLogin = localStorage.getItem('usuarioLogin'); // O login de 6 letras dele

    // Se NÃO está logado e NÃO está nas páginas de login/cadastro, expulsa pra tela de login
    if (estaLogado !== 'sim' && !urlAtual.includes('login.html') && !urlAtual.includes('cadastro.html')) {
        window.location.href = 'login.html';
    }

    // Se ESTÁ logado, coloca o nome dele em cima no menu e exibe botão de sair (ou oculta se não estiver)
    if (estaLogado === 'sim') {
        const spanNome = document.getElementById('nomeUsuarioLogado');
        if (spanNome) {
            spanNome.innerText = "Olá, " + nomeLogin;
        }
    } else {
        const botaoSair = document.querySelector('.botaoSair');
        botaoSair.style.display = 'none';
    }
}

// ==========================================
// 6. FUNÇÃO PARA SAIR DA CONTA (LOGOUT)
// ==========================================
function fazerLogout() {
    // Remove APENAS o status de logado (assim ele não perde a conta que cadastrou)
    localStorage.removeItem('usuarioLogado');

    // Redireciona de volta para o login
    window.location.href = 'login.html';
}

// Executa a função toda vez que o script é carregado
verificarSessao();