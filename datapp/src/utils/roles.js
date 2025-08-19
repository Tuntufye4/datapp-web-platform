// utils/roles.js
export const baseByRole = (role) => {
  switch (role) {
    case "CHW":
      return "/api/chw_cases/";
    case "CO":
      return "/api/clinical_cases/";
    case "HSO":
      return "/api/hso_cases/";
    default:
      return "/api/chw_cases/";
  }
};
      