let startTimer;
let wMinutes = 25;
let wSeconds = 0;
let bMinutes = 5;
let bSeconds = 0;

function timer() {
  if (wSeconds !== 0) {
    wSeconds--;
  } else if (wMinutes !== 0 && wSeconds === 0) {
    wSeconds = 59;
    wMinutes--;
  }

  if (wMinutes === 0 && wSeconds === 0) {
    if (bSeconds !== 0) {
      bSeconds--;
    } else if (bMinutes !== 0 && bSeconds === 0) {
      bSeconds = 59;
      bMinutes--;
    }
  }

  chrome.storage.local
    .set({
      wMinutes: wMinutes,
      wSeconds: wSeconds,
      bMinutes: bMinutes,
      bSeconds: bSeconds,
    })
    .then(() => {
      chrome.runtime.sendMessage({
        action: "updateTimer",
        wMinutes: wMinutes,
        wSeconds: wSeconds,
        bMinutes: bMinutes,
        bSeconds: bSeconds,
      });
    });
}

function stopInterval() {
  clearInterval(startTimer);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTimer") {
    if (startTimer === undefined) {
      startTimer = setInterval(timer, 1000);
    } else {
      alert("Timer is already running");
    }
  } else if (request.action === "resetTimer") {
    wMinutes = 25;
    wSeconds = 0;
    bMinutes = 5;
    bSeconds = 0;

    stopInterval();
    startTimer = undefined;

    chrome.storage.local
      .set({
        wMinutes: wMinutes,
        wSeconds: wSeconds,
        bMinutes: bMinutes,
        bSeconds: bSeconds,
      })
      .then(() => {
        chrome.runtime.sendMessage({
          action: "updateTimer",
          wMinutes: wMinutes,
          wSeconds: wSeconds,
          bMinutes: bMinutes,
          bSeconds: bSeconds,
        });
      });
  } else if (request.action === "stopTimer") {
    stopInterval();
    startTimer = undefined;
  }
});

chrome.storage.local
  .get(["wMinutes", "wSeconds", "bMinutes", "bSeconds"])
  .then((result) => {
    wMinutes = result.wMinutes || 25;
    wSeconds = result.wSeconds || 0;
    bMinutes = result.bMinutes || 5;
    bSeconds = result.bSeconds || 0;
  })
  .catch((error) => {
    console.error("Error fetching from storage:", error);
  });
