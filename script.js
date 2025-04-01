let patrimonioData = [];
let patrimoniosColetados = [];


// Carrega a planilha de dados
document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Exibe o spinner e define o texto de progresso
    document.getElementById("spinner").style.display = "inline-block";
    document.getElementById("progressText").innerText = "AGUARDE...";

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            patrimonioData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            // Exibe a primeira mensagem por 4 segundos
            document.getElementById("progressText").innerText = "BANCO DE DADOS ATUALIZADO!";
            setTimeout(() => {
                document.getElementById("progressText").innerText = "AUTORIZADA CONSULTA";
            }, 4000); // Aguarda 4 segundos (4000 milissegundos) antes de mudar o texto

        } catch (error) {
            alert("Erro ao carregar a planilha. Verifique se o arquivo está em formato XLSX válido.");
            console.error(error);
            document.getElementById("progressText").innerText = "Erro no carregamento.";
        } finally {
            // Oculta o spinner
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
}

// Função para iniciar o escaneamento
function iniciarEscaneamento() {
    const qrReader = document.getElementById("qr-reader");
    qrReader.style.display = "block"; // Exibe a área do leitor

    const html5QrCode = new Html5Qrcode("qr-reader");
    
    // Inicia o scanner com a câmera
    html5QrCode.start(
        { facingMode: "environment" }, // Usa a câmera traseira no celular
        {
            fps: 100,    // Frames por segundo (velocidade de escaneamento)
            qrbox: { width: 100, height: 400 } // Área de escaneamento
        },
        (decodedText) => {
            // Preenche o campo de patrimônio com o código escaneado
            document.getElementById("patrimonioInput").value = decodedText;
            html5QrCode.stop(); // Para o scanner após o escaneamento
            qrReader.style.display = "none"; // Oculta o leitor
        },
        (errorMessage) => {
            // Pode adicionar mensagens de erro, se necessário
            console.log("Erro ao escanear:", errorMessage);
        }
    ).catch((err) => {
        console.error("Erro ao acessar a câmera:", err);
        alert("Erro ao acessar a câmera. Verifique as permissões.");
    });
}

function iniciarEscaneamento() {
    const qrReader = document.getElementById("qr-reader");
    qrReader.style.display = "block"; // Exibe a área do leitor

    const html5QrCode = new Html5Qrcode("qr-reader");
    
    html5QrCode.start(
        { facingMode: "environment" }, // Usa a câmera traseira no celular
        {
            fps: 90,    // Frames por segundo (velocidade de escaneamento)
            qrbox: { width: 400, height: 200 } // Área de escaneamento
        },
        (decodedText) => {
            // Remove pontos do código escaneado
            const cleanedText = decodedText.replace(/\./g, ""); // Substitui todos os pontos por vazio
            document.getElementById("patrimonioInput").value = cleanedText;
            
            html5QrCode.stop(); // Para o scanner após o escaneamento
            qrReader.style.display = "none"; // Oculta o leitor
        },
        (errorMessage) => {
            console.log("Erro ao escanear:", errorMessage);
        }
    ).catch((err) => {
        console.error("Erro ao acessar a câmera:", err);
        alert("Erro ao acessar a câmera. Verifique as permissões.");
    });
}




// Função para adicionar patrimônio digitado ou bipado
function addPatrimonio() {

    
    // Obtém o valor do campo de entrada e remove pontos
    let patrimonioInput = document.getElementById("patrimonioInput").value.trim();
    patrimonioInput = patrimonioInput.replace(/\./g, ""); // Remove tudo que não é número

    if (!patrimonioInput) {
        alert("Digite ou bip o número de patrimônio.");
        return;
    }

    const patrimonioSemZeros = patrimonioInput.replace(/^0+/, ""); // Remove todos os zeros iniciais


    // Verifica se o patrimônio já foi coletado
    const jaColetado = patrimoniosColetados.some(item => item.NRP == patrimonioInput);

    if (jaColetado) {
        alert("Este patrimônio já foi coletado.");
        document.getElementById("patrimonioInput").value = ""; // Limpa o campo
        document.getElementById("patrimonioInput").focus(); // Reaplica o foco
        return;
    }

     // Busca o patrimônio na lista carregada
     const encontrado = patrimonioData.find(
        (row) => row[0] && row[0].toString().replace(/^0+/, "") === patrimonioSemZeros
    );

    if (encontrado) {
        patrimoniosColetados.push({
            NRP: encontrado[0],
            Material: encontrado[1],
            Localização: encontrado[2],
            Responsável: encontrado[3],
        });
        updateList();
        document.getElementById("patrimonioInput").value = ""; // Limpa o campo
        document.getElementById("patrimonioInput").focus(); // Reaplica o foco
    } else {
        alert("Patrimônio não encontrado.");
        document.getElementById("patrimonioInput").value = ""; // Limpa o campo
        document.getElementById("patrimonioInput").focus(); // Reaplica o foco
    }
}



document.getElementById("patrimonioInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") { // Quando o Enter for pressionado
        addPatrimonio();
    }
});



// Atualiza a lista de patrimônios coletados na tela
function updateList() {
    const listElement = document.getElementById("patrimonioList");
    listElement.innerHTML = ""; // Limpa a tabela antes de adicionar novos itens

    patrimoniosColetados.forEach((item) => {
        const row = document.createElement("tr");

        // Coluna NRP
        const nrpCell = document.createElement("td");
        nrpCell.textContent = item.NRP;
        row.appendChild(nrpCell);

        // Coluna Material
        const materialCell = document.createElement("td");
        materialCell.textContent = item.Material;
        row.appendChild(materialCell);

        // Coluna Localização
        const LocalizaçãoCell = document.createElement("td");
        LocalizaçãoCell.textContent = item.Localização;
        row.appendChild(LocalizaçãoCell);

        // Coluna Responsável
        const responsavelCell = document.createElement("td");
        responsavelCell.textContent = item.Responsável;
        row.appendChild(responsavelCell);

        listElement.appendChild(row);
    });
}

// Exporta os dados coletados para uma nova planilha
function exportExcel() {
    const newData = [
        ["NRP", "Material", "Localização", "Responsável"],
        ...patrimoniosColetados.map((item) => [
            item.NRP,
            item.Material,
            item.Localização,
            item.Responsável,
        ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patrimonios Coletados");

    XLSX.writeFile(workbook, `patrimonios_coletados_${Date.now()}.xlsx`);
}

console.log(patrimoniosColetados);

function exportPlanilhaEspecifica() {
    // Lista de responsáveis específicos
    const responsaveisEspecificos = [
        "ALBERTO CESAR SOUZA ALMEIDA (5302)", 
        "PAULO FERNANDO VOLPE (5933)"
    ];

    // Filtrar patrimônios dos responsáveis específicos
    const dadosFiltrados = patrimoniosColetados.filter(item => 
        responsaveisEspecificos.some(responsavel =>
            responsavel.trim() === item.Responsável.trim() // Remove espaços ao comparar
        )
    );

    if (dadosFiltrados.length === 0) {
        alert("Nenhum patrimônio encontrado para os responsáveis específicos.");
        return;
    }

    // Preparar os dados para exportação
    const newData = [
        ["NRP", "Material", "Localização", "Responsável"],
        ...dadosFiltrados.map(item => [item.NRP, item.Material,item.Localização, item.Responsável]),
    ];

    // Criar e exportar o arquivo XLSX
    const worksheet = XLSX.utils.aoa_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responsaveis_Especificos");

    XLSX.writeFile(workbook, `responsaveis_especificos_${Date.now()}.xlsx`);
}

function exportPlanilhaOutros() {
    // Lista de responsáveis específicos para exclusão
    const responsaveisEspecificos = [
        "ALBERTO CESAR SOUZA ALMEIDA (5302)", 
        "PAULO FERNANDO VOLPE (5933)"
    ];

    // Filtrar patrimônios dos outros responsáveis
    const dadosFiltrados = patrimoniosColetados.filter(item => 
        !responsaveisEspecificos.some(responsavel =>
            responsavel.trim() === item.Responsável.trim() // Remove espaços ao comparar
        )
    );

    if (dadosFiltrados.length === 0) {
        alert("Nenhum patrimônio encontrado para outros responsáveis.");
        return;
    }

    // Preparar os dados para exportação
    const newData = [
        ["NRP", "Material", "Localização", "Responsável"],
        ...dadosFiltrados.map(item => [item.NRP, item.Material,item.Localização, item.Responsável]),
    ];

    // Criar e exportar o arquivo XLSX
    const worksheet = XLSX.utils.aoa_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Outros_Responsaveis");

    XLSX.writeFile(workbook, `outros_responsaveis_${Date.now()}.xlsx`);
}



