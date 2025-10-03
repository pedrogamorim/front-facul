const form = document.getElementById("relatoForm");
const popup = document.getElementById("popup");

form.addEventListener("submit", function(event){
  event.preventDefault();

  // Coleta os dados do formulário
  const dados = {
    nome: document.getElementById("nome").value,
    registro: document.getElementById("registro").value,
    email: document.getElementById("email").value,
    setor: document.getElementById("setor").value,
    relato: document.getElementById("relato").value
  };

  // Cria o arquivo JSON para download
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "relato.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  popup.style.display = "flex"; // mostra o popup
});

function fecharPopup(){
  popup.style.display = "none"; // fecha popup
}


// ==== Adições ====
const apiBase = "http://localhost:8080/api/employees";

async function buscar(){
  const reg = document.getElementById('registroInput').value.trim();
  if(!reg) return alert("Digite um registro");
  const res = await fetch(`${apiBase}/${reg}`);
  if(res.status===404){document.getElementById('resultado').innerHTML="Não encontrado"; return;}
  const emp = await res.json();
  mostrar(emp);
}

function mostrar(emp){
  let html = `<h3>${emp.nome}</h3>`;
  html += `<p><b>Registro:</b> ${emp.registro}</p>`;
  if(emp.area) html += `<p><b>Área:</b> ${emp.area}</p>`;
  if(emp.epis) html += `<p><b>EPIs:</b> ${emp.epis.join(", ")}</p>`;
  if(emp.leis) html += `<p><b>Leis:</b> ${emp.leis.join(", ")}</p>`;
  document.getElementById('resultado').innerHTML=html;
}

async function atualizar(){
  const reg = document.getElementById('registroInput').value.trim();
  const area = document.getElementById('areaSelect').value;
  if(!reg||!area) return alert("Informe registro e área");
  let res = await fetch(`${apiBase}/${reg}`);
  if(res.status!==200){alert("Registro não encontrado");return;}
  let emp = await res.json();
  emp.area=area;
  res = await fetch(`${apiBase}/${reg}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(emp)});
  if(res.ok){ const upd=await res.json(); mostrar(upd); }
}

document.getElementById('buscarBtn').addEventListener('click', buscar);
document.getElementById('atualizarBtn').addEventListener('click', atualizar);
