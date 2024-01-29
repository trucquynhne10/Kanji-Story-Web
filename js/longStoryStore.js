const fetchData = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/store/singleKanji`
        )
        const data = await response.json()
        return data.singleKanjis
    } catch (error) {
        console.log(error)
    }
}

const deleteStoredKanji = async (id) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/store/singleKanji/${id}`,
            { method: 'DELETE' }
        )
        await fetchAndFormatKanjiData()
        renderKanji()
    } catch (error) {
        console.error(error)
    }
}

const fetchLongStory = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/store/longKanjiStory`
        )
        const data = await response.json()
        console.log(data)
        return data.multipleKanjiStory
    } catch (error) {
        console.log(error)
    }
}

const dayTitle = document.querySelector('.kanji-stroke')
const kanjicontainer = document.querySelector('.story-group')
const renderKanji = async () => {
    let accumulatedHTML = ''
    let data = await fetchLongStory()
    console.log(data)
    data.map((story) => {
        const kanjiGroupHTML = `
        
        <div class="story-group-box">
            <div class="story-info">
                <div class="storyTitle">
                    <p>
                        <span class="small-title"
                            ><b>Keys:</b></span
                        >
                        ${story.kanji}
                    </p>
                    <p>
                        <span class="small-title"
                            ><b>Story tag:</b></span
                        > ${story.storyType}
                    </p>
                </div>
                <div class="icon">
                    <i class="fa-regular fa-trash-can"></i>
                </div>
            </div>
            <div class="story-box">
              <p>${story.story}</p>
            </div>
            <div class="continue">
                ...continue
            </div>
        </div>
    
        `

        accumulatedHTML += kanjiGroupHTML
    }).join('')

    // Append the accumulated HTML to the container
    kanjicontainer.innerHTML = accumulatedHTML
}
renderKanji()
