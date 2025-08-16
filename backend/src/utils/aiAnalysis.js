/**
 * aiAnalysis Utility (Live)
 * @description Connects to the Google Gemini API to perform real-time resume analysis.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiAnalysis = {
  /**
   * @async
   * @function analyze
   * @description Sends resume text to the Gemini API for analysis.
   * @param {string} resumeText - The extracted text from the user's resume.
   * @param {string} [jobDescription] - The optional job description text.
   * @returns {Promise<object>} A promise that resolves with the structured analysis object from the AI.
   */
  analyze: async (resumeText, jobDescription) => {
    console.log("--- [AI Service] Starting LIVE Gemini analysis ---");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const generationConfig = {
      temperature: 0.2,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const prompt = `
      As an expert resume reviewer and career coach, analyze the following resume text.
      
      **Resume Text:**
      """
      ${resumeText}
      """

      ${jobDescription ? `
      **Job Description to Match Against:**
      """
      ${jobDescription}
      """
      ` : ''}

      **Task:**
      Provide a detailed analysis in the following JSON format. Do not include any text outside of the JSON object.

      **JSON Output Structure:**
      {
        "skillsMatch": <A percentage (number from 0-100) representing how well the resume skills match the job description. If no job description is provided, estimate a general score based on the quality and clarity of the skills listed.>,
        "missingSkills": <An array of 3-5 key skills or qualifications from the job description that are missing or not emphasized in the resume. If no job description, suggest 3-5 generally valuable skills for the likely field.>,
        "formattingFeedback": <A single string providing concise feedback on the resume's formatting, readability, and structure.>,
        "suggestions": <An array of 3-4 specific, actionable suggestions for improvement. Focus on quantifying achievements, using stronger action verbs, and tailoring the content.>,
        "keywordFrequency": <An array of the top 5-7 most frequent and relevant technical skills or keywords found in the resume, along with their counts. Format as {"keyword": "KeywordName", "count": <number>}.>
      }
    `;

    try {
      const result = await model.generateContent(prompt, generationConfig);
      const response = result.response;
      let text = response.text();

      // **THE NEW, MORE ROBUST FIX:**
      // Find the first '{' and the last '}' to isolate the JSON object
      // from any extra text or markdown the model might have added.
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No valid JSON object found in the AI response.");
      }

      const jsonString = text.substring(startIndex, endIndex + 1);
      
      const analysisJson = JSON.parse(jsonString);
      
      console.log("--- [AI Service] Live analysis complete. ---");
      return analysisJson;
    } catch (error) {
      console.error("--- [AI Service] Error calling or parsing Gemini API response: ---", error);
      throw new Error("The AI analysis failed. The response may not be valid JSON.");
    }
  }
};

module.exports = aiAnalysis;
