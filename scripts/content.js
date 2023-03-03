chrome.runtime.onMessage.addListener(printResults);

function printResults(msg) {
  const { content, title } = msg;

  const body = document.body;
  const modal = document.createElement("dialog");
  modal.setAttribute(
    "style",
    `
min-height: 150px;
height: content-fit;
width: 700px;
border: none;
padding: 20px;
top:150px;
border-radius:20px;
background-color:white;
position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
z-index: 50;
`
  );
  modal.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; padding:20px; gap:20px; width:100%; height:100%;">
<h2 style="font-family:system-ui;">${title}</h2>
<p style="width:100%; height:100%; font-size:20px; font-weight:600; font-family:system-ui; color:#242424;">${content}</p>
<button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px; background-color:#1a1a1a; color:#fafafa;">x</button>
</div>`;
  body.appendChild(modal);
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.remove();
  });
}
