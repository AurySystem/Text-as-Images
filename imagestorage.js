var curfilename = "none.png";
var curtxtfilename = "none.txt";
var curfile;
var img = new Image();

function downloadFile(filename, data, text = false) {
    let element = document.createElement('a');
    element.setAttribute('href', text ? 'data:text/plain;charset=utf-8,' + encodeURIComponent(data) : URL.createObjectURL(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function prepDownloadButton() {
    let element = document.createElement('button');
    element.id = "DL";
    element.classList.add("aa");
    element.value = "Download Image";
    element.innerText = "Download Image"
    element.onclick = function (e) {
        let canvas = document.getElementById("canvas");
            canvas.toBlob(function (blob) {
                downloadFile(curfilename, blob);
            });
    };
    let element2 = document.createElement('button');
    element2.id = "DLtxt";
    element2.classList.add("aa");
    element2.value = "Download Text";
    element2.innerText = "Download Text"
    element2.onclick = function (e) {
        let text = document.getElementById("astext");
        downloadFile(curfilename, text.value, true);
    };
    document.getElementById("tempDL").appendChild(element);
    document.getElementById("temptxtDL").appendChild(element2);
}

function loadimage(e) {

    let files = e.target.files;
    let file = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        let urll = reader.result;
        if (urll != undefined) {
            curfile = urll;
            loaddata(file.name);
        }
    }
}

function loaddata(filename){
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    let oldSrc = img.src;
    img.src = curfile;
    img.onload = function() {
        if(img.width == 0 || img.height == 0){
            img.src = oldSrc;
            return;
        }
        curfilename = filename;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        let width = document.getElementById("width");
        let height = document.getElementById("height");
        width.value = img.width;
        height.value = img.height;
        filltextbox(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
    };
}

function filltextbox(data){
    let textbox = document.getElementById("astext");
    textbox.value = imageToUnicode(data);
}

function imageToUnicode(data){
    let strim = "";
    let pixs = data;
    let part;
    for(let i = 0; i < pixs.length; i += 4){
        if(part == undefined || part == null){
            strim += String.fromCharCode(parseInt(pixs[i].toString(16).padStart(2,"0")+pixs[i+1].toString(16).padStart(2,"0"),16));
            part = pixs[i+2].toString(16);
        }else{
            strim += String.fromCharCode(parseInt(part+pixs[i].toString(16),16));
            strim += String.fromCharCode(parseInt(pixs[i+1].toString(16).padStart(2,"0")+pixs[i+2].toString(16).padStart(2,"0"),16));
            part = null;
        }
    }
    return strim
}

function loadtext(e) {

    let files = e.target.files;
    let file = files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
        let text = reader.result;
        if (text != undefined) {
            let textbox = document.getElementById("astext");
            textbox.value = text;
            updateimage(e);
        }
    }
}

function updateimage(e){
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    let width = document.getElementById("width");
    let height = document.getElementById("height");
    
    let data = imagedatafromtext();
    canvas.width = width.value;
    canvas.height = height.value;
    ctx.putImageData(data, 0, 0);
    
    let dlbutton = document.getElementById("DL");
    if (dlbutton != undefined) {
        dlbutton.remove();
    }
    dlbutton = document.getElementById("DLtxt");
    if (dlbutton != undefined) {
        dlbutton.remove();
    }
    prepDownloadButton();
}

function imagedatafromtext(){
    let textbox = document.getElementById("astext");
    let width = document.getElementById("width");
    let height = document.getElementById("height");
    let expand = document.getElementById("expanddir");
    
    while(textbox.value.length > (width.value * height.value * 1.5)){
        if(expand.checked){
            width.value++;
        }else{
            height.value++;
        }
    }
    
    let text = textbox.value+"";
    while(text.length < (width.value * height.value * 1.5)){
        text += " ";
    }
    
    let size = width.value * height.value * 4;
    let rawdata = new Uint8ClampedArray(size);
    let id = 0;
    for(let i = 0; i < text.length; i++){
        let val = text.charCodeAt(i).toString(16).padStart(4,"0");
        for(let t = 0; t  < 2; t++){
            if (id % 4 == 3) rawdata[id++] = 255;
            rawdata[id++] = parseInt(val.substring(t*2,(t+1)*2), 16);
        }
    }
    while(id < size){
        let val = "a".charCodeAt().toString(16).padStart(4,"0");
        for(let t = 0; t  < 2; t++){
            if (id % 4 == 3) rawdata[id++] = 255;
            rawdata[id++] = parseInt(val.substring(t*2,(t+1)*2), 16);
        }
    }
    let temp = new ImageData(rawdata, width.value, height.value);
    return temp
}