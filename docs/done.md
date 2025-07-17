## Unreleased

- test: App data context
- test: FE Graphql testing
- refactor: Removed DataApi added AppDataContext
- refactor: tests, test data, and test utils
- test: task-table.test.tsx
- refactor: Improved frontend types and file structure.
- test: TimeTable component test
- test: Active Duration component test
- test: Duration component test
- test: TaskTable e2e tests.
- test: DataApi getAllTasks test with backend connection error tests
- refactor: Rename files some files
- test: Added client graphql should get all Tasks test
- test: Added client data_api createTask tests
- test: Added client graphql createTask tests
- feat: Added webServer for frontend to playwright.config
- feat: Changed playwright tests to use start_server.sh
- feat: Added pre-push githook
- test: Added Header test
- feat: Added messaging to all dataApi calls.
- refactor: Moved header from App to new Header component
- test: Create ete test for newTaskForm
- test: Create component test for newTaskForm
- feat: Added OperationResult messaging for createTask
- refactor: Backend error handling and tests
- bug: Change Active duration to use secondsDuration and lastTime,
- refactor: Consolidate checkTask functions.
- test: GraphQL Api tests.
- test: Add delete and changeName to dataApi tests.
- fix: README clean up.
- refactor: Change to a consistent file naming convention: snake_case.
- refactor: Remove old files.

## 0.2.0

- test: Frontend end-to-end Tests using mock remote data.
- feat: Added logging to a file.
- feat: stopServer GraphQL endpoint
- test: Backend DataApi tests using test DB instance
- refactor: Change backend files setup, init-data and model, change setup to sequelize
- feat: Improved data efficiency, backend error handling and backend logging
- feat: Integrate logger with Sequelize
- feat: Create Apollo plugin for pino logging
- feat: Refactor frontend queries adding operationName for backend logging
- feat: Add logging on server, Pino
- feat: Add query for getting a task that returns all the info returned in getAllTasks
- chore: Moved personal info to .env file, installed dotenv to load it.
- refactor: typescript on the backend
- feat: Add task times inner tables on request
- feat: Use table for task display
- style: Cleanup main page
- style: Increase name and header height
- style: Add a toggle button on header to show or hide new task
- feat(time): Create a timer component which increases time every second
- feat(time): Create function to use current time and last time for a duration
- feat(time): Created component to render a time interval
- feat: Updated Task query to have active and lastDate for ordering, no longer return times in the Task query
- chore: Move reference docs to a separate project
- docs: Move todo and done to parent folder

## 0.1.0

- doc: Start a change log
- chore: Versioning
- feat(style): Added colors to start/stop buttons
- feat: Added graphQL mutation - changeTaskName
- feat: Added graphQL mutation - deleteTask
- feat: Added duration to Tasks and TaskTimers
- feat: Add taskTimes to task data
- feat: Added graphQL mutations - startTask and stopTask
- feat: Added Start & pause buttons
- feat: Added newTaskForm
- feat: Listing Tasks in any oder
- feat: Added taskTimes to TaskTimerCard
- feat: Added TaskTimerCard
- feat: Added graphQL mutations - createTask
- feat: Added graphQL queries - getTaskTimes, getAllTasks
