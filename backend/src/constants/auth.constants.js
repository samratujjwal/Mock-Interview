export const USER_ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

export const AUTH_PROVIDERS = Object.freeze({
  LOCAL: "local",
  GOOGLE: "google",
  GITHUB: "github",
});

export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLES));
export const AUTH_PROVIDER_VALUES = Object.freeze(
  Object.values(AUTH_PROVIDERS),
);

export const PASSWORD_HASH_MIN_LENGTH = 20;
export const REFRESH_TOKEN_HASH_MIN_LENGTH = 32;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
