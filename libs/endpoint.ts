import { JwtUser } from "./jwt";
import jwt from "./jwt";
import type { NextApiRequest, NextApiResponse } from "next";
import Result from "./Result";
import { z, ZodSchema } from "zod";
import prisma from "./prisma";
import { ApiKey } from "@prisma/client";

/**
 * This is the error returned by any endpoint when something goes wrong.
 */
export type Error = {
  /**
   * This is the HTTP status code to send back
   */
  code: number;
  /**
   * This is the message that should be displayed to the user
   */
  message: string;
};

/**
 *  A helper for authenticated endpoints
 *
 * @param handler The function to handle the call. It will only
 *    be called if the data sent is valid. It is given two parameters:
 *      - The first is the user making the call. It is either a `JwtUser`
 *        if it's coming from the app, or an `ApiKey` if it's coming from
 *        a third party API call.
 *      - The second parameter is the payload of the call (if applicable).
 *        It has been parsed according to the provided validator.
 * @param validator A zod validation schema to validate incoming data.
 *    Route parameters, URL parameters and JSON body will be merged
 *    together. If you do not expect data, you do not have to pass a
 *    validator.
 */
export const authentified =
  <ValidationSchema extends ZodSchema, R>(
    handler: (
      user: JwtUser | ApiKey,
      payload: z.infer<ValidationSchema>
    ) => Promise<Result<R, Error>>,
    validator?: ValidationSchema
  ) =>
  async (request: NextApiRequest): Promise<Result<R, Error>> => {
    const apiKey =
      request.headers.authorization &&
      request.headers.authorization.split("Bearer ")[1];

    const token = request.cookies["jwt"];

    if (!token && !apiKey) {
      return Promise.resolve(
        Result.err({
          code: 401,
          message: "Your session has expired. Please signin again.",
        })
      );
    }

    try {
      const user = token
        ? jwt.read(token)
        : await prisma.apiKey.findUniqueOrThrow({
            where: {
              key: apiKey,
            },
          });

      if (apiKey) {
        await prisma.apiKey.update({
          where: {
            key: apiKey,
          },
          data: {
            lastUsedAt: new Date(),
          },
        });
      }

      return visitor((payload) => handler(user, payload), validator)(request);
    } catch (error) {
      return Promise.resolve(
        Result.err({
          code: 401,
          message: "Your session has expired. Please signin again.",
        })
      );
    }
  };

/**
 *  A helper for unauthenticated endpoints
 *
 * @param handler The function to handle the call. It will only
 *    be called if the data sent is valid. It is given on parameter,
 *    the payload of the call (if applicable). It has been parsed
 *    according to the provided validator.
 * @param validator A zod validation schema to validate incoming data.
 *    Route parameters, URL parameters and JSON body will be merged
 *    together. If you do not expect data, you do not have to pass a
 *    validator.
 */
export const visitor =
  <ValidationSchema extends ZodSchema, R>(
    handler: (payload: z.infer<ValidationSchema>) => Promise<Result<R, Error>>,
    validator?: ValidationSchema
  ) =>
  (request: NextApiRequest): Promise<Result<R, Error>> => {
    let payload: z.infer<ValidationSchema> = undefined;

    if (validator) {
      const validation = validator.safeParse({
        ...request.body,
        ...request.query,
      });
      if (validation.success) {
        payload = validation.data;
      } else {
        return Promise.resolve(
          Result.err({
            code: 400,
            message: validation.error.message,
          })
        );
      }
    }

    return handler(payload);
  };

type Endpoints<Get, Post, Put, Delete> = {
  /**
   * This is the GET endpoint handler
   */
  get?: (request: NextApiRequest) => Promise<Result<Get, Error>>;
  /**
   * This is the POST endpoint handler
   */
  post?: (request: NextApiRequest) => Promise<Result<Post, Error>>;
  /**
   * This is the PUT endpoint handler
   */
  put?: (request: NextApiRequest) => Promise<Result<Put, Error>>;
  /**
   * This is the DELETE endpoint handler
   */
  delete?: (request: NextApiRequest) => Promise<Result<Delete, Error>>;
};

/**
 * The basic global route handler.
 *
 * @param endpoints The list of supported HTTP verbs and their respective handlers
 * @returns
 */
export const handle =
  <Get, Post, Put, Delete>(endpoints: Endpoints<Get, Post, Put, Delete>) =>
  async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
    try {
      if (request.method === "GET") {
        if (endpoints.get) {
          return resultToResponse(await endpoints.get(request), response);
        }
      } else if (request.method === "POST") {
        if (endpoints.post) {
          return resultToResponse(await endpoints.post(request), response);
        }
      } else if (request.method === "PUT") {
        if (endpoints.put) {
          return resultToResponse(await endpoints.put(request), response);
        }
      } else if (request.method === "DELETE") {
        if (endpoints.delete) {
          return resultToResponse(await endpoints.delete(request), response);
        }
      }

      return response.status(405).json({ message: "Wrong method" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Something wrong happened" });
    }
  };

/**
 * A simple helper transforming a `Result` in a `NextApiResponse`.
 */
const resultToResponse = <Data>(
  result: Result<Data, Error>,
  response: NextApiResponse
): void =>
  result.unwrap(
    (data) => response.status(200).json(data),
    (error) => response.status(error.code).json({ message: error.message })
  );
