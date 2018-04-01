var width = window.innerWidth;
var height = window.innerHeight;

var intersection = [];

function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        image.width(width);
        image.height(height);
    }
}
function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#fff',
        fill: '#fff',
        opacity: 0,
        strokeWidth: 4,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function () {
        update(this);
        //console.log(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function () {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function () {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        this.stroke("#666");
        this.fill("#ddd");
        this.opacity(1);
        layer.draw();
    });
    anchor.on('mouseout', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        this.stroke("#fff");
        this.fill("#fff");
        this.opacity(0);
        layer.draw();
    });

    group.add(anchor);
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

var stage = new Konva.Stage({
    container: 'canvas',
    width: width,
    height: height
});

var layer = new Konva.Layer();
stage.add(layer);

var redLine = new Konva.Line({
    points: [],
    stroke: 'black',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
    opacity: 1
});

layer.add(redLine);

var circle = new Konva.Circle({
    x: 40,
    y: 40,
    radius: 40,
    id: 'garbageZone',
    fill: '#fff',
    opacity: 0
});

// add the shape to the layer
layer.add(circle);

var imageObj = new Image();
imageObj.onload = function () {

    var bin = new Konva.Image({
        x: 30,
        y: 30,
        image: imageObj,
        width: 20,
        height: 20
    });

    // add the shape to the layer
    layer.add(bin);

    // add the layer to the stage
    stage.add(layer);
};
imageObj.src = './assets/icons/recycling-bin.png';

stage.on('click', function (e) {
    // if click on empty area - remove all transformers
    if (e.target === stage) {
        stage.find('Transformer').destroy();
        layer.draw();
        return;
    }
    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('rect')) {
        return;
    }
    // remove old transformers
    // TODO: we can skip it if current rect is already selected
    stage.find('Transformer').destroy();

    // create new transformer
    var tr = new Konva.Transformer();
    layer.add(tr);
    tr.attachTo(e.target);
    layer.draw();
})

$("#wire").click(function () {
    var rect1 = new Konva.Rect({
        x: 180,
        y: 50,
        width: 100,
        height: 6,
        fill: 'black',
        name: 'rect',
        draggable: true
    });
    layer.add(rect1);
    layer.draw();
});

$("#resistor").click(function () {
    var resistorImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var resistorGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(resistorGroup);
    resistorGroup.add(resistorImg);
    addAnchor(resistorGroup, 0, 0, 'topLeft');
    addAnchor(resistorGroup, 100, 0, 'topRight');
    addAnchor(resistorGroup, 100, 100, 'bottomRight');
    addAnchor(resistorGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        resistorImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/032-resistor.png';
});

$("#cell").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/023-cell.png';
});

$("#battery").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/021-battery.png';
});

$("#lamp").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/019-lamp.png';
});

$("#diode").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/031-diode.png';
});

$("#switchC").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/024-switch-1.png';
});

$("#switchO").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/028-switch.png';
});

$("#capacitor").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/008-capacitor.png';
});

$("#inductor").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/012-inductor.png';
});

$("#voltmeter").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/014-voltmeter.png';
});

$("#ammeter").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/017-ammeter.png';
});

$("#galvanometer").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/020-galvanometer.png';
});

$("#ground").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/009-ground.png';
});

$("#transformer").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/027-transformer.png';
});

$("#rheostat").click(function () {
    var diodeImg = new Konva.Image({
        width: 100,
        height: 100
    });

    var diodeGroup = new Konva.Group({
        x: 180,
        y: 50,
        draggable: true
    });
    layer.add(diodeGroup);
    diodeGroup.add(diodeImg);
    addAnchor(diodeGroup, 0, 0, 'topLeft');
    addAnchor(diodeGroup, 100, 0, 'topRight');
    addAnchor(diodeGroup, 100, 100, 'bottomRight');
    addAnchor(diodeGroup, 0, 100, 'bottomLeft');

    var imageObj = new Image();
    imageObj.onload = function () {
        diodeImg.image(imageObj);
        layer.draw();
    };
    imageObj.src = './assets/elements/004-attenuator.png';
});

var nodeidx = 1;
$('#makeEditable1').SetEditable({ $addButton: $('#but_add1') });
$('#makeEditable2').SetEditable({ $addButton: $('#but_add2') });

$("#node").click(function () {
    var groupnode = new Konva.Group({
        x: 100,
        y: 50,
        draggable: true,
    });

    var circle = new Konva.Circle({
        x: 106,
        y: 61,
        radius: 12,
        fill: 'black',
        name: 'node',
    });

    var simpleText = new Konva.Text({
        x: 100,
        y: 50,
        text: nodeidx,
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'white',
    });
    nodeidx++;
    // add the shape to the layer
    groupnode.add(circle);
    groupnode.add(simpleText)
    layer.add(groupnode);
    layer.draw();
});

$("#solve").click(
    function () {
        $('#solList').html('') 
        var tRows = [];
        tab = document.getElementById('makeEditable1');

        for (var r = 0; r < tab.rows.length; r++) {
            var tRow = [];// start new row array
            for (var c = 0; c < tab.rows[r].cells.length; c++) {
                tRow[c] = tab.rows[r].cells[c].innerHTML;
            }
            tRows.push(tRow);
        }

        var NetList = new Array();
        
        console.log(tRows);
        
        for (var q = 1; q < tRows.length; q++){
            var arr =  new Array();
            arr.push(Number(tRows[q][0]))
            arr.push(Number(tRows[q][1]))
            arr.push(Number(tRows[q][2]))
            
            NetList.push(arr)
            console.log(NetList);
            
        }

        // console.log(tRows.length);

        var t2Rows = [];
        tab2 = document.getElementById('makeEditable2');

        for (var g = 0; g < tab2.rows.length; g++) {
            var t2Row = [];// start new row array
            for (var c = 0; c < tab2.rows[g].cells.length; c++) {
                t2Row[c] = tab2.rows[g].cells[c].innerHTML;
            }
            t2Rows.push(t2Row);
        }

        var Vnod = new Array();

        console.log(t2Rows);

        for (var q = 1; q < t2Rows.length; q++) {
            var arr = new Array();
            arr.push(Number(t2Rows[q][0]))
            arr.push(Number(t2Rows[q][1]))

            Vnod.push(arr)
            console.log(Vnod);

        }

        var l = NetList.length;
        var m = Vnod.length;

        var A = new Array();

        for (var i = 0; i < l; i++) {
            A.push(new Array(l).fill(0));
        }


        var B = new Array();

        for (var j = 0; j < l; j++) {
            B.push(new Array(1).fill(0));
        }


        for (var i = 0; i < l; i++) {
            var n1 = NetList[i][0] - 1;
            var n2 = NetList[i][1] - 1;

            if (n1 == n2) {
                // do nothing
            } else {
                A[n1][n2] = A[n1][n2] - 1 / NetList[i][2];
                A[n2][n1] = A[n2][n1] - 1 / NetList[i][2];
                A[n1][n1] = A[n1][n1] + 1 / NetList[i][2];
                A[n2][n2] = A[n2][n2] + 1 / NetList[i][2];
            }
        }

        for (var j = 0; j < m; j++) {
            A[Vnod[j][0] - 1] = new Array(l).fill(0);
            A[Vnod[j][0] - 1][Vnod[j][0] - 1] = 1;
            if (typeof(Vnod[j][1])){
                B[Vnod[j][0] - 1] = new Array(1).fill(Vnod[j][1]);
            }else{
                B[Vnod[j][0] - 1] = Vnod[j][1];
            }
        }

        var a = math.matrix(A);
        var b = math.matrix(B);
        var C = math.matrix();
        C = math.multiply(math.inv(a), b);
        var mat = []

        C.forEach(function (value, index, matrix) {
            var idx = index[0] + 1;
            $('#solList').append('<li class="alert alert-success"> Voltage at node ' + idx + " = <b>" + value + ' V</b></li>')
            mat.push(value);
        });

        $('#solList').append('<br><br>')

        C.forEach(function (value, index, matrix) {
            var idx = index[0] + 1;
            console.log(mat);
            $('#solList').append('<li class="alert alert-warning"> Current between node ' + NetList[idx - 1][0] + " and " + NetList[idx - 1][1] + " = <b>" + (mat[idx - 1] - mat[idx])/NetList[idx - 1][2] + ' A</b></li>')
        });
        
        jQuery.noConflict();
        $('#exampleModalLong').modal('show')
    }
);

$('.profile').click(
    function (params) {
        jQuery.noConflict();
        $('#profilemodal').modal('show')
    }
);


document.getElementById('download').addEventListener('click', function () {
    var dataURL = stage.toDataURL();
    downloadURI(dataURL, 'quick_circuit.png');
}, false);

$("#text").click(function () {
    var textNode = new Konva.Text({
        text: 'Double click to edit',
        x: 180,
        y: 50,
        fontSize: 20,
        draggable: true
    });

    layer.add(textNode);
    layer.draw();

    textNode.on('dblclick', () => {
        // create textarea over canvas with absolute position

        // first we need to find its positon
        var textPosition = textNode.getAbsolutePosition();
        var stageBox = stage.getContainer().getBoundingClientRect();

        var areaPosition = {
            x: textPosition.x + stageBox.left,
            y: textPosition.y + stageBox.top
        };


        // create textarea and style it
        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = textNode.width();

        textarea.focus();


        textarea.addEventListener('keydown', function (e) {
            // hide on enter
            if (e.keyCode === 13) {
                textNode.text(textarea.value);
                layer.draw();
                document.body.removeChild(textarea);
            }
        });
    })
});

layer.on('dragmove', function (e) {
    var target = e.target;
    var parent = target.parent;
  
    var targetRect = e.target.getClientRect();
   
    layer.children.each(function (group) {
        // do not check intersection with itself
        if (group === target) {
            return;
        }
        if (haveIntersection(group.getClientRect(), targetRect)) {
            if (targetRect.x < 0 || targetRect.y < 0){
                layer.find('#garbageZone').fill('#e84855');
                layer.find('#garbageZone').opacity('1');
                target.destroy();
                layer.find('#garbageZone').fill('white');
                layer.find('#garbageZone').opacity('0');
            }
        } else {
            layer.find('#garbageZone').fill('white');
            layer.find('#garbageZone').opacity('0');
        }
        // do not need to call layer.draw() here
        // because it will be called by dragmove action
    });
})

function haveIntersection(r1, r2) {
    return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
    );
}

let marker = false;

$('#marker, #eraser').click(function () {
    if(this.id == 'eraser'){
        redLine.stroke('white');
        redLine.opacity('0');
    }else{
        redLine.stroke('bback');
        redLine.opacity('1');
    }

    if (marker == false) {
        marker = true;
        document.body.style.cursor = 'pointer';
    } else {
        marker = false;
        document.body.style.cursor = 'auto';
    }
    var draw = false;
    var currentMousePos = { x: -1, y: -1 };
    $(document).mousedown(function () {
        draw = true;
    });
    $(document).mouseup(function () {
        draw = false;
    });
    $(document).mousemove(function (event) {
        if (draw == true && marker == true) {
            currentMousePos.x = event.pageX;
            currentMousePos.y = event.pageY;
            // console.log(typeof(redLine.points));
            if (redLine.points.length == 0) {
                redLine.points().push(currentMousePos.x - 250);
                redLine.points().push(currentMousePos.y - 50);
            } else {
                redLine.points().push(0);
                redLine.points().push(0);
            }
            layer.draw();
        }
    });

});

function refresh() {  
    location.reload();
}

$('#save').click(
    function () {  
        jQuery.noConflict();
        $('#exampleModal').modal('show')
    }
);

function savechanges() {  
    var name = $('#namefield').val();
    var json = stage.toJSON();
    console.log("json : " + json);
    

    jQuery.ajax({
        url: '/frame?add=' + json,
        success: function (data) {
            console.log("Data : " + data);
            alert('Circuit saved successfully!')
            $list.append(`<li class="alert alert-primary"> <button class="listbutton"> <i class="fas fa-external-link-alt"></i> Open</button> &nbsp;&nbsp; ${name} </li>`)
            $('#exampleModal').modal('hide')
        },
        error: function () {
            alert('Error in saving data');
        }
    })

    jQuery.ajax({
        url: '/name?add=' + name,
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert('Error in saving data');
        }
    })
}

var $list = $('#list');
$.ajax({
    type: 'GET',
    url: '/getframe',
    success: function (data) {
        $.each(data, function (i, item) {
            if(item[0] != '{'){
                $list.append(`<li class="alert alert-primary"> <button class="listbutton"> <i class="fas fa-external-link-alt"></i> Open</button> &nbsp;&nbsp; ${item} </li>`)
            }
        })
    },
    error: function () {
        alert('Error in fetching data');
    }
})

$(document).on("click", "button.listbutton", function () {
    var idx = $(this).closest("li").index()
    var value;
    $.ajax({
        type: 'GET',
        url: '/getframe',
        success: function (data) {
            $.each(data, function (i, item) {
                // console.log("->" + i);
                // console.log("<- " + idx);
                // console.log(item);
                
                if (i == idx - 1) {
                    value = item;
                    stage.destroy();
                    // stage = Konva.Node.create(item, 'canvas');
                    var json = { "attrs": { "width": 1536, "height": 750 }, "className": "Stage", "children": [{ "attrs": {}, "className": "Layer", "children": [{ "attrs": { "points": [], "stroke": "black", "strokeWidth": 5, "lineCap": "round", "lineJoin": "round" }, "className": "Line" }, { "attrs": { "x": 40, "y": 40, "radius": 40, "id": "garbageZone", "fill": "white", "opacity": "0" }, "className": "Circle" }, { "attrs": { "x": 30, "y": 30, "width": 20, "height": 20 }, "className": "Image" }, { "attrs": { "x": 413, "y": 142, "draggable": true }, "className": "Group", "children": [{ "attrs": { "width": 100, "height": 100 }, "className": "Image" }, { "attrs": { "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "topLeft", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "x": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "topRight", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "x": 100, "y": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "bottomRight", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "y": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "bottomLeft", "draggable": true, "dragOnTop": false }, "className": "Circle" }] }, { "attrs": { "x": 512, "y": 140, "draggable": true }, "className": "Group", "children": [{ "attrs": { "width": 100, "height": 100 }, "className": "Image" }, { "attrs": { "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "topLeft", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "x": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "topRight", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "x": 100, "y": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "bottomRight", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "y": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "bottomLeft", "draggable": true, "dragOnTop": false }, "className": "Circle" }] }, { "attrs": { "x": 314, "y": 139, "draggable": true }, "className": "Group", "children": [{ "attrs": { "width": 100, "height": 100 }, "className": "Image" }, { "attrs": { "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "topLeft", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "x": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "topRight", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "x": 100, "y": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "bottomRight", "draggable": true, "dragOnTop": false }, "className": "Circle" }, { "attrs": { "y": 100, "stroke": "#fff", "fill": "#fff", "opacity": 0, "strokeWidth": 4, "radius": 8, "name": "bottomLeft", "draggable": true, "dragOnTop": false }, "className": "Circle" }] }] }] }
                    stage = Konva.Node.create(json, 'canvas');
                }
            })
        },
        error: function () {
            alert('Error in fetching data');
        }
    })
})