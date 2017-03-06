"use strict";

var wrapper = document.getElementById("wrapper"),
  dragImage = null, //какая картинка сейчас перетаскивается
  dragShiftX,
  dragShiftY,
// определяем константу - blockWidth и blockHeight - и её используем, не читая style.width и style.height
  blockWidth = 1000,
  blockHeight = 600;

//запоминаем коорд DIV(обвёртки)
var leftSideWrap = wrapper.offsetLeft, //коорд левой стороны DIV(обвёрка)
    rightSideWrap = wrapper.offsetLeft + blockWidth, //коорд правой стороны DIV(обвёрка)
    upperSideWrap = wrapper.offsetTop, //коорд верхней стороны DIV(обвёрка)
    bottomSideWrap = wrapper.offsetTop + blockHeight; //коорд верхней стороны DIV(обвёрка)

var childWrapp = wrapper.getElementsByTagName('img');

  for (var i = 0; i < childWrapp.length; i++) {
    AddEventHandler(childWrapp[i], "mousedown", dragStart, false);
    AddEventHandler(childWrapp[i], "mouseover", mouseOver, false);
    AddEventHandler(childWrapp[i], "mouseout", mouseOut, false);
  }

function mouseOver(EO) {
  EO = EO || window.event;
  PreventDefault(EO);
  EO.target.style.border = "1px dashed red"; // если курсор будет над картинкой, то картинку будем выделять красным пунктиром
}

function mouseOut(EO) {
  EO = EO || window.event;
  PreventDefault(EO);
  EO.target.style.border = "none"; // если курсор будет НЕ над картинкой, то красный пунктир убираем
}

function dragStart (EO) {
  EO = EO || window.event;
  PreventDefault(EO);

  dragImage = EO.target;

  wrapper.appendChild(dragImage); // Картинка, перетаскивание которой началось, должна оказываться выше (ближе к глазам), чем остальные. 
  dragImage.style.border = "1px solid red"; // картинку которую будем перетаскивать, выделяем красной рамкой
  dragImage.style.position = "absolute";

  // устанавливаем перетаскиваемой картинке обработчики onmouseout и onmouseover и установим им рамки красные,
  // на тот случай если курсор будет за DIV(обвёрткой) чтоб наша перетаскиваемая картинка была всё ещё выделана красной рамкой
  dragImage.onmouseout = function () {
    dragImage.style.border = "1px solid red"; // картинку которую будем перетаскивать, выделяем красной рамкой
  };

  dragImage.onmouseover = function () {
    dragImage.style.border = "1px solid red"; // картинку которую будем перетаскивать, выделяем красной рамкой
  }

  var mouseX = EO.pageX,
      mouseY = EO.pageY,
      imageX = dragImage.offsetLeft,
      imageY = dragImage.offsetTop;

  dragShiftX = mouseX - imageX;
  dragShiftY = mouseY - imageY;

  window.onmousemove = dragMove;
  window.onmouseup = dragStop;
}

function dragStop () {
  window.onmousemove = null;
  window.onmouseup = null;

// снимаем обработчики mouseout, mousedown и mouseoover через removeEventListener,
  // dragImage.removeEventListener("mouseout", mouseOut, false);
  // dragImage.removeEventListener("mouseoover", mouseOver, false);
  // dragImage.removeEventListener("mousedown", dragStart, false);
  dragImage.onmouseout = null;
  dragImage.onmouseover = null;
  dragImage.style.border = "none"; //после того как перетащили картинку, убираем красную рамку.
}

function dragMove (EO) {
  EO = EO || window.event;
  PreventDefault(EO);

  var mouseX = EO.pageX,
      mouseY = EO.pageY,
      imageX = mouseX - dragShiftX,
      imageY = mouseY - dragShiftY;

  // координаты сторон картинки на момент перетягивания
  var leftSideImg = EO.clientX - dragShiftX, // левая сторона
      rightSideImg = EO.clientX + (dragImage.width - dragShiftX), // правая сторона
      upperSideImg = EO.clientY - dragShiftY, // верхняя сторона
      bottomSideImg = EO.clientY + (dragImage.height - dragShiftY); // нижняя сторона

  // // устанавливаем перетаскиваемой картинке обработчики onmouseout и onmouseover и установим им рамки красные,
  // // на тот случай если курсор будет за DIV(обвёрткой) чтоб наша перетаскиваемая картинка была всё ещё выделана красной рамкой
  // dragImage.onmouseout = function () {
  //   dragImage.style.border = "1px solid red"; // картинку которую будем перетаскивать, выделяем красной рамкой
  // };

  // dragImage.onmouseover = function () {
  //   dragImage.style.border = "1px solid red"; // картинку которую будем перетаскивать, выделяем красной рамкой
  // }

// логика чтоб картинка не выходила за рамки DIV(обвёртки)
  if (leftSideImg < leftSideWrap) { //если координаты левой стороны картинки при перетягивания выйдет за DIV, ДАЛЕЕ <=> - ЭТО ТЕКСТ буду помечать '*'
    if (bottomSideImg > bottomSideWrap) { // * плюс ещё и если верхняя сторона картинки при перетягивания выйдет за DIV,
      //то устанавливаем коорд левой и нижний стороны картинки равной коорд левой и нижний стороны DIV
      dragImage.style.left = leftSideWrap + "px";
      dragImage.style.top = (bottomSideWrap-dragImage.height) + "px";
      return null;
    } else if (upperSideImg < upperSideWrap) { // * плюс ещё и если верхняя сторона картинки при перетягивания выйдет за DIV,
      //то устанавливаем коорд левой и верхней стороны картинки равной коорд левой и верхней стороны DIV
      dragImage.style.left = leftSideWrap + "px";
      dragImage.style.top = upperSideWrap + "px";
      return null;
    } else {
      //то устанавливаем коорд левой стороны картинки равной коорд левой стороны DIV
      dragImage.style.left = leftSideWrap + "px";
      dragImage.style.top = imageY + "px";
      return null;
    }
  } else if (rightSideImg > rightSideWrap){ //если координаты правой стороны картинки при перетягивания выйдет за DIV, ДАЛЕЕ <=> - ЭТО ТЕКСТ буду помечать '*'
    if (bottomSideImg > bottomSideWrap) { // * плюс ещё и если верхняя сторона картинки при перетягивания выйдет за DIV,
      //то устанавливаем коорд правой и нижний стороны картинки равной коорд правой и нижний стороны DIV
      dragImage.style.left = (rightSideWrap-dragImage.width) + "px";
      dragImage.style.top = (bottomSideWrap-dragImage.height) + "px";
      return null;
    } else if (upperSideImg < upperSideWrap) { // * плюс ещё и если верхняя сторона картинки при перетягивания выйдет за DIV,
      //то устанавливаем коорд правой и верхней стороны картинки равной коорд правой и верхней стороны DIV
      dragImage.style.left = (rightSideWrap-dragImage.width) + "px";
      dragImage.style.top = upperSideWrap + "px";
      return null;
    } else {
    //то устанавливаем коорд правой стороны картинки равной коорд правой стороны DIV
      dragImage.style.left = (rightSideWrap-dragImage.width) + "px";
      dragImage.style.top = imageY + "px";
      return null;
    } 
  } else if (upperSideImg < upperSideWrap) { //если координаты верхней стороны картинки при перетягивания выйдет за DIV,
    //то устанавливаем коорд верхней стороны картинки равной коорд верхней стороны DIV
    dragImage.style.left = imageX + "px";
    dragImage.style.top = upperSideWrap + "px";
    return null;
  } else if (bottomSideImg > bottomSideWrap) { //если координаты нижней стороны картинки при перетягивания выйдет за DIV,
    //то устанавливаем коорд нижней стороны картинки равной коорд нижней стороны DIV
    dragImage.style.left = imageX + "px";
    dragImage.style.top = (bottomSideWrap-dragImage.height) + "px";
    return null;
  } else { // иначе если координаты всех сторон картинки при перетягивания не выходит за DIV,
    // то устанавливаем внутри DIV
    dragImage.style.left = imageX + "px";
    dragImage.style.top = imageY + "px";
  }
}

// установка обработчика событий
function AddEventHandler(Elem,EventName,HandlerFunc,CaptureFlag) {
  if ( Elem.addEventListener )
    Elem.addEventListener(EventName,HandlerFunc,CaptureFlag); // современные браузеры и IE >=9
  else
    if ( !CaptureFlag ) // перехват вообще невозможен
    {
      var EventName2='on'+EventName;
      if ( Elem.attachEvent ) // IE <=8
      {
        // создаём обёртку для обработчика, чтобы обработчику правильно передавался this
        var IEHandlerF=function() { HandlerFunc.call(Elem); } 
        Elem.attachEvent(EventName2,IEHandlerF);
        var StoreName="__IEHandlerF_"+EventName;
        Elem[StoreName]=IEHandlerF; // сохраняем ссылку на обёртку, чтобы найти её при удалении обработчика
      }
      else // устаревшие браузеры
        if ( !Elem[EventName2] )
          Elem[EventName2]=HandlerFunc; // не сработает если несколько обработчиков одного события
    }
}

// отмена обработки события по умолчанию
// EO - объект события
function PreventDefault(EO) {
  if ( EO.preventDefault )
      EO.preventDefault(); 
  else
      EO.returnValue=false;
}