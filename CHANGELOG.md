# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add task times inner tables on request
- New task is now hidable with a toggle button
- Created a timer component which increases time every second
- Created a function to use current time and last time for a duration
- Created component to render a time interval
- Updated Task query to have active and lastDate for ordering, no longer return times in the Task query
- Installed shadcn/ui & tailwind
- Move reference docs to a separate project
- Move todo and done to parent folder

### Changed

- Use table for task display
- Improved main page visually

### Removed

- Grid display

## [0.1.0] - 2025-05-10

### Added

- Versioning
- CHANGELOG.ME
- Colors to start/stop buttons
- graphQL mutation - changeTaskName
- graphQL mutation - deleteTask
- Duration to Tasks and TaskTimers
- taskTimes to task data
- graphQL mutations - startTask and stopTask
- Start & pause buttons
- newTaskForm
- Listing Tasks in any oder
- taskTimes to TaskTimerCard
- TaskTimerCard
- graphQL mutations - createTask
- graphQL queries - getTaskTimes, getAllTasks
