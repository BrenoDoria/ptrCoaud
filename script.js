// Usuários e permissões
const usuarios = {
    "supervisor": { senha: "12345", permissao: "Supervisor" },
    "operador": { senha: "12345", permissao: "Operador" }
};

const CLIENT_ID = '286050228811-cv6vsd075480anb1i6auuc421enuaf8q.apps.googleusercontent.com';
let tokenClient;

window.addEventListener("load", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const loginContainer = document.getElementById("login-container");
    const systemsContainer = document.getElementById("systems-container");

  // No início do arquivo, ajuste o escopo
tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly',
    callback: (tokenResponse) => {
        if (tokenResponse.error) {
            document.getElementById("loginMessage").textContent = "Erro ao autenticar com Google: " + tokenResponse.error;
            return;
        }
        localStorage.setItem("access_token", tokenResponse.access_token);
        verificarLogin();
    }
});

    const isFirstAccess = !localStorage.getItem("hasAccessedBefore");
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const savedToken = localStorage.getItem("access_token");

    if (isFirstAccess && !usuarioLogado && !savedToken) {
        setTimeout(() => {
            loadingScreen.style.opacity = "0";
            setTimeout(() => {
                loadingScreen.style.display = "none";
                loginContainer.style.display = "block";
                document.body.style.overflow = "auto";
                localStorage.setItem("hasAccessedBefore", "true");
            }, 600);
        }, 8000);
    } else {
        loadingScreen.style.display = "none";
        if (savedToken && usuarioLogado && usuarios[usuarioLogado.username]) {
            loginContainer.style.display = "none";
            systemsContainer.style.display = "block";
            if (usuarios[usuarioLogado.username].permissao === "Supervisor") {
                document.getElementById("compareSystem").style.display = "block";
            }
        } else {
            loginContainer.style.display = "block";
        }
        document.body.style.overflow = "auto";
    }
    // Listener para Enter no campo de senha
    document.getElementById("password").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita comportamento padrão do Enter (como submissão de formulário)
            document.getElementById("loginButton").click(); // Simula o clique no botão "Entrar"
        }
    });
});

function solicitarToken() {
    tokenClient.requestAccessToken();
}

document.getElementById("loginButton").addEventListener("click", function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginMessage = document.getElementById("loginMessage");

    if (!username || !password) {
        loginMessage.textContent = "Digite usuário e senha.";
        return;
    }

    const usuario = usuarios[username];
    if (usuario && usuario.senha === password) {
        localStorage.setItem("usuarioLogado", JSON.stringify({ username: username }));
        loginMessage.textContent = "Autenticando com Google...";
        solicitarToken(); // Chama a autenticação do Google após validação local
    } else {
        loginMessage.textContent = "Usuário ou senha inválidos.";
    }
});

function verificarLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const savedToken = localStorage.getItem("access_token");
    if (usuarioLogado && savedToken && usuarios[usuarioLogado.username]) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("systems-container").style.display = "block";
        if (usuarios[usuarioLogado.username].permissao === "Supervisor") {
            document.getElementById("compareSystem").style.display = "block";
        }
        document.getElementById("loginMessage").textContent = "";
    }
}

document.getElementById("logoutButton").addEventListener("click", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const loginContainer = document.getElementById("login-container");
    const systemsContainer = document.getElementById("systems-container");

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("access_token");
    localStorage.removeItem("hasAccessedBefore");

    systemsContainer.style.display = "none";
    loadingScreen.style.display = "flex";
    loadingScreen.style.opacity = "1";

    setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.style.display = "none";
            loginContainer.style.display = "block";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("loginMessage").textContent = "";
            localStorage.setItem("hasAccessedBefore", "true");
        }, 600);
    }, 8000);
});
