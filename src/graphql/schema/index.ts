import fs from "fs";
import path from "path";

const buildSchema = (modules: string[]) => {
  let schema = "";
  modules.forEach(
    (name) =>
      (schema += fs
        .readFileSync(path.join(__dirname, `${name}.graphql`), "utf-8")
        .toString())
  );
  return schema;
};

export default buildSchema(["auth", "users", "user-content", "market"]);
