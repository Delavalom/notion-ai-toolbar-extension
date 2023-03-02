const insert = (content) => {
  const elements = document.getElementsByClassName("droid");

  if (elements.length === 0) {
    return;
  }

  const element = elements[0];

  const pToRemove = element.childNodes[0];
  pToRemove.remove();

  return true;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "inject") {
    const { content } = request;

    //     const result = insert(content);

    //     if (!result) {
    //       sendResponse({ status: "failed" });
    //     }
  }
  document.body.appendChild(`
    <div
    style="
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: rgb(255, 255, 255);
    opacity: 0.5;
    z-index: 2000;
    height: 1083px;
    width: 100%;
    "
    >
    <iframe style="width: 100%; height: 100%"></iframe>
    </div>
    <div
    style="
    position: absolute;
    width: 350px;
    border: 1px solid rgb(51, 102, 153);
    padding: 10px;
    background-color: rgb(255, 255, 255);
    z-index: 2001;
    overflow: auto;
    text-align: center;
    top: 149px;
    left: 497px;
    "
    >
    <div>
    <div style="text-align: center">
    <span><strong>Processing... Please Wait.</strong></span>
    </div>
    </div>
    </div>
    `);
  
});
