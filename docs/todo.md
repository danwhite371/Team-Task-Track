## Next

move queries into data-utils
Add backend connection error to tests

Create a shared queries file for all projects.

### v0.3.0 - Robust minimal features

- feat: Use npm workspaces and have queries as a shared file.
- feat: Add backend messaging to frontend
- feat: Improve frontend logger and send to backend.
- feat: Use an immutable data library (Immer)

### v0.4.0 - Single user - more features

- feat: Collapse times per day to end or start
- feat: new time, edit time, delete time
- feat: Time row comments
- feat: Edit task name, delete task
- feat: Add to task: Task type, task scope

### v0.5.0 - Multi user

### v0.6.0 - Complete testing

- test: Frontend in-memory mock for Remote-data
- test: Frontend DataApi tests
- test: Frontend Remote-data tests
- test: GraphQL Resolvers tests

### v1.0.0 - Update

- feat: Change Apollo v6 to v7

### future

- feat: Update Sequelize when it's ready.
- feat: Create self-contained standalone desktop version.
- feat: Create VS Code plugin to start and stop task times based on current file.

---

## Task Times

- Remove time entry
- Add time entry
- Edit time entry
- Collapse time to start
- Collapse time to end

## archive

- feat(archive): Add archive flag to task table
- feat(archive): Add archiveTask graphQL mutation
- feat(archive): Have active and archive routes, home maps to active
- feat(archive): Have top level links to archive and home
- Have current and archived routes
- Views: current tasks and archived tasks

## On Hold

### Tasks

- feat(task-grid): On hover, show drop down menu (edit, view times), edit triggers dialog for Task edit
- feat(task-grid): Show time list in grid view as a higher z-index

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
