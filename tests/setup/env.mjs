import sirv from "sirv";
import polka from "polka";
import {existsSync} from "fs";

const PORT = 3000;
const HOSTNAME = "localhost";

export function reset(context) {
  if (!existsSync("./build")) {
    context.error = true;
    // throw new Error('build dir not found');
  } else {
    context.app = polka();
    context.app.use(sirv("build"));
    context.app.listen(PORT, (err) => {
      if (err) throw err;
    });

    context.uri = `http://${HOSTNAME}:${PORT}`;
  }
}

export function exit(context) {
  if ("app" in context) {
    context.app.server.close();
  }
}
