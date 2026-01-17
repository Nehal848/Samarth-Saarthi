export async function evaluateFullInterview(
  questions: string[],
  answers: string[],
  context: {
    skill: string;
    type: "technical" | "communication";
  }
): Promise<{ score: number; feedback: string }> {

  console.log("📡 Sending interview to backend");

  const res = await fetch("http://127.0.0.1:8000/evaluate-interview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      skill: context.skill,
      type: context.type,
      questions,
      answers,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Backend evaluation failed: " + text);
  }

  const data = await res.json();

  console.log("✅ Backend Gemini result:", data);

  return {
    score: data.score,
    feedback: data.feedback,
  };
}
