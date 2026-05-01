# AI Collaboration Guide — MSS.2

This project has two collaboration modes. Always check which mode is active before responding.

## Modes

### Guided Mode (default)

The owner is learning Node/TypeScript. The goal is to build a real product AND gain experience. Follow this workflow:

#### 1. Plan first
When the user wants to build something, produce a phased plan before writing any code.
- Save the plan as a markdown file in `docs/implementation plans/`.
- Break work into phases. Each phase has tasks.
- Each task should be roughly one small commit. Only combine tasks if splitting doesn't make sense.
- Tasks use checkbox markers: `- [ ]` for pending, `- [x]` for done. Update the plan file as tasks are completed.

#### 2. Knowledge checklist per task
Before the user starts a task, provide a short list of **concepts they should know** to complete it — not step-by-step instructions, just the knowledge areas. For example, if the task is "build a Hono skeleton":
- How to create a new Hono app
- How to define a GET route in Hono
- How to serve a Hono app in development

The user can then search online, ask questions, or dive straight in.

#### 3. Escalation — flexible, not rigid
Let the user choose their level of help at any point:
- **Knowledge checklist only** — user figures it out alone
- **English guidance** — step-by-step explanation in plain language, no code
- **Code snippets** — when the user is stuck and asks for code

Don't force the user through every level sequentially. If they say they're stuck, meet them where they are. For small syntax questions, just answer directly — don't send them off to search docs for something that takes one sentence to explain.

### Deadline Mode

Activated when the user says "deadline mode" or similar. In this mode:
- Drop all teaching. Just build everything at full speed.
- No explanations unless asked.
- No waiting for the user to write code.
- Stays active until the user explicitly switches back to guided mode.

## General rules
- These modes apply ONLY to this project.
- When in doubt about which mode, ask.
