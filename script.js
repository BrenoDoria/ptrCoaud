<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha de Retirada/Empréstimo</title>
    <style>
      body {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            margin: 10px;
            padding: 0;
            box-sizing: border-box;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
        }

        @page {
            size: A4;
            margin: 12mm 10mm 15mm 10mm;
        }

        .header {
            text-align: left;
            margin-bottom: 5px;
        }

        .header-content {
            display: flex;
            align-items: center;
            justify-content: left;
            margin-bottom: 5px;
        }

        .brasao {
            width: 55px;
            height: auto;
            margin-right: 15px;
        }

        .header-text p {
            margin: 1px 0;
            font-size: 9pt;
        }

        .section-title {
            font-weight: bold;
            margin: 6px 0;
            text-align: center;
            text-decoration: underline;
            font-size: 9pt;
        }

        #listaMaterial {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 9pt;
            page-break-inside: avoid;
        }

        th, td {
            padding: 4px 6px;
            border: 1px solid black;
            word-break: break-word;
        }

        .field-label {
            font-weight: bold;
            width: 50px;
            display: inline-block;
        }

        .field-label2 {
            font-weight: bold;
            width: 84px;
            display: inline-block;
        }

        .field-value {
            display: inline-block;
            width: 230px;
            min-height: 16px;
        }

        p {
            margin: 2px 0 6px 0;
        }

        #devolucao-section {
            margin-top: 6px;
        }

        .signature {
            margin-top: 12px;
            font-size: 9pt;
        }

        .signature-line {
            border-bottom: 1px solid black;
            width: 150px;
            display: inline-block;
            margin-left: 6px;
        }

        .empty-space {
            height: 20px;
        }

        .espaco-entre-termo {
            margin-bottom: 200px; /* ajuste o valor como desejar */
        }

        @media print {
            .no-print {
                display: none;
            }

            .page-break {
                page-break-before: always;
            }

            .container {
                max-width: 100%;
            }
        }

        /* Responsividade para telas menores */
        @media screen and (max-width: 768px) {
            body {
                font-size: 8pt;
                margin: 5px;
            }

            .container {
                padding: 5px;
            }

            .header-content {
                flex-direction: column;
                align-items: flex-start;
            }

            .brasao {
                width: 40px;
                margin-right: 0;
                margin-bottom: 10px;
            }

            .header-text p {
                font-size: 8pt;
            }

            .section-title {
                font-size: 8pt;
            }

            table {
                font-size: 8pt;
            }

            th, td {
                padding: 3px 4px;
            }

            .field-label {
                width: 40px;
            }

            .field-label2 {
                width: 70px;
            }

            .field-value {
                width: 180px;
            }

            #devolucao-section .field-value {
                width: 150px;
            }

            .signature-line {
                width: 120px;
            }

            .espaco-entre-termo {
                margin-bottom: 100px;
            }

            button {
                padding: 5px 10px;
                font-size: 8pt;
            }
        }

        @media screen and (max-width: 480px) {
            body {
                font-size: 7pt;
            }

            .brasao {
                width: 35px;
            }

            .header-text p {
                font-size: 7pt;
            }

            .section-title {
                font-size: 7pt;
            }

            table {
                font-size: 7pt;
            }

            th, td {
                padding: 2px 3px;
            }

            .field-label {
                width: 35px;
            }

            .field-label2 {
                width: 60px;
            }

            .field-value {
                width: 120px;
            }

            #devolucao-section .field-value {
                width: 100px;
            }

            .signature-line {
                width: 100px;
            }

            .espaco-entre-termo {
                margin-bottom: 50px;
            }

            button {
                padding: 4px 8px;
                font-size: 7pt;
            }
        }
    </style>
</head>
<body onload="carregarFicha()">
 <div class="header">
    <div class="header-content">
        <img src="brasao_republica_brasil.jpg" class="brasao" alt="Brasão da República do Brasil">
        <div class="header-text">
            <p><strong>CÂMARA DOS DEPUTADOS</strong></p>
            <p>Coordenação de Engenharia de Telecomunicações e Audiovisual - COAUD</p>
            <p>Seção de Apoio aos Auditórios e Comissões - SAUDI/SAPCO</p>
            <p><strong>FICHA DE RETIRADA / EMPRÉSTIMO DE MATERIAL PARA EVENTO</strong></p>
        
        </div>
    </div>
</div>

    

    <div style="font-size: medium; margin-top: 20px;"  class="section-title"><center>LISTA DE MATERIAL COM PATRIMÔNIO</center></div>
    <table id="listaMaterial">
        <tr>
            <th style="width: 100px;">Patrimônio</th>
            <th>Descrição</th>
        </tr>
    </table>

    <!--<div class="section-title">LISTA DE MATERIAL SEM PATRIMÔNIO</div>
    <table>
        <tr><td style="border: 1px solid black; padding: 5px;" class="empty-space"></td></tr>
    </table>-->

    <div class="section-title">RETIRADA</div>
    <div id="dadosFicha">
        <p><span class="field-label">Ficha:</span> <span class="field-value" id="ficha"></span></p>
        <p><span class="field-label">Data:</span> <span class="field-value" id="data">  </span> <span class="field-label"> Evento: </span> <span class="field-value" id="evento"></span></p>
        <p><span class="field-label">Local:</span> <span class="field-value" id="local"></span></p>
    </div>
    <p><span class="field-label">Hora:</span> <span class="field-value" id="hora"></span></p>
    <p><span class="field-label">Nome:</span> <span class="field-value" id="nome"></span>
    <span class="field-label">Ponto:</span> <span class="field-value" id="pontoOperador1"></span></p>
    <p><span class="field-label2">Almoxarifado:</span> <span class="field-value" id="nomeOperador2"></span>
    <span class="field-label">Ponto:</span> <span class="field-value" id="pontoOperador2"></span></p>
    <!--<p><span class="field-label">Observações:</span> <span class="field-value"></span></p>-->

    <div class="section-title">DEVOLUÇÃO</div>
    <div id="devolucao-section">
        <p><span class="field-label">Data:_____________________________________</span> <span class="field-value"></span> <span class="field-label">Hora:_____:_____</span> <span class="field-value"></span></p>
        <p><span class="field-label">Nome:_____________________________________</span> <span class="field-value"></span> <span class="field-label">Ponto:_____________________________________</span> <span class="field-value"></span></p>
        <p><span class="field-label">Almoxarifado:__________________________________________________________________________</span> <span class="field-value"></span></p>
        <p><span class="field-label">Observações:__________________________________________________________________________</span> <span class="field-value" style="width: 400px;"></span></p>
    </div>

    <div style="margin-top: 15px;" class="section-title">TERMO DE EMPRÉSTIMO</div>
    <div>
    <p>Conforme legislação vigente, o servidor abaixo-assinado e qualificado se responsabiliza pela guarda, zelo e devolução do material acima relacionado, classificado como permanente e de carga patrimonial desta seção de apoio SAUDI/SAPCO, da Coordenação de Engenharia de Telecomunicações e Audiovisual - COAUD.</p>
    </div>
    
    <div class="signature">
        
        <p>A SAUDI/SAPCO, representada pelo Operador: <span id="operadorAssinatura" style="font-size: 15px; display: inline; font-weight: bold; margin-right: 10px;"></span>
            <span class="field-label">Ponto:</span> <span id="pontoOperadorAssinatura" style="font-size: 15px; display: inline; font-weight: bold; margin-right: 10px;"></span></p>
       
    </div>
    <div class="espaco-entre-termo">
         <p style="margin-top: 50px;">Rubrica: <span class="signature-line"></span> recolheu, em <span id="dataAssinatura"></span>, às <span id="horaAssinatura"></span></p>
       <div style="margin-top: 30px;">
        <button style="margin-top: 50px;"onclick="window.print()">Imprimir</button>
        <button onclick="window.location.href='fichas.html'">Voltar</button>
    </div>
    </div>
    
    

    <script>
        const operadoresPontos = {
            "Adson Miranda dos Anjos": "914.262",
            "Afonso Viana de Mesquita Filho": "5.947",
            "Alberto Cesar Souza Almeida": "5.302",
            "Alexander Rafael Carvalho Paim": "882.420",
            "Alexandre Alves de Siqueira": "919.956",
            "Alison Silva de Oliveira": "914.799",
            "Allan Cosseti Ardisson": "919.895",
            "Altamir Araújo da Silva": "881.758",
            "Antonio Batista Ângelo": "999.134",
            "Antonio Rodrigues Siqueira Filho": "917.486",
            "Arley Carvalho Alves": "915.546",
            "Breno Doria Felicio": "922.083",
            "Bruno Fernandes Braga": "881.842",
            "Bruno Rodrigues do Prado": "919.894",
            "Bruno Vieira Rodrigues": "922.084",
            "Carlos César Ferreira de Sousa": "5.250",
            "Carlos Cesar José da Silva": "920.074",
            "Carlos Eduardo Guedes da Silva": "882.174",
            "Carlos Roberto de Paiva Miranda dos Santos": "922.498",
            "Cinthia Neves Carvalho Barbosa": "5.476",
            "Cláudio Marcelo do Nascimento": "882.421",
            "Davi Aragão de Paula Gonçalves": "921.627",
            "Douglas Batista da Silva": "920.077",
            "Emmanuel do Amaral Idelfonso": "920.076",
            "Enzo Risso Conturbia": "920.438",
            "Eric Samuel do Ouro": "920.359",
            "Erika Fedosseeff Auler": "921.672",
            "Eromilson Monteiro dutra Chaves": "882.134",
            "Evellyn Mendes de Souza Nunes": "915.974",
            "Fausto Barbosa de Oliveira": "888.223",
            "Felipe Omena Vasconcellos de Assis": "919.593",
            "Fernando de Sousa Vasconcelos": "914.382",
            "Flávio Lima Câmara": "882.218",
            "Francisco de Assis da Silva Sales": "888.744",
            "Francisco de Sousa Filho": "5.953",
            "Francisco Juniel Sousa e Silva": "915.547",
            "Geraldo Ribeiro de Souza Filho": "888.010",
            "Gildo Marques da Silva": "920.092",
            "Gilson Gomes da Silva": "882.541",
            "Gilson Gustavo de Paiva Oliveira": "5.254",
            "Gleisson Carlos Pereira da Silva": "914.815",
            "Guilherme Malheiro da Rocha Pinto": "4.224",
            "Helisson Rafael de O. Leite": "881.759",
            "Helyeber Feitosa Ferreira": "919.899",
            "Hilton Severiano Ferreira": "922.678",
            "Huelisson Amancio de Moraes Silva": "881.596",
            "Igor Mendes dos Santos": "921.292",
            "Isaias Pereira Soares": "919.903",
            "Joel Luiz de Sá Silva": "920.353",
            "Joel Pereira Santos": "882.652",
            "Joilson Santos de Jesus": "920.123",
            "Jônatas Soares de Andrade": "881.598",
            "Jose Henrique Ferreira da Silva": "7.913",
            "José Nilton Abraão de Sousa": "920.352",
            "Joval Bastos Freitas Júnior": "882.702",
            "Juliano Gustavo Pedro de Oliveira": "882.053",
            "Kely Berlinck Freire": "919.896",
            "Kleber de Araújo Moura": "888.397",
            "Leandro Calixto da Silva": "917.992",
            "Leandro Silva Lima Alves": "921.291",
            "Leonardo Augusto de Freitas": "882.688",
            "Letícia Santana Araújo": "920.816",
            "Lívia Maria de Souza": "916.391",
            "Lucas Lima Lira": "919.897",
            "Lucas Ribeiro dos Santos": "919.904",
            "Luciano de Freitas Silva": "881.452",
            "Luis Eduardo Campos Moreira": "919.898",
            "Luiz Henrique Reis de Lima": "888.226",
            "Marcelo Bruno Rezende Costa": "882.728",
            "Marcelo Gomes da Silva": "918.923",
            "Marco Antonio Baldresca Lambert de Brito": "5.261",
            "Marco Antônio Felício Júnior": "915.553",
            "Marcos Borges de Souza": "920.075",
            "Marcus Aurélius Fernandes de Moura": "888.219",
            "Massilon Alves de Sousa Filho": "919.905",
            "Mateus da Silva Lima": "922.278",
            "Matheus Gabriel Damasceno Dias": "920.354",
            "Matheus Henrique Felix Barbosa": "922.082",
            "Múcio Homero Rocha Pires de Oliveira": "5.297",
            "Orlando Villavicencio Venegas": "882.673",
            "Paulo Fernando Volpe": "5.933",
            "Paulo Roberto Pereira": "888.227",
            "Paulo Soares da Costa": "888.228",
            "Pedro Henrique Candido Boaventura": "920.124",
            "Péricles Cruz da Silva": "881.892",
            "Priscilla Amorim dos Santos Rodrigues": "7.914",
            "Rafael Queiroz Lemos de Oliveira": "881.782",
            "Reynaldo Jessé Rodrigues da Silva": "888.131",
            "Richard Rodrigues dos Santos": "921.026",
            "Roberio Antunes Simionato": "5.266",
            "Rodrigo Fonseca Shiratori": "5.272",
            "Rondney Rodrigues Alves Sousa": "881.174",
            "Rosivan Augustinho Pereira": "882.518",
            "Thiago Veríssimo Cabral Freitas": "922.497",
            "Vinícius Veríssimo Cabral Freitas": "919.796",
            "Vivikananda Abdallah Antun Filho": "5.301",
            "Waleria Bastos Cardoso": "915.570",
            "Wanderson Balzan de Sousa": "918.679",
            "Wellington Jorge Souza Mendes": "881.179",
            "Wellington Rodrigo Ribeiro Santana": "882.052",
            "Wendel Vieira da Costa": "919.907",
            "Wesley Laécio da Silva Costa": "882.054",
            "Wesley Maurício Ribeiro França": "888.217",
            "Willian Neves da Silva": "888.230",
            "Wirlem Silva Alves": "919.906"
        };

        function carregarFicha() {
            const dadosFicha = JSON.parse(localStorage.getItem('fichaParaImprimir'));
            if (!dadosFicha) {
                alert('Nenhum dado de ficha encontrado. Redirecionando para a página principal.');
                window.location.href = 'fichas.html';
                return;
            }

            // Formatar a data e hora
            const [dataParte, horaParte] = dadosFicha.dataRetirada.split(', ');
            const [dia, mes, ano] = dataParte.split('/');
            const dataFormatada = `${dia}/${mes}/${ano}`;
            const horaFormatada = horaParte;

            // Preencher os campos
            document.getElementById('data').textContent = dataFormatada;
            document.getElementById('evento').textContent = dadosFicha.evento;
            document.getElementById('ficha').textContent = dadosFicha.idFicha;
            document.getElementById('local').textContent = dadosFicha.local;
            document.getElementById('hora').textContent = horaFormatada;
            document.getElementById('nome').textContent = dadosFicha.operador1;
            document.getElementById('pontoOperador1').textContent = operadoresPontos[dadosFicha.operador1] || "N/A";
            document.getElementById('operadorAssinatura').textContent = dadosFicha.operador1;
            document.getElementById('pontoOperadorAssinatura').textContent = operadoresPontos[dadosFicha.operador1] || "N/A";
            document.getElementById('nomeOperador2').textContent = dadosFicha.operador2;
            document.getElementById('pontoOperador2').textContent = operadoresPontos[dadosFicha.operador2] || "N/A";
            document.getElementById('dataAssinatura').textContent = dataFormatada;
            document.getElementById('horaAssinatura').textContent = horaFormatada;

            // Preencher a tabela de equipamentos
            const tabela = document.getElementById('listaMaterial');
            dadosFicha.equipamentos.forEach(equip => {
                const [patrimonio, ...descricaoParts] = equip.split(' - ');
                const descricao = descricaoParts.join(' - ');
                const row = tabela.insertRow();
                row.innerHTML = `
                    <td style="border: 1px solid black; padding: 5px;">${patrimonio}</td>
                    <td style="border: 1px solid black; padding: 5px;">${descricao}</td>
                `;
            });

            // Limpar localStorage após carregar (opcional, para evitar uso residual)
            // localStorage.removeItem('fichaParaImprimir');
        }
    </script>
</body>
</html>
