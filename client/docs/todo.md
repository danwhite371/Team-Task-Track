\*\*\* We can start using this to track our time

chore: Create a basic readme
chore: Start public git project, start tracking new features and bugs
feat(time-util): Frond-end format duration to hours, minutes and seconds
feat(comp): Create component to Show time increasing every second while active
feat(comp-lib/css): switch to shadcn/ui
feat(style) Make running tasks obvious
feat(archive): Add archive flag to task table
feat(archive): Add archiveTask graphQL mutation
feat(archive): Have active and archive routes, home maps to active
feat(archive): Have top level links to archive and home
Have current and archived routes
Views: current tasks and archived tasks
Order tasks by most recent time change,
Remove time entry
Add time entry
Edit time entry
Have a group table
Collapse time to start
Collapse time to end

## Should we do

- Have a done state for a timer. So you would see a start button a stop button or?
  - At some point we are also going to want to add edit and delete time data for a task.
  - Let's have a start / stop toggle button
  - And a dropdown
    - Delete task
    - Edit task
    - Finish or end timer
    - New time
    - Edit time
    - Delete time
  - A radio select for the time entries
- Should we have only one timer at a time running?
  - Or have a timer group that only allows one at a time?
  - So that I can click on one and the current running one would stop.
