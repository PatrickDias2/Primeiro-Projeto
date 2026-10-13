let total = 0;

let quantidade = 0;

let comprovantes = [];


// =================================================
// LER FOTO
// =================================================

async function Lerfoto(event) {

let foto =
event.target.files[0];


if (!foto) {

return;

}


console.log(
"Estou Processando a Foto"
);

console.log(foto);


// ==========================================
// CRIA MINIATURA DA FOTO
// ==========================================

let imagem =
URL.createObjectURL(foto);


comprovantes.push({

imagem: imagem,

texto: "",
valor: 0

});


atualizarMiniaturas();


// ==========================================
// PEDIDO PARA A IA
// ==========================================

let pedido = `

Analise a imagem do comprovante/nota fiscal e extraia as informações.

Retorne SOMENTE o resultado final formatado abaixo, sem explicações, sem comentários e sem usar Markdown.

FORMATO OBRIGATÓRIO:

🧾 COMPROVANTE

🏪 Estabelecimento: [nome]

📅 Data: [data]

🛒 ITENS

[emoji] [item] — R$ [valor]

[emoji] [item] — R$ [valor]

[emoji] [item] — R$ [valor]

💰 TOTAL

R$ [valor total]

📊 CATEGORIA

[emoji] [categoria]

REGRAS:

- Use emojis diferentes de acordo com a categoria do produto.
- Exemplos: 🍎 alimentos, 🥤 bebidas, 🧹 limpeza, 💊 farmácia, 👕 roupas, 💻 eletrônicos, 🏠 casa, 🐶 pet, ⛽ combustível.
- Se não conseguir identificar uma categoria, use 📦.
- Os valores devem estar no padrão brasileiro: R$ 10,50.
- Identifique o nome do estabelecimento quando estiver visível.
- Identifique a data quando estiver visível.
- Liste todos os produtos que conseguir identificar.
- Calcule o total apenas com base nos valores visíveis na imagem.
- Se alguma informação não estiver disponível, escreva "Não identificado".
- Não invente informações.
- Não coloque texto antes ou depois desse formato.

`;


try {
let resposta =
await puter.ai.chat(
pedido,
foto
);


console.log(resposta);


let texto =
resposta.message.content;


console.log(texto);


// ==========================================
// COLOCA RESULTADO NO EXTRATO
// ==========================================

document
.querySelector(".lista")
.innerHTML += `

<div class="comprovante">

${texto}

</div>

`;


// ==========================================
// PEGA O TOTAL DO COMPROVANTE
// ==========================================

let partes =
texto.split("💰 TOTAL");


let valorTotal = null;


if (partes[1]) {

valorTotal =
partes[1].match(
/R\$\s*([\d.,]+)/ );

 }


// ==========================================
// SE ENCONTROU O TOTAL
// ==========================================

 if (valorTotal) {

let valor =
Number(
valorTotal[1]
.replace(/\./g, "")
.replace(",", ".")
);

console.log(
"Valor encontrado:",
valor
);

total += valor;


// Guarda o valor
// no comprovante

comprovantes[
comprovantes.length - 1
].valor = valor;


comprovantes[
comprovantes.length - 1
].texto = texto;


// Conta o comprovante
quantidade++;
}


else {
console.log(
"Não foi possível encontrar o total."
);


comprovantes[
comprovantes.length - 1
].texto = texto;
}


// ==========================================
// ATUALIZA TOTAL
// ==========================================

document
.querySelector(".refvalor")
.innerHTML =

"R$ " +
total
.toFixed(2)
.replace(".", ",");


document
.querySelector("#total")
.innerHTML =

"R$ " +

total
.toFixed(2)
.replace(".", ",");


// ==========================================
// ATUALIZA QUANTIDADE
// ==========================================

document
.querySelector(".contador")
.innerHTML =

quantidade +

" comprovantes lidos";


// ==========================================
// ATUALIZA MINIATURAS//
// ==========================================

atualizarMiniaturas();

}


catch (erro) {

console.error(
"Erro ao processar comprovante:",
erro
);
}


// ==========================================
// LIMPA O INPUT
// ==========================================

event.target.value = "";

}


// =================================================
// MOSTRAR MINIATURAS
// =================================================

function atualizarMiniaturas() {

let container =
document.querySelector(
"#miniaturas"
);

container.innerHTML = "";

// Mostra somente 2

let quantidadeMostrar = 2;

if (
comprovantes.length <= 2
) {

quantidadeMostrar =
comprovantes.length;
}


for (
let i = 0;
i < quantidadeMostrar;
i++
) {

let comprovante =
comprovantes[i];


let valor =
comprovante.valor

.toFixed(2)
.replace(".", ",");


container.innerHTML += `

<div
class="mini-comprovante"
onclick="abrirComprovante(${i})"
>

<img
src="${comprovante.imagem}"
alt="Comprovante ${i + 1}"
>


<div class="mini-info">
<strong>
Comprovante ${i + 1}
</strong>


<span>
R$ ${valor}
</span>

</div>
</div>

 `;

}


// ==========================================
// BOTÃO VER MAIS
// ==========================================

let botao =
document.querySelector(
"#verMais"
);


if (
comprovantes.length > 2
) {

botao.style.display =
"block";


botao.innerHTML =
`Ver mais (${comprovantes.length})`;
}


else {
botao.style.display =
"none";
}

}


// =================================================
// VER TODOS
// =================================================

function mostrarTodos() {

let container =
document.querySelector(
"#miniaturas"
);

container.innerHTML = "";

for (
let i = 0;
i < comprovantes.length;
i++
) {

let comprovante =
comprovantes[i];


let valor =
comprovante.valor

.toFixed(2)

.replace(".", ",");


container.innerHTML += `

<div
class="mini-comprovante"
onclick="abrirComprovante(${i})"
>

<img
src="${comprovante.imagem}"
alt="Comprovante ${i + 1}"
>

<div class="mini-info">
<strong>
Comprovante ${i + 1}
</strong>

<span>
R$ ${valor}
</span>
</div>
</div>
 `;

 }


let botao =
document.querySelector(
"#verMais"
);


botao.innerHTML =
"Mostrar menos";


botao.onclick =
mostrarMenos;

}


// =================================================
// MOSTRAR SOMENTE 2
// =================================================

function mostrarMenos() {

atualizarMiniaturas();


let botao =
document.querySelector(
"#verMais"
);


botao.onclick =
mostrarTodos;

}


// =================================================
// ABRIR COMPROVANTE
// =================================================

function abrirComprovante(index) {

let comprovante =
comprovantes[index];

console.log(
"Abrindo comprovante:",
index
);

alert(

"Comprovante " +

(index + 1) +
"\n\n" +

"Valor: R$ " +

comprovante.valor

.toFixed(2)

.replace(".", ",")

);
}


// =================================================
// TESTE
// =================================================

console.log(
"SCRIPTS.JS FOI CARREGADO!"
);
