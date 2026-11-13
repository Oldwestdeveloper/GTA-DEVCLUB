let nome = document.querySelector(".nome");
let personagem = document.querySelector(".personagem");

function escolherPersonagem(nomePersonagem, imagemPersonagem, cor) {
  nome.innerHTML = nomePersonagem;
  personagem.src = imagemPersonagem;
  nome.style.color = cor;

  if (nomePersonagem.length > 10) {
    nome.style.fontSize = "100px";
  } else {
    nome.style.fontSize = "360px";
  }
}

function lerFoto(foto) {
  if (!foto.files || foto.files.length === 0) return;

  let leitor = new FileReader();

  leitor.onload = async function () {
    // 1. AUTENTICAÇÃO DO PUTER
    // Verifica se o visitante já tem sessão iniciada. Se não, pede o login.
    try {
      if (!puter.auth.isSignedIn()) {
        await puter.auth.signIn();
      }
    } catch (authError) {
      console.error("Login cancelado:", authError);
      escolherPersonagem("Login Necessário", "img/lucia.png", "#ff0000");
      foto.value = "";
      return;
    }

    let imagemBase64Completa = leitor.result;

    escolherPersonagem("A desenhar...", imagemBase64Completa, "#ffd319");

    try {
      // 2. GERAÇÃO DA IMAGEM (PUTER)
      let desenho = await puter.ai.txt2img(
        "Transforme a pessoa desta foto em um personagem de videogame: contorno preto grosso, cores vivas, meio corpo, mantendo o rosto parecido. Fundo totalmente transparente: sem cenário, sem chão e sem sombra.",
        {
          model: "replicate:openai/gpt-image-2.5-flare",
          provider: "openai",
          input_image: imagemBase64Completa,
          quality: "medium",
          providerOptions: { background: "transparent" },
        },
      );

      // Atualiza o ecrã com a imagem gerada e o nome "Você"
      escolherPersonagem("Você", desenho, "#ffd319");
    } catch (erro) {
      console.error("Erro de processamento:", erro);
      escolherPersonagem("Erro", imagemBase64Completa, "#ff0000");
    }

    foto.value = "";
  };

  leitor.readAsDataURL(foto.files[0]);
}
