import sirv from "sirv";
import polka from "polka";

const PORT = 3000;
const HOSTNAME = "localhost";

export function reset(context) {
    context.app = polka();
    context.app.use(sirv("build"));
    context.app.listen(PORT, (err) => {
        if (err) throw err;
    });

    context.uri = `http://${HOSTNAME}:${PORT}`;
}

export function exit(context) {
    context.app.server.close();
}
