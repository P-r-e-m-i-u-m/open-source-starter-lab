# Resolving Markdown Merge Conflicts in GitHub UI

Merge conflicts happen when two people change the same part of a file differently. GitHub's UI allows you to resolve these directly in your browser without needing to use the command line.

## How to Resolve Conflicts via GitHub UI

If you see a "This branch has conflicts that must be resolved" message in your Pull Request:

1. **Click the "Resolve conflicts" button** in the PR view.
2. **Identify the conflict markers**: GitHub will highlight the conflicting lines:
   - `<<<<<<<` : Your changes (the incoming changes).
   - `=======` : The separator between changes.
   - `>>>>>>>` : The existing changes (the target branch).
3. **Edit the file**: Manually remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and keep the version of the code that is correct.
4. **Mark as resolved**: Once the code looks correct, click the "Mark as resolved" button at the top right of the editor.
5. **Commit the merge**: Click "Commit merge" to finish the process.

Your PR will automatically update, and if all conflicts are resolved, you can proceed with the merge.