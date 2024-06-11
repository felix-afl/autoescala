// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// (c) Todos os direitos reservados. 2022
//
// Adyelson Felix Loureiro
//
// f3lixtech@f3lixtech.com
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
function add(i, u, w, reqLevel, shiftTagS, typeOfDay) {
  //days - daysOfWork or hour - workHours
  //i = dia
  //u = turno
  //w = numero do trabalho no dia
  let workArrayPos = [];
  let arrayObjects = Object.entries(workerList);
  let listEntries = [];
  let startShiftHour = month[i][u].startHour;
  let extraWorkPlus = 0;
  let extraHourPlus = 0;
  let countDay = true;
  ///// define level para vaga
  for (let z = 0; z < arrayObjects.length; z++) {
    let actualWork = arrayObjects[z][1];
    if (actualWork.level == reqLevel) {
      let putSignal = "";
      let cantEnter = false;
      let mustRest = 0;
      if (actualWork.especialSituation.length > 0) {
        for (let s = 0; s < actualWork.especialSituation.length; s++) {
          if (actualWork.especialSituation[s].days.includes(parseInt(i))) {
            cantEnter = true;
            putSignal = actualWork.especialSituation[s].signal;
            extraWorkPlus = workerList[actualWork.name];
            extraHourPlus = actualWork.especialSituation[s].workHourPLus;
            countDay = actualWork.especialSituation[s].CountDay;
          }
        }
        for (let a = 0; a < actualWork.especialSituation.length; a++) {
          if (
            actualWork.especialSituation[a].daysOfRest.includes(parseInt(i))
          ) {
            let posCheck = actualWork.especialSituation[a].daysOfRest.length;
            let checkValueLast =
              actualWork.especialSituation[a].daysOfRest[posCheck - 1];
            let checkValueFirst = actualWork.especialSituation[a].daysOfRest[0];
            mustRest++;

            if (i == checkValueFirst) {
              if (
                actualWork.especialSituation[a].firstDayOfRestHour >=
                actualWork.especialSituation[a].hourEnd
              ) {
                mustRest--;
              }
            }
            if (i == checkValueLast) {
              if (
                actualWork.especialSituation[a].lastDayOfRestHour <
                startShiftHour
              ) {
                mustRest--;
              }
            }
          }
        }
      }
      if (mustRest == 0) {
        if (!cantEnter) {
          let alreadyPut = !!actualWork.shiftWork[i];
          if (!alreadyPut) {
            listEntries.push(actualWork);
          }
        } else {
          if (actualWork.shiftWork[i] == putSignal) {
          } else {
            let existThis = !!extraWorkPlus.daysOfWork[putSignal];
            if (!existThis) {
              extraWorkPlus.daysOfWork[putSignal] = { days: 1 };
            } else {
              extraWorkPlus.daysOfWork[putSignal].days++;
            }
            if (countDay) {
              extraWorkPlus.daysOfWorkTotal++;
              extraWorkPlus.daysOfWorkType[typeOfDay]++; //conferir necessidade		tipo de dia
              if (["Friday", "Saturday", "Sunday"].includes(typeOfDay)) {
                extraWorkPlus.daysOfWeekend++;
              }
            }
            extraWorkPlus.workHours += extraHourPlus;

            actualWork.shiftWork[i] = putSignal;
          }
        }
      }
    }
  }
  /////////////////////////////////////////////////////////////	VERIFICAR

  let arrayCheck = [listEntries.reverse()];
  // inverter para sempre pegar do ultimo da lista de baixo pra cima

  let paramCheckList = ["param1", "param2", "param3"];
  let paramCheck = [...new Set(paramCheckList)].length;
  for (let o = 0; o < paramCheck; o++) {
    workArrayPos = [];
    arrayCheck[o].forEach((element) => {
      if (i > 26) {
        if (["Friday", "Saturday", "Sunday", "Holiday"].includes(typeOfDay)) {
          paramCheckList[o] == "param2"
            ? workArrayPos.push(
                element.daysOfWorkType[typeOfDay] + element.workHours
              )
            : "";
          paramCheckList[o] == "param1"
            ? workArrayPos.push(element.daysOfWeekend + element.workHours)
            : "";
          paramCheckList[o] == "param3"
            ? workArrayPos.push(
                element.daysOfWork[shiftTagS].days + element.workHours
              )
            : "";
        } else {
          paramCheckList[o] == "param1"
            ? workArrayPos.push(element.workHours)
            : "";
          paramCheckList[o] == "param2"
            ? workArrayPos.push(element.daysOfWorkTotal * element.workHours)
            : "";
          paramCheckList[o] == "param3"
            ? workArrayPos.push(
                element.daysOfWork[shiftTagS].days * element.workHours
              )
            : "";
        }
      } else if (
        ["Friday", "Saturday", "Sunday", "Holiday"].includes(typeOfDay)
      ) {
        paramCheckList[o] == "param3"
          ? workArrayPos.push(
              element.daysOfWorkType[typeOfDay] * element.daysOfWeekend
            )
          : "";
        paramCheckList[o] == "param1"
          ? workArrayPos.push(element.daysOfWeekend % 3 == 0 ? 1 : 0)
          : "";
        paramCheckList[o] == "param2"
          ? workArrayPos.push(
              element.daysOfWork[shiftTagS].days * element.daysOfWeekend
            )
          : "";
      } else {
        paramCheckList[o] == "param1"
          ? workArrayPos.push(element.workHours)
          : "";
        paramCheckList[o] == "param2"
          ? workArrayPos.push(element.daysOfWorkTotal)
          : "";
        paramCheckList[o] == "param3"
          ? workArrayPos.push(element.daysOfWorkType[typeOfDay])
          : "";
      }
    });
    arrayCheck[o + 1] = makeListToCheck(
      arrayCheck[o],
      searchLessDay(workArrayPos)
    );
  }

  let workerId = "??";
  if (searchLessDay(workArrayPos)[0] == undefined) {
    //alert('Não é possível atender as regras de escala com a quantidade atual de funcionários.');
    // document.querySelector('.shiftList').classList.add('hide');
    // document.querySelector('.workIdshiftList').classList.add('hide');
  } else {
    /////////

    let workerName =
      arrayCheck[paramCheck - 1][searchLessDay(workArrayPos)[0]].name;

    /////////
    workerId = workerList[workerName].workerId;
    workerList[workerName].daysOfWorkType[typeOfDay]++;
    if (["Friday", "Saturday", "Sunday"].includes(typeOfDay)) {
      workerList[workerName].daysOfWeekend++;
    }
    workerList[workerName].daysOfWork[shiftTagS].days++;
    workerList[workerName].daysOfWorkTotal++;
    workerList[workerName].shiftWork[i] = month[i][u].shift;
    workerList[workerName].workHours += month[i][u].ch;
    //////------------------------------------------------------------------
    //////------------------------------------------------------------------
    let cont = document.querySelector("#maxdayssequence").value - 1; ////////////////////////////////////////////-----------------edit  -1 fixo
    let sequenceRest = document.querySelector("#restaftersequence").value; ////////////////////////////////////////////-----------------edit
    let checkSequenceOfWork = [];
    for (let zw = i - cont; zw < i; zw++) {
      checkSequenceOfWork.push(workerList[workerName].shiftWork[zw]);
    }
    let endDay = i;
    let endHour = month[i][u].ch + month[i][u].startHour;
    let afterRest = 0;
    //tem folga no meio do intervalo escolhido
    if (checkSequenceOfWork.includes(undefined)) {
      afterRest = month[i][u].restAfter;
    } else {
      afterRest = sequenceRest;
    }

    let restObjectData = getRestDays(endDay, endHour, afterRest);
    let daysToRest = restObjectData.daysR;
    let startRestHour = restObjectData.startHR;
    let endRestHour = restObjectData.endHR;

    let daysToPut = [];
    for (let t = i; t <= endDay; t++) {
      daysToPut.push(t);
    }

    let conditionToAppend = {
      workHourPLus: 0,
      signal: month[i][u].shift,
      days: daysToPut,
      daysOfRest: daysToRest,
      firstDayOfRestHour: startRestHour,
      lastDayOfRestHour: endRestHour,
      afterRest: afterRest,
      hourEnd: endHour,
      hourStart: month[i][u].startHour,
    };
    workerList[workerName].especialSituation.push(conditionToAppend);
    //////------------------------------------------------------------------
    //////------------------------------------------------------------------
  }
  let valueReturn = { workerId, w };
  return valueReturn;
}
function makeListToCheck(entries, listLessDay) {
  let listCheck = [];
  listLessDay.forEach((el) => {
    listCheck.push(entries[el]);
  });
  return listCheck;
}
// function searchLessDay(array) {
//   let element = Math.min.apply(Math, array);
//   let indices = [];

//   let idx = array.indexOf(element);
//   while (idx != -1) {
//     indices.push(idx);
//     idx = array.indexOf(element, idx + 1);
//   }

//   return indices;
// }

function searchLessDay(array) {
  let minElement = Math.min.apply(Math, array);
  let indices = [];
  let idx = array.indexOf(minElement);

  while (idx != -1) {
    indices.push(idx);
    idx = array.indexOf(minElement, idx + 1);
  }

  // Encontrar o próximo valor maior
  let nextMinElement = Math.min.apply(
    Math,
    array.filter((el) => el > minElement)
  );
  if (!isNaN(nextMinElement)) {
    idx = array.indexOf(nextMinElement);
    while (idx != -1) {
      indices.push(idx);
      idx = array.indexOf(nextMinElement, idx + 1);
    }
  }

  return indices;
}
