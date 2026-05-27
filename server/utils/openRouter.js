import axios from "axios";

export const analyzeRepoWithAI = async (
  repoDetails,
  tree,
  readmeContent,
  packageJsonContent
) => {

  const prompt = `
You are an expert software architect.

Analyze this GitHub repository and return ONLY valid JSON.

Repository Name:
${repoDetails.name}

Description:
${repoDetails.description || "No description provided"}

Folder Structure:
${JSON.stringify(tree.slice(0, 50), null, 2)}

README:
${
  readmeContent
    ? readmeContent.substring(0, 1000)
    : "No README found"
}

package.json:
${
  packageJsonContent
    ? packageJsonContent.substring(0, 1000)
    : "No package.json found"
}

Return response ONLY in this format:

{
  "purpose": "A paragraph explaining the project.",
  "architecture": "Description of the tech stack and architecture.",
  "workflow": "How data flows through the system.",
  "setup": "Steps to run the project locally.",
  "importantFiles": ["file1: purpose", "file2: purpose"],
  "mermaidDiagram": "graph TD;\\n  classDef frontend fill:#3b82f6,stroke:#1d4ed8,color:#fff;\\n  classDef backend fill:#10b981,stroke:#047857,color:#fff;\\n  classDef database fill:#f59e0b,stroke:#b45309,color:#fff;\\n  A[Frontend App]:::frontend -- REST API --> B[Backend Server]:::backend;\\n  B -- Read/Write --> C[(Database)]:::database;",
  "healthScore": {
    "overall": 85,
    "codeQuality": 80,
    "architecture": 75,
    "maintainability": 90
  },
  "analysisPoints": [
    { "label": "README Quality", "value": "Detailed", "status": "good" },
    { "label": "Folder Structure", "value": "Standard", "status": "good" },
    { "label": "Naming Conventions", "value": "Consistent", "status": "good" },
    { "label": "Dependency Bloat", "value": "Minimal", "status": "good" }
  ],
  "interviewQuestions": [
    "Question 1 about a specific implementation detail.",
    "Question 2 about the architecture choice.",
    "Question 3 about how to scale this specific setup."
  ]
}

CRITICAL: For 'mermaidDiagram', provide a highly detailed Mermaid.js graph architecture representation. Use 'classDef' to color nodes (e.g., frontend blue, backend green, db orange). Include subgraphs if applicable. Ensure the syntax is perfectly valid Mermaid syntax.
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "AI Repo Explainer"
        }
      }
    );

    let result = response.data.choices[0].message.content;
    result = result.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(result);
    } catch (jsonError) {
      console.log("Invalid JSON Returned By AI:", result);
      throw new Error("AI returned invalid JSON");
    }
  } catch (error) {
    console.error("OpenRouter API Error:", error.response?.data || error.message);
    throw new Error("Failed to analyze repository with AI");
  }
};

export const chatWithRepo = async (analysisContext, userMessage, chatHistory = [], fileContext = null) => {
  const systemPrompt = `
You are an expert AI assistant specialized in code analysis. 
You are helping a user understand a GitHub repository they just analyzed.

REPOSITORY CONTEXT:
Name: ${analysisContext.repoName}
Purpose: ${analysisContext.explanation.purpose}
Architecture: ${analysisContext.explanation.architecture}
File Tree (partial): ${JSON.stringify(analysisContext.tree?.slice(0, 50))}

${fileContext ? `FILE CONTENT PROVIDED FOR CONTEXT:\n${fileContext}` : ""}

Answer the user's questions contextually. 
If the user asks about the database, schemas, models, or API endpoints, refer to the "FILE CONTENT PROVIDED FOR CONTEXT" if it contains relevant model or route files. Explain the "what, why, and how" of the implementation based on the code provided. Provide specific examples from the code.
If you don't know the answer, be honest. Keep answers concise and helpful.
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "AI Repo Explainer"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Chat API Error:", error.response?.data || error.message);
    throw new Error("Failed to get response from AI");
  }
};