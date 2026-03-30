type StatusMessageProps = {
	message: string;
};

export const StatusMessage = ({ message }: StatusMessageProps) => {
	return <div className="status">{message}</div>;
};
