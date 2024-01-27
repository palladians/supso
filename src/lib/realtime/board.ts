import { toJSON } from './reader';

type BoardPayload = {
	eventsOrder: Record<string, string[]>;
};

type SubscribeProps = {
	accessToken: string;
	callback: (payload: BoardPayload) => void;
	boardId: string;
};

export const subscribeToBoard = async ({ accessToken, callback, boardId }: SubscribeProps) => {
	const { body } = await fetch(`/api/boards/stream?boardId=${boardId}`, {
		headers: { authorization: 'Bearer ' + accessToken }
	});
	if (!body) return;
	return toJSON({ body, callback });
};
