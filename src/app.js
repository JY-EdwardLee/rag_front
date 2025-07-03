const form = document.querySelector("#chat-form")
const questionInput = document.querySelector("#question")
const answerBox = document.querySelector("#answer")
const productSelect = document.querySelector("#product")


// 제품 목록 불러오기
fetch("http://localhost:8000/products/")
  .then(res => res.json())
  .then(data => {
    data.products.forEach(product => {
      const option = document.createElement("option")
      option.value = product
      option.textContent = product
      productSelect.appendChild(option)
    })
  })
  .catch(err => {
    console.error("제품 목록 불러오기 실패:", err)
  });

// 질문 전송
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const question = questionInput.value.trim()
  const product = productSelect.value.trim()
  if (!question || !product) {
    alert("질문과 제품을 모두 선택해주세요!")
    return
  }

  // 사용자 질문 추가
  const userMsg = document.createElement("div")
  userMsg.className = "message user"
  userMsg.textContent = question
  answerBox.appendChild(userMsg)

  questionInput.value = ""

  try {
    const res = await fetch("http://localhost:8000/query/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, product }), 
    });
    const data = await res.json();

    const botMsg = document.createElement("div")
    botMsg.className = "message bot"
    botMsg.textContent = data.generated_answer
    answerBox.appendChild(botMsg)

    answerBox.scrollTop = answerBox.scrollHeight
  } catch (err) {
    const botMsg = document.createElement("div")
    botMsg.className = "message bot"
    botMsg.textContent = "서버 오류가 발생했어요"
    answerBox.appendChild(botMsg)
  }

  console.log("선택된 제품:", product)


});
