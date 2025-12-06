# Maestro end-to-end

Maestro is an end-to-end tool([aka UI testing tool](https://maestro.mobile.dev/)).
It is used like other tools such as Cypress, Appium, and Detox in order to run tests over scenarios.

## Steps to run

1. install maestro by following the instructions [here](https://maestro.mobile.dev/getting-started/installing-maestro)
   - `curl -Ls "https://get.maestro.mobile.dev" | bash`
   - `brew tap facebook/fb`
   - `brew install facebook/fb/idb-companion`

#### iOS

1. Set `IS_TESTING=true` in your `.env` file.

2. Build and run the app in release mode: `pnpm run ios --mode Release`. It is also possible to run it in development mode to make debugging easier, but will diverge from what is ran on CI.

3. Run `./scripts/e2e-run.sh` to run the full test suite. It is also possible to run a specific test by using the `--flow <path_to_file>` flag. For example to only run the import wallet test use `./scripts/e2e-run.sh --flow ./e2e/flows/deeplinks`.

#### Android

1. Set `IS_TESTING=true` in your `.env` file.

2. Build and run the app in release mode: `pnpm run android --mode Release`. It is also possible to run it in development mode to make debugging easier, but will diverge from what is ran on CI.

3. Run `./scripts/e2e-run.sh` to run the full test suite. It is also possible to run a specific test by using the `--flow <path_to_file>` flag. For example to only run the import wallet test use `./scripts/e2e-run.sh --flow ./e2e/flows/deeplinks`.

### Debug CI failures

### E2E test commands

To speedup getting the app into a specific state, we implement some commands. This is a deep link that we send to the app so it performs certain actions. The actions are implemented in `src/components/TestDeeplink.tsx`, and can be launched by using the following yaml.

```yaml
- openLink: bestaff://e2e/<command>?param1=value1&param2=value2
```

### Troubleshooting

#### Cannot find view with a testID on iOS

On iOS `testID` is implemented using `accessibilityIdentifier`. If a parent view is marked as `accessible=true` then it is considered a leaf node and its children `accessibilityIdentifier` won't be visible. Try moving the `testID` up to the accessible view or making the view not accessible if it makes sense in that case. Note that `ButtonPressAnimation` defaults to `accessible=true`.

For example:

```tsx
<ButtonPressAnimation>
  <View testID="test" />
</ButtonPressAnimation>
```

Will not work, instead use:

```tsx
<ButtonPressAnimation testID="test">
  <View />
</ButtonPressAnimation>
```

#### Long wait time between actions

Maestro waits for the app to be settled before moving on to the next actions. If it seems to be waiting too much this is most likely caused by looping animations preventing it from settling. If you see any animation, you can use the `IS_TEST` from `@/env` to disable them for e2e tests only.

#### Flaky check

Flakyness will happen sometimes, it can be mitigated by having Maestro retry certain commands. See https://docs.maestro.dev/api-reference/commands/retry for more info.

```yaml
- retry:
    maxRetries: 3
    commands:
      # ... flaky commands
```
