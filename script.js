// Variáveis globais
let salaSelecionada = "";
let patrimoniosColetados = [];
let patrimonioData = [];

// Função auxiliar para formatar a data no formato DD-MM-YYYY
function formatarData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0'); // Garante 2 dígitos
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // +1 porque meses começam em 0
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
}

// Ao carregar a página, esconde a tela de carregamento após os dois fade ins
window.addEventListener("load", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const container = document.querySelector(".container");

    // Espera os dois fade ins (2s cada = 4s) + fade out (0.5s)
    setTimeout(() => {
        loadingScreen.style.opacity = "0"; // Inicia o fade out
        setTimeout(() => {
            loadingScreen.style.display = "none"; // Remove a tela
            container.style.display = "block"; // Mostra o sistema
            document.body.style.overflow = "auto"; // Restaura a rolagem
        }, 500); // Tempo do fade out
    }, 8000); // Tempo total dos dois fade ins (2s + 5s)
});
// Carrega a planilha de dados
document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    document.getElementById("spinner").style.display = "inline-block";
    document.getElementById("progressText").innerText = "AGUARDE...";

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            patrimonioData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            document.getElementById("progressText").innerText = "BANCO DE DADOS ATUALIZANDO!";
            setTimeout(() => {
                document.getElementById("progressText").innerText = "AUTORIZADA CONSULTA";
            }, 4000);
        } catch (error) {
            alert("Erro ao carregar a planilha. Verifique se o arquivo está em formato XLSX válido.");
            console.error(error);
            document.getElementById("progressText").innerText = "Erro no carregamento.";
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    };

    reader.onerror = (error) => {
        console.error("Erro ao ler o arquivo:", error);
        alert("Erro ao ler o arquivo. Tente novamente.");
        document.getElementById("spinner").style.display = "none";
        document.getElementById("progressText").innerText = "Erro no carregamento.";
    };

    reader.readAsArrayBuffer(file);

    document.getElementById("salaInput").focus();
    
}

// Confirmação da sala
document.getElementById("confirmarSala").addEventListener("click", function () {
    salaSelecionada = document.getElementById("salaInput").value.trim();

    if (!salaSelecionada) {
        alert("Por favor, digite o nome da sala antes de confirmar!");
        return;
    }

    document.getElementById("salaInput").disabled = true;
    document.getElementById("confirmarSala").disabled = true;

    alert(`ATENÇÃO! A sala '${salaSelecionada}' foi selecionada com sucesso! A partir de agora, todos os equipamentos escaneados serão registrados nesta sala`);


// Move o cursor para o campo de patrimônio após a confirmação
document.getElementById("patrimonioInput").focus();
});

// Adicionar patrimônio com "Enter"
document.getElementById("patrimonioInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addPatrimonio();
    }
});

// Função para adicionar patrimônio
function addPatrimonio() {
    let patrimonioInput = document.getElementById("patrimonioInput").value.trim();
    patrimonioInput = patrimonioInput.replace(/\./g, "");

    if (!patrimonioInput) {
        alert("Digite ou bip o número de patrimônio.");
        return;
    }

    if (!salaSelecionada) {
        alert("Selecione e confirme uma sala antes de adicionar patrimônios!");
        return;
    }

    const patrimonioSemZeros = patrimonioInput.replace(/^0+/, "");
    const jaColetado = patrimoniosColetados.some(item => item.NRP == patrimonioInput);

    if (jaColetado) {
        alert("Este patrimônio já foi coletado.");
        document.getElementById("patrimonioInput").value = "";
        document.getElementById("patrimonioInput").focus();
        return;
    }

    const encontrado = patrimonioData.find(
        (row) => row[0] && row[0].toString().replace(/^0+/, "") === patrimonioSemZeros
    );

    if (encontrado) {
        patrimoniosColetados.push({
            NRP: encontrado[0],
            Material: encontrado[1],
            Localização: salaSelecionada, // Salva a sala atual com o item
            Responsável: encontrado[3],
        });
        updateList();
        document.getElementById("patrimonioInput").value = "";
        document.getElementById("patrimonioInput").focus();
    } else {
        alert("Patrimônio não encontrado.");
        document.getElementById("patrimonioInput").value = "";
        document.getElementById("patrimonioInput").focus();
    }
}

// Atualiza a lista na tela
function updateList() {
    const listElement = document.getElementById("patrimonioList");
    listElement.innerHTML = "";

    patrimoniosColetados.forEach((item) => {
        const row = document.createElement("tr");

        const nrpCell = document.createElement("td");
        nrpCell.textContent = item.NRP;
        row.appendChild(nrpCell);

        const materialCell = document.createElement("td");
        materialCell.textContent = item.Material;
        row.appendChild(materialCell);

        const localizacaoCell = document.createElement("td");
        localizacaoCell.textContent = item.Localização;
        row.appendChild(localizacaoCell);

        const responsavelCell = document.createElement("td");
        responsavelCell.textContent = item.Responsável;
        row.appendChild(responsavelCell);

        listElement.appendChild(row);
    });
}

// Nova coleta: apenas desbloqueia a sala
document.getElementById("resetarColeta").addEventListener("click", function () {
    document.getElementById("salaInput").disabled = false;
    document.getElementById("salaInput").value = "";
    document.getElementById("confirmarSala").disabled = false;
    salaSelecionada = "";

    alert("Campo de sala desbloqueado. Digite uma nova sala e confirme para continuar a coleta.");
});

// Exportar planilha - Responsáveis Específicos
function exportPlanilhaEspecifica() {
    const responsaveisEspecificos = [
        "ALBERTO CESAR SOUZA ALMEIDA (5302)",
        "PAULO FERNANDO VOLPE (5933)",
        "JOSE HENRIQUE FERREIRA DA SILVA (7913)"
    ];

    const dadosFiltrados = patrimoniosColetados.filter(item =>
        responsaveisEspecificos.some(responsavel =>
            responsavel.trim() === item.Responsável.trim()
        )
    );

    if (dadosFiltrados.length === 0) {
        alert("Nenhum patrimônio encontrado para os responsáveis específicos.");
        return;
    }

    const newData = [
        ["NRP", "Material", "Localização", "Responsável"],
        ...dadosFiltrados.map(item => [item.NRP, item.Material, item.Localização, item.Responsável]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responsaveis_Especificos");
    XLSX.writeFile(workbook, `Responsaveis_COAUD_${formatarData()}.xlsx`);
}

// Exportar planilha - Outros Responsáveis
function exportPlanilhaOutros() {
    const responsaveisEspecificos = [
        "ALBERTO CESAR SOUZA ALMEIDA (5302)",
        "PAULO FERNANDO VOLPE (5933)",
        "JOSE HENRIQUE FERREIRA DA SILVA (7913)"
    ];

    const dadosFiltrados = patrimoniosColetados.filter(item =>
        !responsaveisEspecificos.some(responsavel =>
            responsavel.trim() === item.Responsável.trim()
        )
    );

    if (dadosFiltrados.length === 0) {
        alert("Nenhum patrimônio encontrado para outros responsáveis.");
        return;
    }

    const newData = [
        ["NRP", "Material", "Localização", "Responsável"],
        ...dadosFiltrados.map(item => [item.NRP, item.Material, item.Localização, item.Responsável]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Outros_Responsaveis");
    XLSX.writeFile(workbook, `Outros_Responsaveis_${formatarData()}.xlsx`);
}

// Refresh: apaga tudo exceto a planilha carregada
document.getElementById("refreshButton").addEventListener("click", function () {
    const confirmacao = confirm("Tem certeza que deseja resetar tudo? Isso apagará todos os dados coletados, exceto a planilha carregada.");
    if (confirmacao) {
        // Reseta variáveis e interface
        salaSelecionada = "";
        patrimoniosColetados = [];
        document.getElementById("salaInput").value = "";
        document.getElementById("salaInput").disabled = false;
        document.getElementById("confirmarSala").disabled = false;
        document.getElementById("patrimonioInput").value = "";
        document.getElementById("patrimonioList").innerHTML = "";
        document.getElementById("progressText").innerText = "AUTORIZADA CONSULTA"; // Mantém mensagem de planilha carregada

        alert("Reset concluído com sucesso! A planilha carregada foi mantida.");
    }
});
