## Next

test: GraphQL Api tests - create test instance of database
test: Backend DataApi tests using test DB instance

test: Frontend end-to-end Tests using mock remote data
test: Frontend Remote-data tests
test: Frontend in-memory mock for Remote-data
test: Frontend DataApi tests
test: Integrated Frontend DataApi tests with backend.
test: Full end-to-end Tests
feat: Improve frontend logger and send to backend.
test: Testing everywhere
feat: Collapse times per day to end or start
feat: new time, edit time, delete time
feat: Time row comments
feat: Edit task name, delete task
feat: Add to task: Task type, task scope
feat: Only reload the one task when stopping or stopping
feat: multi user
feat: Change Apollo v6 to v7
At some point we need to have a get Task query that returns all the details in getAllTasks

---

### UI

feat(comp-lib/css): Install shadcn/ui & tailwind

### docs/chore

chore: Create a basic readme
chore: Start public git project, start tracking new features and bugs

### Tasks

feat(task-table): Time view would be rows under the Task items
feat(style) Make running tasks obvious
feat(time-util): Frond-end format duration to hours, minutes and seconds
feat(comp): Create component to Show time increasing every second while active

### Refactor

Better error handling
Convert backend to TypeScript
Better logging
Add tests

## Folders

Have a folder table

## Task Times

Remove time entry
Add time entry
Edit time entry
Collapse time to start
Collapse time to end

## archive

feat(archive): Add archive flag to task table
feat(archive): Add archiveTask graphQL mutation
feat(archive): Have active and archive routes, home maps to active
feat(archive): Have top level links to archive and home
Have current and archived routes
Views: current tasks and archived tasks

## On Hold

### Tasks

feat(task-grid): On hover, show drop down menu (edit, view times), edit triggers dialog for Task edit
feat(task-grid): Show time list in grid view as a higher z-index

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
