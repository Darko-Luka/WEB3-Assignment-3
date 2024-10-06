import * as z from "zod";

export const LoginEntity = z.object({
	username: z.string(),
	password: z.string(),
});

export type LoginType = z.infer<typeof LoginEntity>;
