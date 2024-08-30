import { dbString, port } from "./secret.js";
import server from "./src/app/app.js";
import db from "./src/app/db.js";

db(dbString)
  .then(() => {
    server.listen(port, () => {
      console.log(`app is listening at port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
