# Api recorder and mock plugin for playwright

## Why this tool?

Why not use playwright native `recordHar` option?

The `recordHar` function of playwright use exact match of url,body,headers content for mock data.

This tool will record api data by order, and mock them with the same order.

## Install

```sh
yarn add -D playwright-record-and-mock
```

Then change the `playwright-record-and-mock.config.js` content to yours setting.

## Usage

### Craete config

```sh
npx pram init
```

### run record

Record your test case in the browser.

```sh
npx pram mytest1 // or npx record mytest1
```

Close the browser and it will 

In your playwright test case file.

```typescript
import { test, expect } from '@playwright/test'
import { mock } from "playwright-record-and-mock"

test('test', async ({ page }) => {
  mock(page, 'mytest1')
  ...
})

```

Then, run first time `playwright test`, it will record the api data.

Rerun `playwright test`, the recorded api data will be used.
