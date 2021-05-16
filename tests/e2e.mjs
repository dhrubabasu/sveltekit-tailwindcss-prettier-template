import * as ENV from "./setup/env.mjs";
import * as assert from "uvu/assert";
import * as uvu from "uvu";
import {get} from "httpie";
import HTMLParser from "node-html-parser";
const {parse} = HTMLParser;

function describe(name, fn) {
  const suite = uvu.suite(name);
  fn(suite);
  suite.before.each(ENV.reset);
  suite.after.each(ENV.exit);
  suite.run();
}

describe("e2e", (it) => {
  it("index page contains expected h1 elem", async (context) => {
    assert.not.ok(context.error, "build dir not found");
    const {statusCode, data} = await get(context.uri + "/");
    assert.is(statusCode, 200);
    assert.ok(data.includes(`<h1 class="font-bold text-gray-900">Hello world!</h1>`));
  });

  it("index page contains transformed css", async (context) => {
    assert.not.ok(context.error, "build dir not found");
    const res = await get(context.uri);
    assert.is(res.statusCode, 200);

    const element = parse(res.data)
      .querySelectorAll("link")
      .filter((link) => link.getAttribute("href").split(".").pop() == "css")[1];
    assert.ok(element);

    const {statusCode, data} = await get(context.uri + element.getAttribute("href").slice(2));
    assert.is(statusCode, 200);
    assert.not.ok(data.includes(`@tailwind`), "Postcss did not transform css file");
    assert.ok(
      data.includes(`.text-gray-900{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}`),
      "Missing expected `text-gray-900` class",
    );
    assert.ok(data.includes(`.font-bold{font-weight:700}`), "Missing expected `font-bold` class");
  });
});
