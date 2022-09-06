# Api recorder and mock tool for playwright

## a playwright tool for record api and replay

## Why this tool born?

Why not use playwright native `recordHar` option?

The `recordHar` function of playwright use exact match of url,body,headers content for mock data.

This tool will record api data by request order, and replay them with the same order.

## Precondition

⚠️  Must install `@playwright/test`.

## Install

```sh
yarn add -D @playwright/test playwright-record-and-mock
```

## Usage steps

After install it, the `pram` cli is avalable, it is the shortcase of `playwright-record-and-mock`.

1. Create `playwright` ts format config, content like below.

    ```typescript
    import type { PlaywrightTestConfig } from '@playwright/test'

    const config: PlaywrightTestConfig = {
      projects: [
        {
          name: 'Chrome Stable',
          testDir: 'e2e',
          use: {
            headless: false,
            browserName: 'chromium',
            channel: 'chrome',
            viewport: { width: 1920, height: 1080 },
          },
        },
      ],
    }
    export default config
    ```

1. run `pram` command for configure.

    ```sh
    pram init
    ```

    The command will change `playwright.config.ts` content.

    Then the `playwright.config.ts` should like below.

    ```typescript
    import type { PlaywrightTestConfig } from '@playwright/test'
    import type { PramConfig } from 'playwright-record-and-mock'

    const config: PlaywrightTestConfig & PramConfig = {
      projects: [
        {
          name: 'Chrome Stable',
          testDir: 'e2e',
          use: {
            headless: false,
            browserName: 'chromium',
            channel: 'chrome',
            viewport: { width: 1920, height: 1080 },
          },
        },
      ],
      pram: {
        outDir: 'e2e',
        site: 'https://your.host/',
        urlFilter: /\/api\//,
      },
    }
    export default config
    ```

    Or else you can copy the `pram` part into `playwright.config.ts` by yourself.

1. run record by `pram` command.

    Record your test case in the browser by your own.

    ```sh
    yarn pram mytest1
    ```

    After record some browser acitons, close the browser and it will create dir `e2e/mytest1`, which contains the test case files.

    The test case file will looks like below.

    ```typescript
    import { test, expect } from '@playwright/test'
    import { mock } from "playwright-record-and-mock"

    test('test', async ({ page }) => {
      mock(page, __dirname)
      ...
    })

    ```

    For now, `pram` finishes its work, the next is all the work of `playwright`.

1. run `playwright test`.

```sh
yarn playwright test
```

## Api support.

* json

* text

## TODO

* custom plugable rule for record and mock.
