export const portfolioTools = [
  {
    type: "function",
    function: {
      name: "scroll_to_section",
      description: "Scrolls the portfolio page to a specific section. Call this when the user asks about a topic that maps to a section.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["projects", "how-i-work", "reading", "education", "achievements", "contact"],
          },
        },
        required: ["section"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_case_study",
      description: "Opens the detailed case study for a specific project. Only call when user asks for details about a specific project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            enum: ["medaura", "slm", "gnuradio", "rfwatch", "hindi-bpe"],
          },
        },
        required: ["project"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "highlight_card",
      description: "Pulses a teal glow on a specific project card for 2 seconds to draw attention to it.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            enum: ["medaura", "slm", "gnuradio", "rfwatch", "hindi-bpe"],
          },
        },
        required: ["project"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "scroll_to_paper",
      description: "Scrolls to the reading room and highlights a specific paper card.",
      parameters: {
        type: "object",
        properties: {
          paper: {
            type: "string",
            enum: ["react", "toolformer", "switch-transformers", "grpo", "dpo"],
          },
        },
        required: ["paper"],
      },
    },
  },
];
