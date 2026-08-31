// eslint-config-next 16 já exporta um array de flat config — não precisa
// (e não funciona com) FlatCompat.
import next from "eslint-config-next";

export default [
  ...next,
  { ignores: ["_ref_solvy/**", ".next/**", "node_modules/**"] },
];
