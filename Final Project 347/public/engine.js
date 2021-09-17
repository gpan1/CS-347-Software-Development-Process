(($) => {
  let title = document.getElementById("title");
  let status = document.getElementById("status");
  let list = document.getElementById("results");
  let buttons = document.getElementById("buttons");

  let horn = $("#dialog");

  let engine = new IoTEngine(false, new Array());
  let sensor = new Sensors(new Array());
  let display = new UserDisplay(false, "", "");
  let log = new DataLog(new Array());
  let locomotive = new Locomotive(55);

  function Sensors(scannedInfo) {
    this.scannedInfo = scannedInfo;
  }
  function IoTEngine(isOnline, recommendedActions) {
    this.isOnline = isOnline;
    this.recommendedActions = recommendedActions;
  }
  function Locomotive(speedChange) {
    this.speedChange = speedChange;
  }
  function UserDisplay(actionTaken, username, password) {
    this.username = username;
  }
  function DataLog() {
    this.actionTaken = [];
  }

  function start() {
    chance = Math.floor(Math.random() * 3 + 1);
    if (chance == 2) {
      engine.isOnline = false;
    } else {
      engine.isOnline = true;
    }
  }
  function checkStatus() {
    return engine.isOnline;
  }
  function disconnectFromCloud() {
    if (checkStatus()) {
      let p1 = document.createElement("p");
      engine.isOnline = false;
      status.innerHTML = "";
      p1.innerHTML = `Engine Offline.`;
      p1.classList.add("orange");
      status.appendChild(p1);
    }
  }
  function reconnectToCloud() {
    chance = Math.floor(Math.random() * 2 + 1);
    if (chance == 2) {
      engine.isOnline = true;
    } else {
      engine.isOnline = false;
    }
  }
  function changeSpeed(val) {
    locomotive.speedChange = val;
  }
  function scanSurroundings() {
    //sensor.scannedInfo.push(1);
    sensor.scannedInfo.push(Math.floor(Math.random() * 8 + 1));
  }

  let gateApproach = () => {
    changeSpeed(55);
    horn.show();
    let p = document.createElement("p");
    p.classList = "orange";
    p.innerHTML = "Approaching Gate.";
    p.innerHTML += `<br>Current Speed: ${locomotive.speedChange}`;
    engine.recommendedActions.push(p);
  };

  let atGate = () => {
    let p1 = document.createElement("p");
    p1.classList = "green";
    p1.innerHTML = "Continue as normal. Gate closed.";
    p1.innerHTML += `<br>Current Speed: ${locomotive.speedChange}`;
    engine.recommendedActions.push(p1);
    log.actionTaken.push(p1.innerHTML);
    list.appendChild(recommendAction());
    p.scrollIntoView();
  };

  function processData(scannedInfo) {
    changeSpeed(55);
    let p = document.createElement("p");
    switch (scannedInfo) {
      case 3:
        p.classList = "orange";
        p.innerHTML = "Proceed with caution. Wheel Slippage detected.";
        changeSpeed(30);
        p.innerHTML += `<br>Current Speed: ${locomotive.speedChange}`;
        engine.recommendedActions.push(p);
        log.actionTaken.push(p.innerHTML);
        break;
      case 4:
        p.classList = "orange";
        p.innerHTML = "Moving object detected within 750m. Slow down.";
        changeSpeed(30);
        p.innerHTML += `<br>Current Speed: ${locomotive.speedChange}`;
        engine.recommendedActions.push(p);
        log.actionTaken.push(p.innerHTML);
        break;
      case 5:
        p.classList = "red";
        p.innerHTML = "Still object detected within 750m. Stop locomotive.";
        changeSpeed(0);
        p.innerHTML += `<br>Current Speed: ${locomotive.speedChange}`;
        engine.recommendedActions.push(p);
        log.actionTaken.push(p.innerHTML);
        break;
      case 6:
        if (checkStatus()) {
          p.innerHTML = "Engine lost connection.";
          disconnectFromCloud();
          p.innerHTML += `<br>Current Speed: ${locomotive.speedChange}`;
          engine.recommendedActions.push(p);
          log.actionTaken.push(p.innerHTML);
        }
        break;
      default:
        p.classList = "green";
        p.innerHTML = "No action needed.";
        p.innerHTML += `<br>Current Speed: ${locomotive.speedChange}`;
        engine.recommendedActions.push(p);
        log.actionTaken.push(p.innerHTML);
        break;
    }
  }
  function recommendAction() {
    return engine.recommendedActions.pop();
  }

  function scanning() {
    // scan
    let p1 = document.createElement("p");
    list.appendChild(p1);
    p1.innerHTML = `Scanned.`;
    scanSurroundings();
    let val = sensor.scannedInfo.pop();
    if (val === 1) {
      gateApproach();
      setTimeout(atGate, 15000);
      setTimeout(() => {
        horn.hide();
      }, 20000);
    } else {
      processData(val);
    }
    let temp = recommendAction();
    list.appendChild(temp);
    temp.scrollIntoView();
    display.actionTaken = true;
  }

  function attemptReconnect() {
    // attempt reconnect button
    if (!checkStatus()) {
      let p1 = document.createElement("p");
      list.appendChild(p1);
      reconnectToCloud();

      if (!checkStatus()) {
        p1.innerHTML = `Reconnection failed.`;
      } else {
        let p2 = document.createElement("p");
        status.innerHTML = "";
        p2.innerHTML = `Engine Online.`;
        p2.classList.remove("orange");
        p2.classList.add("green");
        status.appendChild(p2);

        p1.innerHTML = `Connection success!`;
      }
      p1.scrollIntoView();
    }
  }

  display.username = "conductor";
  let h2 = document.createElement("h2");

  h2.innerHTML = `Welcome, ${display.username}.`;
  title.appendChild(h2);
  start();
  let p = document.createElement("p");
  if (checkStatus()) {
    p.innerHTML = `Engine Online.`;
    p.classList.add("green");
    status.appendChild(p);
  } else {
    p.innerHTML = `Engine Offline.`;
    p.classList.add("orange");
    status.appendChild(p);
  }

  // clear screen button
  var option2 = document.createElement("button");
  option2.appendChild(document.createTextNode("Clear Screen Log"));
  buttons.appendChild(option2);
  option2.addEventListener("click", (event) => {
    event.preventDefault();
    list.innerHTML = "";
  });

  // actual log begins
  scanning();
  setInterval(scanning, 22000);
  setInterval(attemptReconnect, 3000);
})(window.jQuery);
