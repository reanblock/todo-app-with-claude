default_prompt := "Get the current date, then go to https://simonwillison.net/, find the latest blog post by Simon, summarize it, and give it a rating out of 10."

default_qa_prompt := "Open the application at http://localhost:5173/. If it is not running or not accessible, stop this task and report back with reasons why you cannot continue. Verify that the Office Chore Manager hope page opens, verify that it's on the current month, verify that you can go and click the previous (Prev) and the next button to move back and forwards across different months and add a Chore by clicking the Add Chore button and confirm that it is available in the correct place on the calendar."

# List available commands
default:
    @just --list

# Playwright skill — direct (headless by default) - use as a sanity that everything is wired up correctly and to test basic functionality of the skill. 
test-playwright-skill headed="true" prompt=default_prompt:
    claude --dangerously-skip-permissions --model opus "/playwright-bowser (headed: {{headed}}) {{prompt}}"

# QA agent — structured user story validation
test-qa headed="true" prompt=default_qa_prompt:
    claude --dangerously-skip-permissions --model opus "Use a @bowser-qa-agent: (headed: {{headed}}) {{prompt}}"

# UI Review — parallel user story validation across all YAML stories
ui-review headed="headed" filter="" *flags="":
    claude --dangerously-skip-permissions --model opus "/bowser:ui-review {{headed}} {{filter}} {{flags}}"