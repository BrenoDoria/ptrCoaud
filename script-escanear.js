const FILE_ID = '1q9RCwJ4P--QIH4kkMszffrN8ZwzkSsNoZtPH-Usk4Zw';
let salaSelecionada = "";
let patrimoniosColetados = [];
let patrimonioData = [];

function formatarData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
}

window.addEventListener("load", function () {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        alert("Por favor, faça login com Google na página inicial.");
        window.location.href = "index.html";
        return;
    }
    carregarPatrimoniosDoSheets(accessToken);
});

function carregarPatrimoniosDoSheets(accessToken) {
    document.getElementById("spinner").style.display = "inline-block";
    document.getElementById("progressText").innerText = "Consultando Servidor";

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${FILE_ID}/values/SIGMAS!A:D`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        patrimonioData = data.values || [];
        document.getElementById("progressText").innerText = "AUTORIZADA CONSULTA";
        document.getElementById("spinner").style.display = "none";
        document.getElementById("salaInput").focus();
    })
    .catch(error => {
        console.error("Erro ao carregar dados do Sheets:", error);
        document.getElementById("progressText").innerText = "Erro ao carregar os dados: " + error.message;
        document.getElementById("spinner").style.display = "none";
    });
}
// Confirmação da sala e demais funções permanecem iguais (copie do original)
document.getElementById("confirmarSala").addEventListener("click", function () {
    salaSelecionada = document.getElementById("salaInput").value.trim();
    if (!salaSelecionada) {
        alert("Por favor, digite o nome da sala antes de confirmar!");
        return;
    }
    document.getElementById("salaInput").disabled = true;
    document.getElementById("confirmarSala").disabled = true;
    alert(`ATENÇÃO! A sala '${salaSelecionada}' foi selecionada com sucesso!`);
    document.getElementById("patrimonioInput").focus();
});

document.getElementById("patrimonioInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addPatrimonio();
    }
});

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
            Localização: salaSelecionada,
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

document.getElementById("resetarColeta").addEventListener("click", function () {
    document.getElementById("salaInput").disabled = false;
    document.getElementById("salaInput").value = "";
    document.getElementById("confirmarSala").disabled = false;
    salaSelecionada = "";
    alert("Campo de sala desbloqueado. Digite uma nova sala e confirme para continuar a coleta.");
});

function exportPlanilhaEspecifica() {
    const responsaveisEspecificos = [
        "ALBERTO CESAR SOUZA ALMEIDA (5302)",
        "PAULO FERNANDO VOLPE (5933)",
        "JOSE HENRIQUE FERREIRA DA SILVA (7913)"
    ];
    const dadosFiltrados = patrimoniosColetados.filter(item =>
        responsaveisEspecificos.some(responsavel => responsavel.trim() === item.Responsável.trim())
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

function exportPlanilhaOutros() {
    const responsaveisEspecificos = [
        "ALBERTO CESAR SOUZA ALMEIDA (5302)",
        "PAULO FERNANDO VOLPE (5933)",
        "JOSE HENRIQUE FERREIRA DA SILVA (7913)"
    ];
    const dadosFiltrados = patrimoniosColetados.filter(item =>
        !responsaveisEspecificos.some(responsavel => responsavel.trim() === item.Responsável.trim())
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

document.getElementById("refreshButton").addEventListener("click", function () {
    const confirmacao = confirm("Tem certeza que deseja resetar tudo? Isso apagará todos os dados coletados, exceto a planilha carregada.");
    if (confirmacao) {
        salaSelecionada = "";
        patrimoniosColetados = [];
        document.getElementById("salaInput").value = "";
        document.getElementById("salaInput").disabled = false;
        document.getElementById("confirmarSala").disabled = false;
        document.getElementById("patrimonioInput").value = "";
        document.getElementById("patrimonioList").innerHTML = "";
        document.getElementById("progressText").innerText = "AUTORIZADA CONSULTA";
        alert("Reset concluído com sucesso! A planilha carregada foi mantida.");
    }
});
