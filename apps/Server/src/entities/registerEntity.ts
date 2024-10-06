import * as z from "zod";

export const RegisterEntity = z.object({
	username: z.string(),
	password: z.string(),
});

export type RegisterType = z.infer<typeof RegisterEntity>;
