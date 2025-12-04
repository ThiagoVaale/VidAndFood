export function parseJwt(token) {
  try {
    if (typeof token !== "string") {
      console.error("parseJwt: token no es un string válido:", token);
      return null;
    }

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Error al parsear JWT:", err);
    return null;
  }
}

export function mapClaimsToUser(claims) {
  if (!claims) return null;

  return {
    id:
      claims[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
    email:
      claims[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    role:
      claims[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
    fullName:
      claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    exp: claims.exp,
  };
}
