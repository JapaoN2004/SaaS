import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContractAttachment } from "../types";

const SYSTEM_INSTRUCTION = `
You are "Não Assine", a specialized legal consultant expert in Brazilian Real Estate Law (Lei do Inquilinato - Lei No 8.245/91). Your mission is to protect tenants (inquilinos) from abusive contracts.

**YOUR INSTRUCTIONS:**
1. Analyze the input document (rental contract) looking for specific risks.
2. DO NOT summarize the whole document. Focus only on critical clauses.
3. You MUST output your response strictly in Portuguese (Brazil).
4. You MUST use the exact emojis and headers defined below.

**RESPONSE STRUCTURE (Use Markdown):**

# 🛡️ RELATÓRIO DE SEGURANÇA

## 🔴 BANDEIRAS VERMELHAS (Risco Alto - Abusivo)
(List strictly illegal or highly dangerous clauses here. If none, say "Nenhuma irregularidade grave encontrada".)
- Look for: Fines above 3 months (multa abusiva), requiring painting without proof of prior state, transferring structural repair costs to tenant (art. 22), waiver of rights (renúncia ao direito de revisão).
- Format: **[Clause Topic]**: Brief explanation of why it is a trap.

## 🟡 BANDEIRAS AMARELAS (Atenção - Negociável)
(List clauses that are legal but expensive or strict.)
- Look for: IGP-M index (suggest IPCA), rigid visitor rules, pet bans (often contestable), short eviction notice.
- Format: **[Clause Topic]**: Advice on how to negotiate.

## 🟢 PONTOS POSITIVOS (Seguro)
(List 1 or 2 things that protect the tenant, e.g., 30-month term, fair deposit).

## 💬 MENSAGEM PARA O DONO (Copy & Paste)
(Draft a polite but firm short WhatsApp message for the tenant to send to the landlord/agency asking to fix the Red/Yellow flags identified above).

## ⚖️ VEREDITO FINAL
**Nota de Segurança:** [0 to 10]
**Resumo:** [One punchy sentence summarizing if they should sign or run away].

**IMPORTANT:**
- Be direct. Use simple language. Avoid "Juridiquês".
- If the text provided does not look like a contract, ask the user to upload a valid document.
`;

export const analyzeContractText = async (input: string | ContractAttachment): Promise<string> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Chave de API do Gemini não configurada. A análise não pode ser realizada no momento.");
    }

    // Initialize the Web SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    let promptParts: any[] = [];

    if (typeof input === 'string') {
      promptParts = [input];
    } else {
      // Handle Multimodal Input (PDF, Images) - Standard Web SDK format
      promptParts = [
        {
          inlineData: {
            mimeType: input.mimeType,
            data: input.data
          }
        },
        "Por favor, analise este documento de contrato de aluguel e identifique riscos e cláusulas abusivas conforme suas instruções."
      ];
    }

    // Reuseable retry function
    const generateWithRetry = async (retries = 3, delay = 1000) => {
      try {
        return await model.generateContent(promptParts);
      } catch (err: any) {
        if (retries > 0 && (err.message?.includes('503') || err.message?.includes('overloaded'))) {
          console.warn(`Gemini API overloaded. Retrying in ${delay}ms... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return generateWithRetry(retries - 1, delay * 2);
        }
        throw err;
      }
    };

    const result = await generateWithRetry();
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("A resposta da IA veio vazia. Tente novamente.");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Throw the actual error message to the UI for debugging
    throw new Error(error.message || error.toString() || "Falha desconhecida na API.");
  }
};
