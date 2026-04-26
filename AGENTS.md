# AGENTS.md

## Purpose

This repository is the frontend project for [Beluga - First-come, First-served Gifticon Service].
The purpose of this document is to guide AI coding assistants (like Codex) to make safe, minimal, and correct code changes that align with our team's conventions.

## Project Overview

- **Tech Stack:** Next.js, React, TypeScript, ESLint, Tailwind CSS, TanStack Query
- **Core Goal:** Provide a seamless UI/UX during massive traffic spikes at event start times, and deliver fast, accurate feedback to users based on API responses (WIN, LOSE, DUPLICATE, etc.).
- **Non-goals:**
  - Do not introduce unrequested or unnecessary refactoring.
  - Do not replace core libraries (e.g., state management, data fetching) or frameworks without explicit permission.

## Working Style

- Prefer the smallest, most accurate code changes that fulfill the requirements.
- Maintain the existing architecture, folder structure, and naming conventions unless instructed otherwise.
- Follow surrounding code styles and patterns before inventing new ones. Aim for highly readable and reusable component structures so the team can focus on core development.
- Briefly explain trade-offs (e.g., SSR vs. CSR, rendering speed) when making critical decisions.
- If a request is ambiguous, ask focused questions before making risky changes.

## Planning

- For small changes, execute them directly.
- For risky tasks (e.g., cross-component changes, routing architecture updates), propose a short plan first.
- For multi-step tasks, provide a checklist in your response and update the progress as you go.

## Editing Rules

- Do not arbitrarily change public API fetching functions, environment variable names, or route paths unless explicitly requested.
- Do not modify formatting in unrelated files or lockfiles unless necessary.
- Keep diffs tight and localized.
- Prefer modifying existing files over creating new abstractions, unless code duplication is clearly harmful.
- Always keep rendering speed optimization and client bundle size minimization in mind.

## Code Quality

- Code must be readable and intuitive.
- Prefer explicit naming over clever/obscure naming.
- Add comments only when the intent is not obvious from the code itself.
- Handle errors at the appropriate boundaries (e.g., toast notifications for event participation failures, form validation, etc.).
- Avoid premature optimization, but strictly prevent unnecessary re-renders.

## Testing and Verification

- After modifying code, perform the smallest meaningful verification.
- Prefer targeted tests over full test suites.
- If a change affects UI/UX or user interaction, explicitly explain how to manually verify it in the browser.

## Build and Run Commands

- Install packages: `pnpm install`
- Local development: `pnpm run dev`
- Build: `pnpm run build`
- Lint: `pnpm run lint`

## Repository Conventions

- **Branch Naming:**
  - `feat/<short-description>`: New features (branch off from `dev`)
  - `fix/<short-description>`: Bug fixes (branch off from `main` or `dev`)
- **Commit Style:**
  - `feat`: New feature
  - `fix`: Bug fix
  - `refactor`: Structural improvement without functional changes (e.g., separating UI components)
  - `test`: Adding/modifying tests
  - `docs`: Documentation updates
  - `chore`: Chores like config, build, or package updates
- **API and Error Handling Conventions:**
  - REST API & JSON-based communication.
  - UI branching is strictly required based on the event participation API result status (`WIN`, `LOSE`, `DUPLICATE`, `BEFORE_START`, `ENDED`, `INVALID_REQUEST`, `NOT_FOUND`, `SYSTEM_ERROR`).
  - Parse standardized error responses (code/message/timestamp) and render user-friendly messages.

## Security and Safety

- NEVER hardcode API keys, secrets, tokens, or passwords.
- Be extremely careful not to use the `NEXT_PUBLIC_` prefix for environment variables that should not be exposed to the client browser.
- Do not output sensitive values (user info, tokens) to `console.log`.
- Authentication flows (signup/login) are high-risk areas; ask before making broad changes.

## Dependencies

- Prioritize libraries already defined in `package.json` (e.g., Tailwind, specific icon libraries).
- Do not add new libraries without a valid reason.
- If adding a dependency is necessary, explain why the existing stack is insufficient.

## Documentation Updates

- Update relevant documentation or README if component usage, environment variables, or commands change.
- If a new environment variable is added, you MUST include an example in the `.env.example` file.

## Output Expectations

- Summarize what changed.
- List the files touched.
- Report the verification performed.
- Mention follow-up risks or next steps only if they are real and relevant.

## Absolute Don'ts

- Do not fabricate test results.
- Do not claim code was run if it was not.
- Do not touch unrelated components or routes under the guise of "cleaning things up."
- Do not silently ignore build errors or TypeScript (Type Check) errors.
