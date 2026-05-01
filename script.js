const membros = document.querySelectorAll(".membro");
const sobre = document.querySelector(".sobre_membro");

async function carregarMembros() {
    const res = await fetch("xdaquestao.json");
    return await res.json();
}

const dadosPromise = carregarMembros();

membros.forEach(el => {
    el.addEventListener("click", async () => {
        const imgMembro = el.querySelector(".img_membro");
        const ativo = imgMembro.classList.contains("membro_selecionado");

        membros.forEach(m => {
            m.querySelector(".img_membro")
             .classList.remove("membro_selecionado");
        });

        if (ativo) {
            sobre.classList.add("sumindo");

            setTimeout(() => {
                sobre.classList.add("desativado");
                sobre.classList.remove("sumindo");
            }, 400);

            return;
        }

        imgMembro.classList.add("membro_selecionado");

        const id = el.id;
        const dados = await dadosPromise;
        const membro = dados.membro[id];

        const h1 = document.querySelector(".sobre_membro h1");
        const h2 = document.querySelector(".sobre_membro h2");
        const imgSobre = document.querySelector(".sobre_membro img");
        const funcao = document.querySelector(".funcao_membro");
        const gostos = document.querySelector(".gostos_membro");
        const interprete = document.querySelector(".interprete_membro");
        const info = document.querySelector(".info_membro");

        h1.innerHTML = `${membro.nome}`;
        h2.innerHTML = `${membro.papel}`;
        h2.style.textShadow = `0 0 10px ${membro.cor}, 0 0 15px ${membro.cor}`;
        imgSobre.src = membro.imagem;
        funcao.innerHTML = `<span style="font-weight:bold; text-decoration:underline;">Função no canal: </span>${membro.funcao}`;
        gostos.innerHTML = `<span style="font-weight:bold; text-decoration:underline;">Gostos: </span>${membro.gostos}`;
        interprete.innerHTML = `<span style="font-weight:bold; text-decoration:underline;">Intérprete: </span>${membro.interprete}`;
        info.innerHTML = `<span style="font-style: italic;">"${membro.info}"</span>`;

        sobre.classList.remove("desativado");
        sobre.classList.add("sumindo");

        requestAnimationFrame(() => {
            sobre.classList.remove("sumindo");
        });
    });
});

let index = 0;
let videos = [];
let intervalo;

const player = document.getElementById("player");
const titulo = document.getElementById("titulo_video");

async function carregarVideos() {
    const res = await fetch("xdaquestao.json");
    const dados = await res.json();

    videos = Object.values(dados.videos);
    atualizarVideo();
}

function atualizarVideo() {
    player.src = videos[index].url;
    
    if (titulo) {
        titulo.innerText = videos[index].titulo;
    }
}

function nextVideo() {
    index = (index + 1) % videos.length;
    atualizarVideo();
    resetAuto();
}

function prevVideo() {
    index = (index - 1 + videos.length) % videos.length;
    atualizarVideo();
    resetAuto();
}

document.getElementById("next").onclick = nextVideo;
document.getElementById("prev").onclick = prevVideo;

function iniciarAuto() {
    intervalo = setInterval(() => {
        index = (index + 1) % videos.length;
        atualizarVideo();
    }, 10000);
}

function resetAuto() {
    clearInterval(intervalo);
    iniciarAuto();
}

carregarVideos().then(() => {
    iniciarAuto();
});