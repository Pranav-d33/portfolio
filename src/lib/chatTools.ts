export const portfolioTools = [
  {
    type: "function",
    function: {
      name: "scroll_to_section",
      description:
        "Scrolls the portfolio page to a section. Call this when the answer is about something that lives in one specific section of the page.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["about", "experience", "research", "writing", "projects", "contact"],
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
      description:
        "Opens the written case study for one of the projects. Only call when the visitor asks to read the details of a specific project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            enum: ["gnuradio-mcp", "tinystories", "medaura", "rf-watch"],
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
      description:
        "Scrolls to a project on the page and pulses it, so the visitor can see which one is being talked about.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            enum: ["gnuradio-mcp", "tinystories", "medaura", "rf-watch"],
          },
        },
        required: ["project"],
      },
    },
  },
];
