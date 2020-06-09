/* ---------------------
  declarate variables
--------------------- */
var clipboard = new ClipboardJS(".btn");
let getfilezone = document.querySelector(".getfile");
let dropZone = document.getElementById("drop-area");
let info_data = document.querySelector(".info-data");
let uploader_div = document.querySelector(".uploader");
let tabsList = Array.from(
  document.querySelector(".tabs").querySelectorAll("[data-tab]")
);
let contentList = Array.from(
  document.querySelector(".content").querySelectorAll("[data-tab]")
);
let play = Array.from(document.querySelectorAll(".tabs, .header, .main"));
let container_div = document.querySelector(".container");
console.log(play);
let divtabs = document.querySelector(".tabs");
let xlsx_obj = [];
let arr_num = [];
let arr_copy = [];
let arr_rep = [];
let arr_table = [];
let arr_extFile = [".xlsx", ".xlsm", ".xlsb", ".ods", ".csv"];

let num = null;
let imp = null;
const checkBoxStatus = () => {
  return document.querySelector("input[type='checkbox']").checked;
};
fileStatus = false;

let input_filefake = document.querySelector('input[type="file"]');
let opt_button = document.querySelector(".option");
let send_button = document.querySelector("button.send");
console.log(send_button);

/* ---------------------
  declarate logic funtions
--------------------- */

/* ---------------------
     drag-and-drop
--------------------- */
function showDropZone() {
  dropZone.style.display = "flex";
}
function hideDropZone() {
  dropZone.style.display = "none";
}

function allowDrag(e) {
  if (true) {
    // Test that the item being dragged is a valid one
    e.dataTransfer.dropEffect = "copy";
    e.preventDefault();
  }
}

function handleDrop(e) {
  e.preventDefault();
  hideDropZone();

  var src = e.dataTransfer.files[0];
  _getFileStatus(src);

  if (fileStatus) {
    getData(showData_info(src));
  } else {
    _FileStatusFaile();
  }
}

// 1
window.addEventListener("dragenter", function(e) {
  showDropZone();
});

// 2
dropZone.addEventListener("dragenter", allowDrag);
dropZone.addEventListener("dragover", allowDrag);

// 3
dropZone.addEventListener("dragleave", function(e) {
  hideDropZone();
});

// 4
dropZone.addEventListener("drop", handleDrop);

/* ---------------------
     fileReader
--------------------- */

input_filefake.addEventListener(
  "change",
  e => {
    var src = e.target.files[0];
    _getFileStatus(src);

    if (fileStatus) {
      getData(showData_info(src));
    } else {
      _FileStatusFaile();
    }
  },
  false
);

/* ---------------------
     get actions
--------------------- */

const _getFileStatus = source => {
  if (source) {
    var file = source;
    var name = file.name;
    var ext_file = name.substring(name.lastIndexOf(".")).toLowerCase();
    console.log(ext_file);
    console.log(arr_extFile[0]);

    for (ext of arr_extFile) {
      if (ext_file == ext) {
        fileStatus = true;
        break;
      }
    }
  }
};

const _FileStatusFaile = () => {
  //document.querySelector(".info-data").querySelector("p").textContent = ``;
  document
    .querySelector(".info-data")
    .querySelector("h3").textContent = `¡ERROR!`;

  document
    .querySelector(".info-data")
    .querySelector(
      "p"
    ).innerHTML = `<span>el formato de archivo no es</span> ${arr_extFile.join(
    ", "
  )}`;
  getfilezone.style.display = "none";
  info_data.style.display = "flex";
  setTimeout(() => {
    info_data.style.display = "none";
    getfilezone.style.display = "flex";
  }, 2500);
};

const showData_info = inputParent => {
  var file = inputParent;
  var name = file.name;
  var size = file.size;
  document
    .querySelector(".info-data")
    .querySelector("h3").textContent = `1 archivo cargado con éxito`;

  document
    .querySelector(".info-data")
    .querySelector(
      "p"
    ).innerHTML = `NOMBRE: <span>${name}</span> TAMAÑO: <span>${Math.round(
    size / 1000
  )} KB</span>`;

  var getBlodUrl = window.URL.createObjectURL(file);
  getfilezone.style.display = "none";
  info_data.style.display = "flex";
  return getBlodUrl;
};

const getActTab = () => {
  return document.querySelector(".active");
};

const getActContent = elem => {
  return document
    .querySelector(`.${elem}`)
    .querySelector(`[data-tab='${getActTab().getAttribute("data-tab")}']`);
};

/* ---------------------
     click events
--------------------- */

opt_button.onclick = () => {
  let options_div = document.querySelector(".options");

  if (options_div.offsetHeight === 0) {
    options_div.style.height = "100%";
  } else {
    options_div.style.height = "0px";
  }
};

getfilezone.onclick = e => {
  input_filefake.click();
};

divtabs.onmousedown = e => {
  if (e.target.classList.contains("active")) {
    console.log("no hacer nada");
  } else {
    getActTab().classList.remove("active");
    e.target.classList.add("active");

    for (content of contentList) {
      content.style.display = "none";
    }

    getActContent("header").style.display = "block";
    getActContent("main").style.display = "block";
  }
};

/* ---------------------
  xlsx.js fetch 
--------------------- */

const getData = url => {
  fetch(url)
    .then(function(res) {
      /* get the data as a Blob */
      if (!res.ok) throw new Error("fetch failed");
      return res.arrayBuffer();
    })
    .then(function(ab) {
      /* parse the data when it is received */
      var data = new Uint8Array(ab);
      var workbook = XLSX.read(data, { type: "array" });

      /* Get worksheet */

      var ws_parseJSON = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { raw: true }
      );
      var xlsx_data = new Array(ws_parseJSON);
      xlsx_obj = xlsx_data[0];
      console.log(xlsx_obj);
      send_button.classList.add("buttonsendact");

      send_button.onclick = () => {
        uploader_div.style.display = "none";
        for (elem of play) {
          elem.style.display = "flex";
        }
        //container_div.style.background = "#2f2f2f";
        createData();
        setTimeout(function() {
          showData();
        }, 1000);
      };
    });
};
//getData();

/* ---------------------
  otro
--------------------- */

const createData = () => {
  for (val of xlsx_obj) {
    num = String(val.numero);
    imp = val.impresiones;

    if (num.length < 4) {
      let format = 4 - num.length;
      let cero = "0";
      num = `${cero.repeat([format])}${num}`;
    }

    if (imp < 1 || typeof imp === typeof undefined) {
      checkBoxStatus() ? (imp = 0) : (imp = 1);
    }

    if (imp >= 1) {
      for (i = 0; i < imp; i++) {
        arr_rep.push(num);
        imglink();
      }
    }

    arr_num.push(num);
    arr_copy.push(imp);
  }
};

setTimeout(function() {}, 500);

//console.log(xlsx_obj[0].numero);

const showData = () => {
  codigos.innerHTML = `${arr_num.join("<br>")}`;
  impresiones.innerHTML = `${arr_copy.join("<br>")}`;
  repeticiones.innerHTML = `${arr_rep.join("<br>")}`;
};

/* if (imp < 1 || typeof imp === typeof undefined) {
      //si es 0 o vacio
    } else if (imp == 1) {
      //si es 1
    } else if (imp > 1) {
      // si es mayor a 1
      for (i = 1; i <= imp; i++) {
        if (i == 1) {
          //repeti
        } else {
          //cantidad de veces que indica imp
        }
      }
    } */

/* const numRep = (textContent1, textContent2, textContent3) => {
  const item = document.createElement("li");
  item.textContent = `${textContent1}`;
  item.setAttribute("id", `${num}`);
  codigos.appendChild(item);

  const item2 = document.createElement("li");
  item2.textContent = `${textContent2}`;
  impresiones.appendChild(item2);

  const item3 = document.createElement("li");
  item3.textContent = `${textContent3}`;
  repeticiones.appendChild(item3);
}; */

/* const numRep2 = (textContent2, textContent3) => {
  const item = document.createElement("li");
  item.textContent = `${textContent1}`;
  item.classList.add("counter");
  codigos.appendChild(item);

  const item2 = document.createElement("li");
  item2.textContent = `${textContent2}`;
  //item2.classList.add("counter");
  impresiones.appendChild(item2);

  const item3 = document.createElement("li");
  item3.textContent = `${textContent3}`;
  repeticiones.appendChild(item3);
}; */

const imglink = () => {
  const titem = document.createElement("tr");
  titem.innerHTML = `
          <td t="s">${String(num)}</th>
          <td t="s">${num[0]}.png</td>
          <td t="s">${num[1]}.png</td>
          <td t="s">${num[2]}.png</td>
          <td t="s">${num[3]}.png</td>`;
  table.appendChild(titem);
  /* const trtag = document.createElement("tr");
  const tdtag1 = document.createElement("td");
  tdtag1.setAttribute("t", "s");
  tdtag1.textContent = `${String(num)}`;
  trtag.appendChild(tdtag1);
  const tdtag2 = document.createElement("td");
  tdtag2.setAttribute("t", "s");
  tdtag2.textContent = `${num[0]}.png`;
  trtag.appendChild(tdtag2);
  const tdtag3 = document.createElement("td");
  tdtag3.setAttribute("t", "s");
  tdtag3.textContent = `${num[1]}.png`;
  trtag.appendChild(tdtag3);
  const tdtag4 = document.createElement("td");
  tdtag4.setAttribute("t", "s");
  tdtag4.textContent = `${num[2]}.png`;
  trtag.appendChild(tdtag4);
  const tdtag5 = document.createElement("td");
  tdtag5.setAttribute("t", "s");
  tdtag5.textContent = `${num[3]}.png`;
  trtag.appendChild(tdtag5);
  table.appendChild(trtag); */
};

downloadtxt.onclick = () => {
  var wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(
    wb,
    `data-${xlsx_obj[0].numero}-${xlsx_obj[xlsx_obj.length - 1].numero}.txt`
  );
};
