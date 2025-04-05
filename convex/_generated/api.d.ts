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
import type * as lib_generate_code from "../lib/generate_code.js";
import type * as lib_get_channel from "../lib/get_channel.js";
import type * as lib_get_channels from "../lib/get_channels.js";
import type * as lib_get_member from "../lib/get_member.js";
import type * as lib_get_message from "../lib/get_message.js";
import type * as lib_index from "../lib/index.js";
import type * as lib_populate_member from "../lib/populate_member.js";
import type * as lib_populate_reactions from "../lib/populate_reactions.js";
import type * as lib_populate_thread from "../lib/populate_thread.js";
import type * as lib_populate_user from "../lib/populate_user.js";
import type * as models_channels from "../models/channels.js";
import type * as models_members from "../models/members.js";
import type * as models_messages from "../models/messages.js";
import type * as models_reactions from "../models/reactions.js";
import type * as models_upload from "../models/upload.js";
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
  "lib/generate_code": typeof lib_generate_code;
  "lib/get_channel": typeof lib_get_channel;
  "lib/get_channels": typeof lib_get_channels;
  "lib/get_member": typeof lib_get_member;
  "lib/get_message": typeof lib_get_message;
  "lib/index": typeof lib_index;
  "lib/populate_member": typeof lib_populate_member;
  "lib/populate_reactions": typeof lib_populate_reactions;
  "lib/populate_thread": typeof lib_populate_thread;
  "lib/populate_user": typeof lib_populate_user;
  "models/channels": typeof models_channels;
  "models/members": typeof models_members;
  "models/messages": typeof models_messages;
  "models/reactions": typeof models_reactions;
  "models/upload": typeof models_upload;
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
