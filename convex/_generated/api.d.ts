/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as models_channels from "../models/channels.js";
import type * as models_members from "../models/members.js";
import type * as models_messages from "../models/messages.js";
import type * as models_users from "../models/users.js";
import type * as models_workspaces from "../models/workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "models/channels": typeof models_channels;
  "models/members": typeof models_members;
  "models/messages": typeof models_messages;
  "models/users": typeof models_users;
  "models/workspaces": typeof models_workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
