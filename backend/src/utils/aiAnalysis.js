/**
 * aiAnalysis Utility (with Cover Letter)
 * @description Connects to the Google Gemini API for resume analysis and cover letter generation.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const aiAnalysis = {
  analyze: async (resumeText, jobDescription) => {
    console.log("--- [AI Service] Starting ENHANCED Gemini analysis ---");
    
    const generationConfig = {
      temperature: 0.4, 
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const prompt = `
      **Role:** You are an expert resume reviewer and senior hiring manager for a top tech company. Your feedback is critical, constructive, and highly valuable.

      **Context:** You have been given the text from a candidate's resume. You may also have a job description to compare it against. Your goal is to provide a detailed analysis that will genuinely help the candidate improve their resume and land more interviews.

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
      Analyze the provided texts and generate a JSON object with the following structure.

      **Strict Output Instructions:**
      1.  Your entire response must be a single, valid JSON object.
      2.  Do not include any text, explanations, or markdown formatting (like \`\`\`json) outside of the JSON object.

      **JSON Output Structure:**
      {
        "skillsMatch": <A percentage (number from 0-100) representing how well the resume's skills and experience align with the job description. If no job description is provided, estimate a general score based on the resume's overall quality and clarity for a generic role in its likely field.>,
        "missingSkills": <An array of 3-5 specific, high-impact skills or qualifications mentioned in the job description that are completely missing from the resume. If no job description, suggest 3-5 generally valuable skills for the candidate's likely career path.>,
        "formattingFeedback": <A single string of concise, professional feedback on the resume's formatting. Comment on readability, use of white space, consistency, and overall layout.>,
        "suggestions": <An array of 3-4 powerful, actionable suggestions for improvement. Focus on high-impact areas like quantifying achievements with metrics (e.g., "Increased sales by 20%"), using stronger action verbs, and tailoring the professional summary.>,
        "keywordFrequency": <An array of the top 5-7 most frequent and relevant professional keywords (technical skills, software, methodologies) found in the resume, along with their counts. Format as {"keyword": "KeywordName", "count": <number>}.>
      }
    `;

    try {
      const result = await model.generateContent(prompt, generationConfig);
      const response = result.response;
      let text = response.text();
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No valid JSON object found in the AI response.");
      }
      const jsonString = text.substring(startIndex, endIndex + 1);
      const analysisJson = JSON.parse(jsonString);
      console.log("--- [AI Service] Enhanced analysis complete. ---");
      return analysisJson;
    } catch (error) {
      console.error("--- [AI Service] Error calling or parsing Gemini API response: ---", error);
      throw new Error("The AI analysis failed. The response may not be valid JSON.");
    }
  },

  /**
   * @async
   * @function generateCoverLetter
   * @description Generates a cover letter based on a resume and job description.
   * @param {string} resumeText - The extracted text from the user's resume.
   * @param {string} jobDescription - The job description text.
   * @returns {Promise<string>} A promise that resolves with the generated cover letter text.
   */
  generateCoverLetter: async (resumeText, jobDescription) => {
    console.log("--- [AI Service] Starting Cover Letter Generation ---");

    const generationConfig = {
      temperature: 0.7, // Higher temperature for more creative writing
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
    };

    const prompt = `
      **Role:** You are a professional career writer with expertise in crafting compelling cover letters that get candidates noticed.

      **Context:** You have been provided with a candidate's resume text and the job description for a role they are applying for.

      **Resume Text:**
      """
      ${resumeText}
      """

      **Job Description:**
      """
      ${jobDescription}
      """

      **Task:**
      Write a professional, concise, and impactful cover letter. Follow these instructions precisely:
      1.  **Structure:** The cover letter should have three to four paragraphs.
      2.  **Introduction:** Start with a strong opening that grabs the reader's attention and clearly states the position being applied for.
      3.  **Body Paragraphs:** In the body, do not just repeat the resume. Instead, highlight 2-3 key experiences or skills from the resume and directly connect them to the most important requirements listed in the job description. Use specific examples.
      4.  **Closing:** Conclude with a confident closing that reiterates interest in the role and includes a clear call to action (e.g., "I am eager to discuss how my skills in [Key Skill] can benefit your team.").
      5.  **Tone:** Maintain a professional, confident, and enthusiastic tone throughout.
      6.  **Output:** Your response should be only the text of the cover letter. Do not include any extra headings, titles, or explanations.
    `;

    try {
      const result = await model.generateContent(prompt, generationConfig);
      const response = result.response;
      const coverLetterText = response.text();

      console.log("--- [AI Service] Cover Letter generation complete. ---");
      return coverLetterText;
    } catch (error) {
      console.error("--- [AI Service] Error generating cover letter: ---", error);
      throw new Error("The AI failed to generate a cover letter.");
    }
  }
};

module.exports = aiAnalysis;
