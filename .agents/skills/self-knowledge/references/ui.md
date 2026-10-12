# UI Layout

Posit Assistant's interface varies slightly between platforms, but the core layout is the same. In Positron it appears as a sidebar panel; in RStudio it appears in the sidebar; in the standalone app it fills the window with a top bar.

## Main Areas

From top to bottom:

1. **Header / Top Bar** — navigation and app-level controls
2. **Chat area** — scrollable message history
3. **Input area** — text input with surrounding controls

A conversation list is accessible from a dropdown in the header across all platforms.

## Header

**Left side:**
- New conversation button (plus icon)
- Conversation history toggle or dropdown

**Right side:**
- Overflow menu (three-dot icon) — export, import, conversation tree view, code display options, memory
- Settings (gear icon) — about dialog, configuration

## Chat Area

Messages appear in a scrollable list, alternating between user and assistant messages. Assistant messages render markdown with syntax-highlighted code blocks, math, and Mermaid diagrams.

**During streaming:**
- An animated spinner appears below the latest assistant message
- A "scroll to bottom" button floats above the input if the user has scrolled up

**Inline prompts that appear between messages:**
- **Permission approval** — an alert box with a description of what the tool wants to do, an optional code preview, and Allow / Decline buttons. The Allow button has a dropdown for "Allow once," "Allow for session," or "Always allow for project." Decline can include a text comment.
- **Mode exit confirmation** — appears when leaving plan mode or cleaning mode, with options to exit or continue.
- **AskUser tabs** — used in data cleaning mode and elsewhere. A tabbed panel above the input showing a question with selectable options (one may be marked "Recommended") and an optional free-text input. Multiple pending questions appear as separate tabs.

## Input Area

**Main row:**
- **Attachment button** (paperclip icon, left) — opens a file picker. Attached files appear as a preview strip above the input.
- **Text input** (center) — multiline, auto-expanding. Placeholder: "Ask Posit Assistant... Type / to see commands". Typing `/` opens the command picker popup; typing `@` opens a file mention picker.
- **Send / Stop button** (right) — sends the message, or stops generation during streaming.

**Status row (below the input):**

Not all controls are visible at all times — they appear or hide depending on model support, configuration, and available features.

Left side, in order:
- **Web search toggle** (globe icon) — enables/disables web search for the next response
- **Mode toggles** (notebook icons) — one button per available mode (e.g., plan mode, cleaning mode). Clicking an active mode exits it and returns to normal.
- **Thinking effort selector** (lightbulb icon) — options vary by model (e.g., Off / Low / Medium / High, and sometimes additional levels)
- **Sandbox toggle** (shield icon) — enable/disable OS-level sandboxing
- **Persona selector** — dropdown to switch assistant persona (hidden if only one persona)

Right side, in order:
- **Open files context** — shows files currently open in the editor
- **Session context toggle** — controls whether R/Python session info is included
- **Model selector** — dropdown showing available models and providers
- **Token counter** — circular progress indicator showing context usage. Click to open the Session HUD with a detailed token breakdown.

## Conversation List

Displays saved conversations grouped by date range (e.g., "Today", "Previous 7 Days"). Each entry shows a title or summary. Entries have a context menu or hover actions for renaming and deleting. An empty state message appears when there are no saved conversations.

## Banners

Banners appear above the input area in certain states:
- **Restricted mode** (yellow) — "Restricted mode — Project config files are ignored and all tool calls require approval." Links to trust the workspace or exit restricted mode.
- **YOLO mode** (red) — "Posit Assistant won't ask before using tools." Link to switch to approval mode.

## Command Picker

Triggered by typing `/` in the input. A popup menu listing available slash commands as `/{name}` with descriptions. Navigate with arrow keys, select with Enter, dismiss with Escape.

## Session HUD

Opens by clicking the token counter. Shows a breakdown of context usage with categories: System, Tools, Media, Chat, plus available and reserved capacity.
