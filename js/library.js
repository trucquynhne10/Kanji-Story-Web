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

function calculateDateDifference(inputDate) {
    const inputDateObject = new Date(inputDate)
    const today = new Date()

    const differenceInMilliseconds = today - inputDateObject
    const differenceInDays = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
    )

    return differenceInDays
}

let oldestDays = 9999
const daysContainer = document.querySelector('.filter-show-item.picker')
const daysOptions = document.querySelectorAll('.filter-sub-pick li')

daysOptions.forEach((option) => {
    option.addEventListener('click', function () {
        daysContainer.innerText = this.innerText
        oldestDays = Number(this.dataset.date)
        renderKanji()
    })
})

let kanjiGroupedByDate = {}
let kanjiDates = []

const fetchAndFormatKanjiData = async () => {
    try {
        let data = await fetchData()
        kanjiGroupedByDate = data.reduce((acc, curr) => {
            const date = curr.date?.split('T')[0]
            if (acc[date]) {
                acc[date].push(curr)
            } else {
                acc[date] = [curr]
            }
            return acc
        }, {})

        kanjiDates = [...Object.keys(kanjiGroupedByDate)]
        console.log(kanjiGroupedByDate)
    } catch (error) {
        console.log(error)
    }
}

const dayTitle = document.querySelector('.kanji-stroke')
const kanjicontainer = document.querySelector('.kanji-group-wrap')
const renderKanji = () => {
    let accumulatedHTML = ''

    kanjiDates.forEach((date) => {
        if (calculateDateDifference(date) <= oldestDays) {
            let item = kanjiGroupedByDate[date]
            console.log(item.length)

            const kanjiGroupHTML = `
                <div class="kanji-stroke-group">
                    <div class="kanji-stroke">
                        <p>${date}</p>
                       
                    </div>
                    <div class="kanji-group">
                        ${item
                            .map((kanjiItem) => {
                                return `
                                <div class="kanji-each-contain">
                                    <div class="kanji-group-box">
                                        <div class="kanji-box">
                                            <p>${kanjiItem.kanji.character}</p>
                                        </div>
                                        <div class="kanji-mean">
                                            <p><span class="small-title"><b>Meaning:</b></span><br>${
                                                kanjiItem.kanji.meaning.english.split(
                                                    ','
                                                )[0]
                                            }</p>
                                            <p><span class="small-title"><b>Story tag:</b></span><br>${
                                                kanjiItem.storyType
                                            }</p>
                                        </div>
                                        <div class="icon">
                                           
                                            <button onClick="deleteStoredKanji('${kanjiItem._id}')"><i class="fa-regular fa-trash-can"></i></button>
                                        </div>
                                    </div>
                                </div>
                            `
                            })
                            .join('')}
                    </div>
                </div>
            `
            accumulatedHTML += kanjiGroupHTML
        }
    })

    // Append the accumulated HTML to the container
    kanjicontainer.innerHTML = accumulatedHTML

}

fetchAndFormatKanjiData().then(() => renderKanji())

const fetchLongStory = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/store/longKanjiStory`
        )
        const data = await response.json()
        console.log(data)
        // return data.singleKanjis
    } catch (error) {
        console.log(error)
    }
}