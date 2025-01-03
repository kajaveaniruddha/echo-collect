import { getOllamaInstance } from "./llm-models";
import { PromptTemplate } from "@langchain/core/prompts";

export const analyzeReview = async (content: string) => {
  const ollama = getOllamaInstance();

  const promptTemplate = PromptTemplate.fromTemplate(`
      Analyze the following review:
      Review: {review}
      
      Provide:
      - Overall sentiment (positive, neutral, negative)
      - Categories the review in all the applicable categories from the given list: bug, request, praise, complaint, suggestion, question, other.
      - Only return the requested formatted JSON and no other texts as I want to parse your output directly into JSON object.
      - No need for any explanations.

      Format response as JSON:
      {{
        "overall_sentiment": "<positive|neutral|negative>",
        "feedback_classification": ["<categories>"],
        "review":"{review}"
      }}
    `);

  const prompt = await promptTemplate.format({ review: content });

  try {
    const response = await ollama.invoke(prompt, {
      configurable: { caches: false },
    });
    console.log(
      "--------------LLM response---------------------\n",
      response,
      "\n-------------------------"
    );
    const result = JSON.parse(response); // Parse the matched JSON
    return result;
  } catch (error) {
    console.error("Error analyzing sentiment and classification:", error);
    return null;
  }
};
