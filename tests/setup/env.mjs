import sirv from "sirv";
import polka from "polka";

const assets = sirv("build");

export const PORT = 3000;
export const HOSTNAME = "localhost";

export function reset(context) {
    context.app = polka();
    context.app.use(assets);
    context.app.listen(PORT, (err) => {
        if (err) throw err;
    });

    const { port } = context.app.server.address();
    context.uri = `http://localhost:${port}`;
}
