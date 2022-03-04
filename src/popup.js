document.addEventListener("DOMContentLoaded", () => {
  document.body.style.width = "500px";

  const sort = document.getElementById("sort");

  const beatSize = document.getElementById("beat-size");
  const beatStatsRepo = document.getElementById("repo");
  const beatStatsType = document.getElementById("type");
  const beatStatsStatus = document.getElementById("status");

  const query = { active: true, currentWindow: true };

  sort.onclick = function () {
    sortTable(".repo");
    sortTable(".type");
    sortTable(".status");
  };

  chrome.tabs.query(query, (tabs) => {
    ret = getSummary(
      tabs[0],
      beatSize,
      beatStatsRepo,
      beatStatsType,
      beatStatsStatus
    );
    if (ret !== 0) {
      chrome.tabs.reload(tabs[0].id);
      ret = getSummary(
        tabs[0],
        beatSize,
        beatStatsRepo,
        beatStatsType,
        beatStatsStatus
      );
    }
  });
});

const getSummary = (
  tab,
  beatSize,
  beatStatsRepo,
  beatStatsType,
  beatStatsStatus
) => {
  chrome.tabs.executeScript(tab.id, { file: "src/inject.js" }, function (summary) {
    elements = summary[0];
    if (elements === null) {
      return -1;
    }

    beatSize.innerHTML = `Total beat size points: ${elements.sizeStats}`;
    beatStatsStatus.innerHTML = `<table class="status"><h4>Status Count</h4>` + formatResult(elements.statusStats) + `</table>`;
    beatStatsType.innerHTML = `<table class="type"><h4>Type Count</h4>` + formatResult(elements.typeStats) + `</table>`;
    beatStatsRepo.innerHTML = `<table class="repo"><h4>Repository Count</h4>` + formatResult(elements.repoStats) + `</table>`;
    return 0;
  });
};

const formatResult = (result) => {
  resultStr = "";
  var keys = Object.keys(result);
  var values = Object.values(result);
  keys.forEach((key, index) => {
    resultStr =
      resultStr + `<tr><td>` + key + `</td><td>` + values[index] + `</td></tr>`;
  });
  return resultStr;
};

const sortTable = (tableClass) => {
  var filterTable, rows, sorted, i, x, y, sortFlag;
  filterTable = document.querySelector(tableClass);
  sorted = true;
  while (sorted) {
    sorted = false;
    rows = filterTable.rows;
    for (i = 0; i < rows.length - 1; i++) {
      sortFlag = false;
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        sortFlag = true;
        break;
      }
    }
    if (sortFlag) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      sorted = true;
    }
  }
};