const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", buscarUsuario);
usernameInput.addEventListener("keydown", function(event){
  if(event.key === "Enter"){
    buscarUsuario();
  }
});

async function buscarUsuario(){
  const username = usernameInput.value.trim();

  result.innerHTML = "";
  loading.innerText = "";

  if(username === ""){
    result.innerHTML = `<div class="error">Digite um username do GitHub.</div>`;
    return;
  }

  loading.innerText = "Buscando usuário...";

  try{
    const resposta = await fetch(`https://api.github.com/users/${username}`);

    if(!resposta.ok){
      throw new Error("Usuário não encontrado");
    }

    const dados = await resposta.json();

    loading.innerText = "";

    result.innerHTML = `
      <div class="card">
        <img class="avatar" src="${dados.avatar_url}" alt="Foto de ${dados.login}">
        <h2 class="name">${dados.name ? dados.name : "Sem nome disponível"}</h2>
        <p class="login">@${dados.login}</p>
        <p class="bio">${dados.bio ? dados.bio : "Este usuário não possui bio."}</p>

        <div class="info">
          <div class="info-box">
            <span>${dados.followers}</span>
            Seguidores
          </div>

          <div class="info-box">
            <span>${dados.following}</span>
            Seguindo
          </div>

          <div class="info-box">
            <span>${dados.public_repos}</span>
            Repositórios
          </div>
        </div>

        <a class="profile-link" href="${dados.html_url}" target="_blank">
          Ver perfil no GitHub
        </a>
      </div>
    `;
  }catch(error){
    loading.innerText = "";
    result.innerHTML = `<div class="error">${error.message}</div>`;
  }
}