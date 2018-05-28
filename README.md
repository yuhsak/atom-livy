# Atom Livy

Atom package for working with Apache Livy Web API

## Features

- Execute statement directly from atom editor
- Execute statements separately by dividing into some blocks
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
	- Livy endpoints by url (can be specified with multiple values separeted by commas)
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

### Statements separation

```python

print("Code devided by '#%%' will be executed separetely.")

#%%
print("You can choose the block by focusing editor cursor.")

#%%
print("Give it a try!")

```