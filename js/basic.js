const kanjicontainer = document.querySelector('.kanji-group-wrap')
const filter_show = document.querySelector('.filter-show-item.picker')
const filter_sub_picks = document.querySelectorAll('.filter-sub-pick ul li')

const fetchData = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/basic`)
        const data = await response.json()
        return data.jsonArray
    } catch (error) {
        console.log(error)
    }
}

const renderCmt = async () => {
    try {
        const data = await fetchData()
        let kanjiHTMLArray = []
        let mean = []
        if (filter_show.innerText == 'All') {
            for (let i = 1; i <= 17; i++) {
                const strokeGroup = data.filter((cmt) => 
                    cmt['Stroke#'] === `${i}`
                    
                )

                if (strokeGroup.length > 0) {
                    const strokesInfo = i === 1 ? '1 stroke' : `${i} strokes`

                    const kanjiGroupHTML = `
                <div class = "kanji-stroke-group">
                  <div class="kanji-stroke">
                    <p>${strokesInfo}</p>
                  </div>
                  <div class="kanji-group">
                  ${strokeGroup
                      .map(
                          (radical) =>
                              // {// mean.push(...radical['Meaning'].split(','))}
                              `
                            <div>
                              <div class="kanji-group-box">
                                <p>${radical['Radical']}</p>
                              </div>
                              <div class="kanji-mean">
                                <p>${radical['Meaning'].split(',')[0]}</p>
                              </div>
                            </div>
                            
                            `
                      )
                      .join('')}
                    </div>
                </div>`

                    kanjiHTMLArray.push(kanjiGroupHTML)
                }
            }
        } else {
            const selectedStrokeValue = Number(
                filter_show.innerText.split(' ')[0]
            )
            const strokeGroup = data.filter(
                (cmt) => cmt['Stroke#'] == selectedStrokeValue
            )

            if (strokeGroup.length > 0) {
                const strokesInfo = `${selectedStrokeValue} stroke${
                    selectedStrokeValue > 1 ? 's' : ''
                }`

                const kanjiGroupHTML = `
                <div class = "kanji-stroke-group">
                  <div class="kanji-stroke">
                    <p>${strokesInfo}</p>
                  </div>
                  <div class="kanji-group">
                  ${strokeGroup
                      .map(
                          (radical) => `
                    <div>
                      <div class="kanji-group-box">
                        <p>${radical['Radical']}</p>
                      </div>
                      <div class="kanji-mean">
                        <p>${radical['Meaning'].split(',')[0]}</p>
                      </div>
                    </div>
                    
                    `
                      )
                      .join('')}
                    </div>
                </div>`

                kanjiHTMLArray.push(kanjiGroupHTML)
            }
        }
        kanjicontainer.innerHTML = kanjiHTMLArray.join('')
        console.log(kanjiHTMLArray)
    } catch (error) {
        console.log(error)
    }
}
renderCmt()
filter_sub_picks.forEach(function (option) {
    option.addEventListener('click', function () {
        filter_show.innerText = this.innerText
        renderCmt()
    })
})


