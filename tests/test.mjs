import * as ENV from "./setup/env.mjs";
import * as assert from "uvu/assert";
import { suite } from "uvu";
import axios from "axios";

const e2e = suite("e2e");

e2e.before.each(ENV.reset);
e2e.after.each((context) => context.app.server.close());

e2e("index page contains expected h1 elem", async (context) => {
    const r = await axios.get(context.uri + "/");
    assert.is(r.status, 200);
    assert.ok(r.data.includes(`<h1 class="text-gray-900 font-bold">Hello world!</h1>`));
});

e2e("index page contains valid css", async (context) => {
    let r = await axios.get(context.uri + "/_app/entry.css");
    assert.is(r.status, 200);
    assert.ok(/@import \'navigation-[a-z0-9A-Z]{8}.css\';/.test(r.data));

    r = await axios.get(context.uri + "/_app/" + r.data.match(/@import \'(navigation-[a-z0-9A-Z]{8}.css)\';/)[1]);
    assert.is(r.status, 200);
    assert.not.ok(r.data.includes(`@tailwind`));
    assert.ok(r.data.includes(`.text-gray-900{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}`));
    assert.ok(r.data.includes(`.font-bold{font-weight:700}`));
});

e2e.run();
