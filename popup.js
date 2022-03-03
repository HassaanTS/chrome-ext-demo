document.addEventListener('DOMContentLoaded', () => {
    document.body.style.width = '400px';

    const beatSize = document.getElementById('beat-size');
    const beatStats = document.getElementById('beat-stats');
    const query = { active: true, currentWindow: true };

    chrome.tabs.query(query, (tabs) => {
        getSummary(tabs[0], beatSize, beatStats)
    });
});

const getSummary = (tab, beatSize, beatStats) => {
    chrome.tabs.executeScript(tab.id, {file: "inject.js"}, function(summary){
        elements = summary[0]
        console.log(elements)
        beatSize.innerHTML = `Total beat size points: ${elements.sizeStats}`
        initStr = ""
        var k = Object.keys(elements.statusStats);
        var v = Object.values(elements.statusStats);
        k.forEach((key, index) => {
            initStr = initStr + `<tr><th>`+ key + `</th><th>` + v[index] + `</th></tr>`
        });
        beatStats.innerHTML = `<table>` + initStr + `</table>`

    });
}
{/* <tr>${JSON.stringify(elements.typeStats, null, 4)}</tr> */}
{/* <tr>${JSON.stringify(elements.repoStats)}</tr> */}