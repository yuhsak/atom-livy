# Atom Livy

Atom package for working with Apache Livy Web API

## Features

- Execute statement directly from atom editor
- List/swicth multiple sessions
- List/switch multiple Livy endpoints

## Usage

### Installation

```bash
$ apm install atom-livy
```

or type 'atom-livy' in GUI package manager.

### Settings

- Endpoints
	- Livy endpoints by url
	- `Default` http://localhost:8998

### Commands

- `atom-livy:select-endpoint`
	- Select one from configured livy endpoints
- `atom-livy:select-session`
	- Select dest session
	- `Shortcut` shift-enter
- `atom-livy:execute-statement`
	- Execute editor content as a spark statement
	- `Shortcut` ctrl-enter