const keywordInput: HTMLInputElement = document.querySelector('#keyword-input') ?? new HTMLInputElement()
const linkInput: HTMLInputElement = document.querySelector('#link-input') ?? new HTMLInputElement()
const submitBtn = document.querySelector('#submit-btn') ?? new HTMLButtonElement()
const messageBox = document.querySelector('#message-box') ?? new HTMLElement()

async function submitKeywordLink (keyword: string, url: string, description = null): Promise<void> {
  const response = await fetch('http://localhost:3000/api/link', {
    method: 'POST',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ keyword, url })
  })
  if (response.status === 200) {
    const parsedResponse = await response.json()
    messageBox.textContent = parsedResponse.summary
  } else if (response.status === 422) {
    const errorMessage = await response.text()
    messageBox.textContent = errorMessage
  } else {
    messageBox.textContent = `Unknown error. Status code (${response.status})`
  }
}

submitBtn.addEventListener('click', () => {
  const keyword = keywordInput.value ?? 'gooo'
  const url = linkInput.value ?? 'http://www.google.com'
  submitKeywordLink(keyword, url).catch((err) => console.error(err.message))
})
