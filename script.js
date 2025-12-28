/***********************
 * CONFIG
 ***********************/
const GROQ_API_KEY = "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";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
 
/***********************
 * SYSTEM PROMPT
 ***********************/
const SYSTEM_PROMPT = `
Ты — опытный преподаватель и наставник по JavaScript.
 
Твоя задача:
- Проанализировать ответы студента
- Дать конструктивную и персонализированную обратную связь
- Указать сильные стороны
- Аккуратно показать слабые места или неточности
- Дать рекомендации, что улучшить
- Предложить, что изучать дальше
 
Тон:
Поддерживающий, спокойный, мотивирующий, без осуждения.
 
Формат ответа:
1. Общая оценка понимания материала
2. Что получилось хорошо
3. Что стоит улучшить
4. Рекомендации по дальнейшему обучению
`;
 
/***********************
 * DOM
 ***********************/
const submitBtn = document.getElementById("submitBtn");
const aiResponse = document.getElementById("aiResponse");
 
/***********************
 * EVENTS
 ***********************/
submitBtn.addEventListener("click", async () => {
  const answers = {
    q1: document.getElementById("q1").value.trim(),
    q2: document.getElementById("q2").value.trim(),
    q3: document.getElementById("q3").value.trim()
  };
 
  if (!answers.q1 || !answers.q2 || !answers.q3) {
    aiResponse.textContent = "Пожалуйста, ответь на все вопросы.";
    return;
  }
 
  aiResponse.textContent = "ИИ-наставник анализирует твои ответы…";
 
  try {
    const prompt = buildPrompt(answers);
    const reply = await callGroq(prompt);
    aiResponse.textContent = reply;
  } catch (err) {
    aiResponse.textContent = "Ошибка при получении ответа от ИИ.";
    console.error(err);
  }
});
 
/***********************
 * FUNCTIONS
 ***********************/
function buildPrompt(answers) {
  return `
Ответы студента:
 
1. Promise:
${answers.q1}
 
2. async/await:
${answers.q2}
 
3. Применение асинхронного кода:
${answers.q3}
`;
}
 
async function callGroq(userPrompt) {
  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });
 
  if (!response.ok) {
    throw new Error("Groq API error");
  }
 
  const data = await response.json();
  return data.choices[0].message.content;
}
