document.getElementById("start").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "startTimer" });
});

document.getElementById("reset").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "resetTimer" });
});

document.getElementById("stop").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "stopTimer" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateTimer") {
    document.getElementById("w_minutes").innerText = message.wMinutes;
    document.getElementById("w_seconds").innerText = message.wSeconds;
    document.getElementById("b_minutes").innerText = message.bMinutes;
    document.getElementById("b_seconds").innerText = message.bSeconds;
  }
});
