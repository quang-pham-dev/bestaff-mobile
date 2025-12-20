# Release Guide

This document outlines the release process for the **BestAff Mobile** monorepo. We use [Changesets](https://github.com/changesets/changesets) for versioning and changelog generation.

## 🔄 Release Workflow

The release process consists of three main steps:
1. **Changesets**: Developers add a changeset for every PR that warrants a version bump.
2. **Versioning**: Dependencies are updated, versions are bumped, and changelogs are written.
3. **Publishing**: Packages are published (if applicable) and git tags are created.

---

### 1. Creating a Changeset

When you make a change that affects the behavior of a package or the app, you must include a changeset. This allows us to track changes and automatically generate changelogs.

**When to add a changeset?**
- New features
- Bug fixes
- Breaking changes

**How to add a changeset?**
1. Run the following command in the root directory:
   ```bash
   pnpm changeset
   ```
2. Select the packages that have changed (use `Space` to select, `Enter` to confirm).
3. Select the semantic version bump type:
   - **patch**: Bug fixes (0.0.x)
   - **minor**: New features (0.x.0)
   - **major**: Breaking changes (x.0.0)
4. Write a summary of the changes. This text will appear in the `CHANGELOG.md`.

5. Commit the generated `.changeset/*.md` file with your PR.

---

### 2. Versioning

Once changesets are merged into the `develop` (or `main`) branch, we need to apply these changes to the `package.json` files and generate changelogs.

**Command:**
```bash
pnpm version-packages
```

**What this does:**
- Consumes all `.changeset/*.md` files.
- Updates the `version` in `package.json` for affected packages.
- Updates dependent packages if necessary.
- Appends the changes to `CHANGELOG.md` files.
- Removes the consumed changeset files.

> **Note:** In a CI/CD environment, this is often handled by a "Version Packages" pull request automatically created by the Changeset bot.

---

### 3. Releasing

After versioning, the final step is to "release". For a monorepo with apps and packages, this might mean publishing npm packages or simply creating git tags for the application.

**Command:**
```bash
pnpm release
```

**What this does (based on `package.json`):**
1. Runs `changeset version` (to ensure everything is up to date).
2. Runs `pnpm -r build` (builds all packages).
3. Runs `changeset publish` (publishes packages to the registry and creates git tags).

⚠️ **Important:** Ensure you are authenticated with the package registry if you are publishing packages.

---

### 📱 Mobile App Release

For the mobile application specifically, "Releasing" often involves building the native binaries and submitting them to the App Stores.

Refer to the **Deployment** section in `README.md` for these steps:
- `pnpm mobile:prebuild`
- `pnpm mobile:android:prod`
- `pnpm mobile:ios:prod`

Or use EAS:
- `eas build --platform ios --profile production`
- `eas build --platform android --profile production`

---

## 🛠 Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `pnpm changeset` | `changeset` | Interactive CLI to create a new changeset. |
| `pnpm version-packages` | `changeset version` | Bumps versions and updates changelogs based on changesets. |
| `pnpm release` | `changeset version && pnpm -r build && changeset publish` | Full release flow: version, build, and publish. |
