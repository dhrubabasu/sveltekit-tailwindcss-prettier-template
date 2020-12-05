import * as ENV from "./setup/env.mjs";
import * as assert from "uvu/assert";
import { suite } from "uvu";
import { get } from "httpie";

const e2e = suite("e2e");

e2e.before.each(ENV.reset);
e2e.after.each(ENV.exit);

e2e("index page contains expected h1 elem", async (context) => {
    const { statusCode, data } = await get(context.uri + "/");
    assert.is(statusCode, 200);
    assert.ok(data.includes(`<h1 class="font-bold text-gray-900">Hello world!</h1>`));
});

e2e("index page contains valid css", async (context) => {
    const res = await get(context.uri + "/_app/entry.css");
    assert.is(res.statusCode, 200);
    assert.ok(/@import \'start-[a-z0-9A-Z]{8}.css\';/.test(res.data));

    const { statusCode, data } = await get(
        context.uri + "/_app/" + res.data.match(/@import \'(start-[a-z0-9A-Z]{8}.css)\';/)[1]
    );
    assert.is(statusCode, 200);
    assert.not.ok(data.includes(`@tailwind`), "Postcss did not transform css file");
    assert.ok(
        data.includes(`.text-gray-900{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}`),
        "Missing expected `text-gray-900` class"
    );
    assert.ok(data.includes(`.font-bold{font-weight:700}`), "Missing expected `font-bold` class");
});

e2e.run();
