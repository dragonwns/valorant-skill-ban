const koreanNames = {
  Astra: "아스트라",
  Breach: "브리치",
  Brimstone: "브림스톤",
  Chamber: "체임버",
  Clove: "클로브",
  Cypher: "사이퍼",
  Deadlock: "데드록",
  Fade: "페이드",
  Gekko: "게코",
  Harbor: "하버",
  Iso: "아이소",
  Jett: "제트",
  "KAY/O": "케이오",
  Killjoy: "킬조이",
  Neon: "네온",
  Omen: "오멘",
  Phoenix: "피닉스",
  Raze: "레이즈",
  Reyna: "레이나",
  Sage: "세이지",
  Skye: "스카이",
  Sova: "소바",
  Tejo: "테호",
  Viper: "바이퍼",
  Vyse: "바이스",
  Waylay: "웨이레이",
  Yoru: "요루",
  Miks: "믹스",
  Veto: "비토"
};

const STORAGE_KEY = "valorant_bans";

const container =
document.getElementById("agentContainer");

const searchInput =
document.getElementById("searchInput");

const resetBtn =
document.getElementById("resetBtn");

const banCountElement =
document.getElementById("banCount");

function getSavedBans(){
  return JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || [];
}

function saveBans(){

  const bannedSkills = [];

  document
    .querySelectorAll(".skill.banned")
    .forEach(skill => {

      bannedSkills.push(
        skill.dataset.id
      );

    });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(bannedSkills)
  );

  updateBanCount();
}

function updateBanCount(){

  const count =
  document.querySelectorAll(
    ".skill.banned"
  ).length;

  banCountElement.textContent =
  `밴 수: ${count}`;
}

async function loadAgents(){

  const response =
  await fetch(
    "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
  );

  const data =
  await response.json();

  const agents = data.data.sort((a, b) => {

  const nameA =
    koreanNames[a.displayName] ||
    a.displayName;

  const nameB =
    koreanNames[b.displayName] ||
    b.displayName;

  return nameA.localeCompare(
    nameB,
    "ko"
  );

});

renderAgents(agents);
}

function renderAgents(agents){

  container.innerHTML = "";

  agents.forEach(agent => {

    const card =
    document.createElement("div");

    card.className =
    "agent-card";

    const skillsHTML =
          agent.abilities
    .filter(skill => skill.displayIcon)
    .slice(0,4)
    .map((skill,index) => `
        <div
          class="skill"
          data-id="${agent.displayName}-${index}"
        >
          <img src="${skill.displayIcon}">
        </div>
      `)
      .join("");

    card.innerHTML = `
      <div class="agent-name">
        ${koreanNames[agent.displayName] || agent.displayName}
      </div>

      <img
        class="agent-img"
        src="${agent.displayIcon}"
      >

      <div class="skills">
        ${skillsHTML}
      </div>
    `;

    container.appendChild(card);
  });

  activateBanSystem();
}

function activateBanSystem(){

  const savedBans =
  getSavedBans();

  document
    .querySelectorAll(".skill")
    .forEach(skill => {

      if(
        savedBans.includes(
          skill.dataset.id
        )
      ){
        skill.classList.add(
          "banned"
        );
      }

      skill.addEventListener(
        "click",
        () => {

          skill.classList.toggle(
            "banned"
          );

          saveBans();
        }
      );

    });

  updateBanCount();
}

searchInput.addEventListener(
  "input",
  () => {

    const value =
    searchInput.value.toLowerCase();

    document
      .querySelectorAll(".agent-card")
      .forEach(card => {

        const name =
        card
        .querySelector(".agent-name")
        .textContent
        .toLowerCase();

        card.style.display =
        name.includes(value)
        ? "block"
        : "none";

      });

  }
);

resetBtn.addEventListener(
  "click",
  () => {

    document
      .querySelectorAll(".skill")
      .forEach(skill => {

        skill.classList.remove(
          "banned"
        );

      });

    localStorage.removeItem(
      STORAGE_KEY
    );

    updateBanCount();
  }
);

loadAgents();
