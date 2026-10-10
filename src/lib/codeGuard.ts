// Prompt rules alone don't stop a small model from writing code when pushed,
// so the stream is filtered: a code fence or a line that opens like code ends
// the reply with a redirect instead.

const CODE_LINE =
  /^\s*(?:```|~~~|def |class \w+\s*[(:]|import [\w{*]|from [\w.]+ import |function\s*\w*\s*\(|(?:const|let|var) \w+\s*=|#include|public (?:static )?\w|(?:for|while|if)\s*\(|SELECT\s|print\(|console\.\w+\(|\$ |npm |pip install|>>> |<\w+[\s>])/;

const FENCE = /```|~~~/;

// Enough characters to tell a code line from prose by its opening.
const DECIDE_LEN = 24;

export const CODE_REFUSAL =
  "I'll keep this a conversation rather than write code — happy to walk through how I approached it in my own projects instead.";

export class CodeGuard {
  private pending = "";
  private decided = false;
  private ticks = "";
  private emitted = false;
  blocked = false;

  feed(text: string): string {
    if (this.blocked) return "";
    let out = "";
    for (const ch of text) {
      if (!this.decided) {
        this.pending += ch;
        if (FENCE.test(this.pending)) return this.block(out);
        if (ch === "\n" || this.pending.length >= DECIDE_LEN) {
          if (CODE_LINE.test(this.pending)) return this.block(out);
          out += this.pending;
          this.decided = ch !== "\n";
          this.pending = "";
        }
        continue;
      }
      if (ch === "`" || ch === "~") {
        this.ticks += ch;
        if (this.ticks.length >= 3) return this.block(out);
        continue;
      }
      out += this.ticks + ch;
      this.ticks = "";
      if (ch === "\n") this.decided = false;
    }
    if (out) this.emitted = true;
    return out;
  }

  flush(): string {
    if (this.blocked) return "";
    if (!this.decided && CODE_LINE.test(this.pending)) return this.block("");
    const out = this.pending + this.ticks;
    this.pending = "";
    this.ticks = "";
    return out;
  }

  private block(out: string): string {
    this.blocked = true;
    const lead = out.trimEnd();
    const sep = lead || this.emitted ? "\n\n" : "";
    return lead + sep + CODE_REFUSAL;
  }
}
