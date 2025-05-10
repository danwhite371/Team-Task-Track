# Team task track

## Third party reference

### Changes and versioning

- https://keepachangelog.com/
- https://semver.org/
- https://www.conventionalcommits.org/
- https://medium.com/opensight-ch/git-semantic-versioning-and-conventional-commits-564aece418a0

#### Commit Types

- feat: Introduces a new feature or functionality.
- fix: Patches a bug.
- docs: Adds or updates documentation.
- style: Improves code style without changing logic (formatting, spacing, etc.).
- refactor: Changes code without adding new features or fixing bugs (code restructuring).
- test: Adds or modifies tests.
- chore: Changes that don't modify src or test files (e.g., build scripts, CI configs).
- build: Changes that affect the build system or external dependencies.
- ci: Changes to CI/CD configuration files.
- perf: Improves performance.
- revert: Reverts a previous commit.
- breaking change: Indicates a change that is not backwards compatible.

#### Changelog

##### Changelog sections

- \#\#\# Added
- \#\#\# Changed
- \#\#\# Removed

### Git

- git tag
- git tag -l "v1"
- git tag -a v0.1.0
- git push origin v1.5

## Pages / routes

- Group / Folder views - can drill down and see all items in each groups
- Timers view - list all timers, showing group path
  - Order by last viewed
- Archived tasks

## Components

### TaskTimerCard

Name, elapsed time, (start or pause)

- Time interval list: start time, end time, durations
