# First Pull Request Guide

## 1. Clone the Repo

```bash
git clone https://github.com/P-r-e-m-i-u-m/open-source-starter-lab.git
cd open-source-starter-lab
```

## 2. Create a Branch

```bash
git checkout -b docs/add-my-note
```

## 3. Make One Small Change

Good examples:

- Fix unclear wording
- Add one Git error and fix
- Add a docs example
- Add your contributor card

## 4. Test

```bash
npm install
npm run check
```

## 5. Commit

```bash
git add .
git commit -m "Add beginner Git note"
```

## 6. Push

```bash
git push origin docs/add-my-note
```

## 7. Open a Pull Request

In the pull request, include:

- What you changed
- Why it helps
- The result of `npm run check`
