const findColumnIndex = (headers, key) => {
  for (let i = 0; i < headers.length; i++) {
    if (
      headers[i].firstElementChild &&
      headers[i].firstElementChild.firstChild &&
      headers[i].firstElementChild.firstChild.innerText == key
    ) {
      return i;
    }
  }
};

const findValues = (rows, columnIndex, isNum) => {
  var values = [];
  for (let i = 0; i < rows.length; i++) {
    if (
      rows[i].children[columnIndex] &&
      rows[i].children[columnIndex].firstElementChild &&
      rows[i].children[columnIndex].firstElementChild.firstChild
    ) {
      if (isNum) {
        var thing = parseFloat(
          rows[i].children[columnIndex].firstElementChild.firstChild.innerText
        );
        if (!isNaN(thing)) {
          values.push(thing);
        }
      } else {
        value =
          rows[i].children[columnIndex].firstElementChild.firstChild.innerText;
        repoName = value.split("/");
        values.push(repoName[1]);
      }
    }
  }
  return values;
};

const findBubbleValues = (rows, columnIndex) => {
  var values = [];
  for (let i = 0; i < rows.length; i++) {
    if (
      rows[i].children[columnIndex] &&
      rows[i].children[columnIndex].children[0] &&
      rows[i].children[columnIndex].children[0].children[0] &&
      rows[i].children[columnIndex].children[0].children[0].children[0] &&
      rows[i].children[columnIndex].children[0].children[0].children[0]
        .children[0] &&
      rows[i].children[columnIndex].children[0].children[0].children[0]
        .children[0].firstChild
    ) {
      value =
        rows[i].children[columnIndex].children[0].children[0].children[0]
          .children[0].firstChild.innerText;
      values.push(value);
    }
  }
  return values;
};

const countBy = (arr) => {
  var seen = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] in seen) {
      seen[arr[i]]++;
    } else {
      seen[arr[i]] = 1;
    }
  }
  return seen;
};

const makeSummary = () => {
  let summary = {};

  var columnheaders = document.querySelectorAll("[role=columnheader]");
  // get type index
  typeIndex = findColumnIndex(columnheaders, "Type");

  // get size index
  sizeIndex = findColumnIndex(columnheaders, "Size");

  // get repo index
  repoIndex = findColumnIndex(columnheaders, "Repository");

  // get status index
  statusIndex = findColumnIndex(columnheaders, "Status");

  var rows = document.querySelectorAll("[role=row]");

  sizeStats = findValues(rows, sizeIndex, true).reduce(
    (partialSum, elem) => partialSum + elem,
    0
  );
  typeStats = countBy(findBubbleValues(rows, typeIndex));
  statusStats = countBy(findBubbleValues(rows, statusIndex));
  repoStats = countBy(findValues(rows, repoIndex, false).filter(element => {
    return element !== undefined;
  }));

  //summary building
  summary["sizeStats"] = sizeStats;
  summary["typeStats"] = typeStats;
  summary["statusStats"] = statusStats;
  summary["repoStats"] = repoStats;

  return summary;
};
makeSummary();
