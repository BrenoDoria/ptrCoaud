const FILE_ID = '1jc1S2fnw1GEdDA8ykCgQAE5PNUF-BKuN';
let dadosOriginais = [];
let dadosExportados = [];
let patrimoniosNaoEncontrados = [];

const responsaveisEspecificos = [
    "ALBERTO CESAR SOUZA ALMEIDA (5302)",
    "PAULO FERNANDO VOLPE (5933)",
    "JOSE HENRIQUE FERREIRA DA SILVA (7913)"
];

window.addEventListener("load", function () {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        alert("Por favor, faça login com Google na página inicial.");
        window.location.href = "index.html";
        return;
    }
    carregarPatrimoniosDoDrive(accessToken);
});

function carregarPatrimoniosDoDrive(accessToken) {
    document.getElementById("spinner").style.display = "inline-block";
    document.getElementById("progressText").innerText = "Consultando Servidor";

    fetch(`https://www.googleapis.com/drive/v3/files/${FILE_ID}?alt=media`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao baixar o arquivo: ' + response.statusText);
        return response.arrayBuffer();
    })
    .then(data => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        dadosOriginais = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        document.getElementById("progressText").innerText = "Consulta Autorizada";
        document.getElementById("spinner").style.display = "none";
        if (dadosExportados.length > 0) compararPlanilhas();
    })
    .catch(error => {
        console.error("Erro ao carregar arquivo do Drive:", error);
        document.getElementById("progressText").innerText = "Erro ao carregar os dados: " + error.message;
        document.getElementById("spinner").style.display = "none";
    });
}

document.getElementById("fileInputExportada").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    document.getElementById("spinner").style.display = "inline-block";
    document.getElementById("progressText").innerText = "Carregando planilha exportada...";

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            dadosExportados = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            document.getElementById("progressText").innerText = "Planilha exportada carregada!";
            if (dadosOriginais.length > 0) compararPlanilhas();
        } catch (error) {
            alert("Erro ao carregar a planilha exportada. Verifique o formato do arquivo.");
            console.error(error);
            document.getElementById("progressText").innerText = "Erro ao carregar exportada.";
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    };
    reader.readAsArrayBuffer(file);
});

function compararPlanilhas() {
    if (dadosOriginais.length === 0 || dadosExportados.length === 0) {
        document.getElementById("progressText").innerText = "Carregue a planilha exportada para comparar.";
        return;
    }

    const patrimoniosOriginaisEspecificos = dadosOriginais.slice(1).filter(row =>
        responsaveisEspecificos.includes(row[3]?.toString().trim())
    );
    const nrpsExportados = dadosExportados.slice(1).map(row => row[0]?.toString().trim());
    patrimoniosNaoEncontrados = patrimoniosOriginaisEspecificos.filter(row => 
        !nrpsExportados.includes(row[0]?.toString().trim())
    );

    atualizarTabela();
    document.getElementById("progressText").innerText = `Encontrados ${patrimoniosNaoEncontrados.length} patrimônios não coletados.`;
}

function atualizarTabela() {
    const listElement = document.getElementById("patrimonioList");
    listElement.innerHTML = "";
    patrimoniosNaoEncontrados.forEach((item) => {
        const row = document.createElement("tr");
        const nrpCell = document.createElement("td");
        nrpCell.textContent = item[0] || "";
        row.appendChild(nrpCell);
        const materialCell = document.createElement("td");
        materialCell.textContent = item[1] || "";
        row.appendChild(materialCell);
        const localizacaoCell = document.createElement("td");
        localizacaoCell.textContent = item[2] || "";
        row.appendChild(localizacaoCell);
        const responsavelCell = document.createElement("td");
        responsavelCell.textContent = item[3] || "";
        row.appendChild(responsavelCell);
        listElement.appendChild(row);
    });
}

function exportarNaoEncontrados() {
    if (!patrimoniosNaoEncontrados || patrimoniosNaoEncontrados.length === 0) {
        alert("Nenhum patrimônio não encontrado para exportar.");
        return;
    }
    const newData = [
        ["NRP", "Material", "Localização", "Responsável"],
        ...patrimoniosNaoEncontrados.map(item => [
            item[0] || "",
            item[1] || "",
            item[2] || "",
            item[3] || ""
        ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nao_Encontrados");
    const dataFormatada = formatarData();
    XLSX.writeFile(workbook, `Patrimonios_Não_Encontrados_${dataFormatada}.xlsx`);
}

function formatarData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
}
