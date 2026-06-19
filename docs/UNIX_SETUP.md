# Linux and macOS Setup Guide

This guide helps Linux and macOS users set up Open Source Starter Lab and verify that everything is working correctly.

## Install Git

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install git
```

### macOS

Install Xcode Command Line Tools:

```bash
xcode-select --install
```

Verify installation:

```bash
git --version
```

## Install Node.js

### Ubuntu / Debian

```bash
sudo apt install nodejs npm
```

### macOS (Homebrew)

```bash
brew install node
```

Verify installation:

```bash
node --version
npm --version
```

## Clone the Repository

```bash
git clone https://github.com/P-r-e-m-i-u-m/open-source-starter-lab.git
cd open-source-starter-lab
```

## Install Dependencies

```bash
npm install
```

## Verify the Setup

Run:

```bash
npm run check
```

If the command completes successfully, your environment is ready for contributions.

## Need Help?

If a command fails:

* Copy the full error message.
* Include your operating system.
* Run `git status` if the problem is Git-related.
* Ask for help in Discussions or comment on the issue you are working on.
