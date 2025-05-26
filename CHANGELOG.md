# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Change to a consistent file naming convention: snake_case.

## [0.2.0] - 2025-05-25

### Added

- A Playwright frontend end-to-end test using mock remote data.
- A stopServer GraphQL endpoint, to be called from tests and a start batch script
- Logging to a file.
- Backend DataApi tests using test DB instance
- Improved data efficiency, backend error handling and backend logging.
- Integrate logger with Sequelize.
- Create Apollo plugin for pino logging.
- Refactor frontend queries and added operationName for backend logging.
- Logging on server, Pino.
- Query for getting a task that returns all the info returned in getAllTasks.
- Moved personal info to .env file, installed dotenv to load it.
- JavaScript converted to TypeScript on the backend.
- Add task times inner tables on request.
- New task is now hidable with a toggle button.
- Created a timer component which increases time every second.
- Created a function to use current time and last time for a duration.
- Created component to render a time interval.
- Updated Task query to have active and lastDate for ordering, no longer return times in the Task query.
- Installed shadcn/ui & tailwind.
- Move reference docs to a separate project.
- Move todo and done to parent folder.

### Changed

- Change backend files setup, init-data and model, change setup to sequelize
- Use table for task display.
- Improved main page visually.

### Removed

- Grid display.

## [0.1.0] - 2025-05-10

### Added

- Versioning.
- CHANGELOG.md.
- Colors to start/stop buttons.
- graphQL mutation - changeTaskName.
- graphQL mutation - deleteTask.
- Duration to Tasks and TaskTimers.
- taskTimes to task data.
- graphQL mutations - startTask and stopTask.
- Start & pause buttons.
- newTaskForm.
- Listing Tasks in any oder.
- taskTimes to TaskTimerCard.
- TaskTimerCard.
- graphQL mutations - createTask.
- graphQL queries - getTaskTimes, getAllTasks.
