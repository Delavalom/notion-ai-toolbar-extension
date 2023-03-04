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
<div style="display:flex; gap:20px; align-items:center; justify-content:center; width:100%;">
<button id="close-btn" style="cursor:pointer; padding: 6px 12px; font-size: 16px; border: none; border-radius: 20px; background-color:#1a1a1a; color:#fafafa;">X</button>
<button id="copy-btn" style="cursor:pointer; padding: 6px 12px; font-size: 16px; border: solid #1a1a1a; border-radius: 20px; background-color:#fafafa; color:#1a1a1a;">Copy</button>
</div>
</div>`;
  body.appendChild(modal);
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  dialog.querySelector("#close-btn").addEventListener("click", () => {
    dialog.remove();
  });
  dialog.querySelector("#copy-btn").addEventListener("click", () => {
    const p = dialog.querySelector("p");
    navigator.clipboard.writeText(p.textContent);
    dialog.remove();
  });
}
