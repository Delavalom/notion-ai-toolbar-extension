const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-key"], (result) => {
      if (result["openai-key"]) {
        const decodedKey = atob(result["openai-key"]);
        resolve(decodedKey);
      }
    });
  });
};

const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;
    chrome.tabs.sendMessage(
      activeTab,
      { message: "inject", content },
      (response) => {
        console.log(content);
        if (response.status === "failed") {
          console.log("injection failed.");
        }
      }
    );
  });
};

const generate = async (prompt) => {
  const key = await getKey();
  const url = "https://api.openai.com/v1/completions";

  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0.8,
    }),
  });

  const completion = await completionResponse.json();
  return completion.choices.pop();
};

const generateCompletionAction = async (info) => {
  try {
    sendMessage("generating...");
    const { selectionText, selectionOption } = info;

    const baseCompletion = await generate(
      `${selectionOption} the following text: \n ${selectionText}`
    );
    sendMessage(baseCompletion.text);
  } catch (error) {
    sendMessage(error.toString());
  }
};

chrome.runtime.onInstalled.addListener(async () => {
  for (let [key, content] of Object.entries(generateOptions)) {
    chrome.contextMenus.create({
      id: key,
      title: content,
      type: "normal",
      contexts: ["selection"],
    });
  }
});

const generateOptions = {
  improveWriting: "Improve writing",
  fixSpellingGrammar: "Fix spelling & grammar",
  makeShorter: "Make shorter",
  makeLonger: "Make longer",
//   changeTone: [
//     "professional",
//     "casual",
//     "straightfoward",
//     "confident",
//     "friendly",
//   ],
  simplifyLanguage: "Simplify language",
  summarize: "Summarize",
//   translate: ["English", "Spanish", "French", "Portuguese"],
  explainThis: "Explain this",
  findTodosOn: "Find todos on",
  continueWriting: "Continue Writing",
};

chrome.contextMenus.onClicked.addListener((info) => {
    const {selectionText, menuItemId, editable} = info
    selectionText
    chrome.scripting.executeScript({
        code: `console.log(${selectionText}, ${menuItemId}, ${editable})`
    })
});
