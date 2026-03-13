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
    const respostaUsuario = await fetch(`https://api.github.com/users/${username}`);

    if(!respostaUsuario.ok){
      throw new Error("Usuário não encontrado.");
    }

    const dadosUsuario = await respostaUsuario.json();

    const respostaRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const dadosRepos = await respostaRepos.json();

    loading.innerText = "";

    let reposHTML = "";

    if(dadosRepos.length > 0){
      reposHTML = `
        <h3 class="repos-title">Últimos Repositórios</h3>
        ${dadosRepos.map(repo => `
          <div class="repo">
            <h3>
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </h3>
            <p>${repo.description ? repo.description : "Sem descrição."}</p>
            <div class="repo-info">
              <span>⭐ ${repo.stargazers_count}</span>
              <span>🍴 ${repo.forks_count}</span>
              <span>${repo.language ? repo.language : "Sem linguagem"}</span>
            </div>
          </div>
        `).join("")}
      `;
    } else {
      reposHTML = `<p class="repos-title">Esse usuário não possui repositórios públicos.</p>`;
    }

    result.innerHTML = `
      <div class="card">
        <img class="avatar" src="${dadosUsuario.avatar_url}" alt="Foto de ${dadosUsuario.login}">
        <h2 class="name">${dadosUsuario.name ? dadosUsuario.name : "Sem nome disponível"}</h2>
        <p class="login">@${dadosUsuario.login}</p>
        <p class="bio">${dadosUsuario.bio ? dadosUsuario.bio : "Este usuário não possui bio."}</p>

        <div class="info">
          <div class="info-box">
            <span>${dadosUsuario.followers}</span>
            Seguidores
          </div>

          <div class="info-box">
            <span>${dadosUsuario.following}</span>
            Seguindo
          </div>

          <div class="info-box">
            <span>${dadosUsuario.public_repos}</span>
            Repositórios
          </div>
        </div>

        <div class="link-wrapper">
          <a class="profile-link" href="${dadosUsuario.html_url}" target="_blank">Ver perfil no GitHub</a>
        </div>

        ${reposHTML}
      </div>
    `;

  } catch(error){
    loading.innerText = "";
    result.innerHTML = `<div class="error">${error.message}</div>`;
  }
}
