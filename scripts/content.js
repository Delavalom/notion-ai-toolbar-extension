chrome.runtime.onMessage.addListener(printResults);

function printResults(msg) {
  const { content } = msg;
  alert(content);
}
