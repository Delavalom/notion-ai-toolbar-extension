const generateOptions = {
  improveWriting: "Improve writing",
  fixSpellingGrammar: "Fix spelling & grammar",
  makeShorter: "Make shorter",
  makeLonger: "Make longer",
  simplifyLanguage: "Simplify language",
  summarize: "Summarize",
  explainThis: "Explain this",
  findTodosOn: "Find todos on",
  continueWriting: "Continue Writing",
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

const generate = async (prompt) => {
  const key = await getKey();
  const url = "https://api.openai.com/v1/chat/completions";

  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const completion = await completionResponse.json();
  return completion.choices.pop();
};

const generateCompletionAction = async (info, tab) => {
  try {
    const { selectionText, menuItemId, editable } = info;

    const baseCompletion = await generate(
      `${generateOptions[menuItemId]} the following text: \n ${selectionText}`
    );

    sendMessage(baseCompletion.message.content, tab.id);
  } catch (error) {
    sendMessage(error.toString(), tab.id);
  }
};

const sendMessage = (content, activeTab) => {
  chrome.tabs.sendMessage(activeTab, { content });
};

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
