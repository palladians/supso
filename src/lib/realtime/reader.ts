import superjson from 'superjson';

type ToJsonProps = {
	body: ReadableStream<Uint8Array>;
	callback: (payload: never) => void;
};

export const toJSON = async ({ body, callback }: ToJsonProps) => {
	const reader = body.getReader();
	const decoder = new TextDecoder();

	const read = async (): Promise<void> => {
		const { done, value } = await reader.read();

		if (done) {
			return;
		}

		const chunk = decoder.decode(value, { stream: true });
		const data = chunk.split('data: ')[1];
		let payload;
		try {
			payload = superjson.parse(data);
		} catch {
			payload = [];
		}
		callback((payload as never) ?? []);
		return read();
	};

	await read();

	return {
		cancel: reader.cancel
	};
};
