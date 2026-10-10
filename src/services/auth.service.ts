import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

import {
  LoginModeratorInput,
  RegisterModeratorInput,
} from "../validators/auth.validator";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export async function registerModerator(
  input: RegisterModeratorInput
) {
  const existingModerator = await prisma.moderator.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingModerator) {
    throw new Error("MODERATOR_ALREADY_EXISTS");
  }

  const passwordHash = await argon2.hash(input.password);

  return prisma.moderator.create({
    data: {
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function loginModerator(
  input: LoginModeratorInput
) {
  const moderator = await prisma.moderator.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!moderator) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordValid = await argon2.verify(
    moderator.passwordHash,
    input.password
  );

  if (!passwordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      sub: moderator.id,
      role: moderator.role,
      email: moderator.email,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  return {
    token,
    moderator: {
      id: moderator.id,
      email: moderator.email,
      role: moderator.role,
    },
  };
}