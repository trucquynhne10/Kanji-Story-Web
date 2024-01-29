const tagItems = document.querySelectorAll(".tag");
let output = document.querySelector("#output-kanji-ne");
let btn = document.querySelector("#create");
let output_frame = document.querySelector(".output");
let storyType = "Normal";
let saveBtn;
let regenerateBtn;

tagItems.forEach((item) => {
  item.addEventListener("click", function () {
    document.querySelector(".tag.active")?.classList.remove("active");
    this.classList.add("active");
    storyType = this.innerText;
  });
});

const kanjicontainer = document.querySelector(".output-container");
const Kanji = document.querySelector("#kanji");
// Thêm class vào body
const fetchData = async (Kanji, storyType) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/singleKanji/${Kanji}/${storyType}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const rendercmt = (value) => {
  let kanjiHTMLarray = "";
  value.forEach((cmt) => {
    const kanjiHtmlItem = `
                    <div class="output">
                    <div class="output-kanji">
                        <div class="output-kanji-up">
                            <div class="output-kanji-up-left">
                                <p id="output-kanji-ne" class="output-kanji-up-left-text">${cmt.kanji.character}</p>
                            </div>
                            <div class="output-kanji-up-right">
                                <div class="output-kanji-up-right-title">
                                    <h3>Meaning:</h3>
                                    <h3>Kunyomi:</h3>
                                    <h3>Onyomi:</h3>
                                    <h3>Strokes:</h3>
                                    <h3>Radical:</h3>
                                </div>
                                <div class="output-kanji-up-right-mean">
                                    <p id="mean"> ${cmt.kanji.meaning.english}</p>
                                    <p id="kun"> ${cmt.kanji.kunyomi.hiragana}</p>
                                    <p id="on"> ${cmt.kanji.onyomi.katakana}</p>
                                    <p id="strokes"> ${cmt.kanji.strokes.count}</p>
                                    <p id="radical">${cmt.radical.character} <span id='radical-en'>(${cmt.radical.meaning.english})</span></p>
                                    <p id="storytype">${cmt.storyType}</p>
                                </div>
                            </div>
                        </div>
                        <div class="output-kanji-down">
                                <p id="story">${cmt.story}</p>
                        </div>
                    </div>
                    <div class="save-reload">
                        <i class="fa-regular fa-bookmark"></i>
                        <i class="fa-solid fa-arrows-rotate"></i>
                    </div>
                </div>
                    `;
    kanjiHTMLarray += `${kanjiHtmlItem} \n`;
  });
  kanjicontainer.innerHTML = kanjiHTMLarray;
};

btn.addEventListener("click", async function () {
  const load = document.querySelector(".loader");
  const noti = document.querySelector(".noti");
  const output = document.querySelector(".output");
  load.style.display = "flex";
  try {
    const data = await fetchData(Kanji.value, storyType);
    let value = data.kanjiInfo.filter((x) => x != null);
    if (value.length > 0) {
      rendercmt(value);
      load.style.display = "none";
    } else {
      console.log("please input again");
      noti.style.display = "flex";
      output.style.display = "none";
    }

    // Add save btn event
    saveBtn = document.querySelectorAll(".fa-bookmark");
    saveBtn.forEach((save) => {
      save.addEventListener("click", (e) => {
        let objectDate = new Date();
        let day = objectDate.getDate();
        let month = objectDate.getMonth() + 1;
        let year = objectDate.getFullYear();
        let date = month + "/" + day + "/" + year;
        const parentHasClass = save.closest(".output");
        console.log(parentHasClass);
        let result = {};
        const kanjiChar =
          parentHasClass.querySelector("#output-kanji-ne").innerText;
        const kanjiMeaning = parentHasClass.querySelector("#mean").innerText;
        const kanjiKun = parentHasClass.querySelector("#kun").innerText;
        const kanjiOn = parentHasClass.querySelector("#on").innerText;
        const kanjiStrokes = parentHasClass.querySelector("#strokes").innerText;
        const kanjiRadical = parentHasClass.querySelector("#radical").innerText;
        const kanjiRadicalen =
          parentHasClass.querySelector("#radical-en").innerText;
        const story = parentHasClass.querySelector("#story").innerText;
        const storytype = parentHasClass.querySelector("#storytype").innerText;
        result = {
          date,
          kanji: {
            character: kanjiChar,
            meaning: { english: kanjiMeaning },
            kunyomi: { hiragana: kanjiKun },
            onyomi: { katakana: kanjiOn },
            strokes: kanjiStrokes,
          },
          radical: { radical: kanjiRadical, meaning_english: kanjiRadicalen },
          story: story,
          storyType: storytype,
        };
        console.log(result);
        postKanjiToDB(result);
      });
    });

    // Add regenerate button
    regenerateBtn = document.querySelectorAll(".fa-arrows-rotate");
    regenerateBtn.forEach((regenerate) => {
      regenerate.addEventListener("click", async (e) => {
        try {
          const parentHasClass = regenerate.closest(".output");
          const Kanjichar =
            parentHasClass.querySelector("#output-kanji-ne").innerText;
          const kanjistory = parentHasClass.querySelector("#story");
          const data = await fetchData(Kanjichar, storyType);
          let value = data.kanjiInfo;
          // console.log(data);
          kanjistory.innerText = value[0].story;
        } catch (error) {
          console.log(error);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
});

const postKanjiToDB = async (data) => {
  const rawResponse = await fetch("http://localhost:3000/api/v1/singleKanji", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
  });
  const content = await rawResponse.json();

  console.log(content);
};

const regenerateStory = async (data) => {
  const rawResponse = await fetch(
    "http://localhost:3000/api/v1/singleKanji/regenerateStory",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    }
  );
  const content = await rawResponse.json();

  console.log(content);
};
