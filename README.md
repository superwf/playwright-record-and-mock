# Api recorder and mock tool for playwright

## a playwright tool for record api and replay

## Why this tool?

Why not use playwright native `recordHar` option?

The `recordHar` function of playwright use exact match of url,body,headers content for mock data.

This tool will record api data by order, and mock them with the same order.

## Install

```sh
yarn add -D playwright-record-and-mock
```

Then change the `playwright-record-and-mock.config.ts` content to yours setting.

## Usage

After install it, the `pram` cli is avalable, it is the shortcase of `playwright.config.ts`.

### Create config file

```sh
npx pram init
```

Then change the `pram` part in `playwright.config.ts`.

### run record

Record your test case in the browser by your own.

```sh
npx pram mytest1 // or npx record mytest1
```

Close the browser and it will 

The record playwright test case file will looks like below.

```typescript
import { test, expect } from '@playwright/test'
import { mock } from "playwright-record-and-mock"

test('test', async ({ page }) => {
  mock(page, __dirname)
  ...
})

```

For now, `pram` finishes its work, the next is all `playwright` work.

Just run `playwright test`.

## TODO

* custom plugable rule for record and mock.
