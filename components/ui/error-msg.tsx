import { Text } from "./text";

interface ErrorMsgProps {
    message?: string;
}
const ErrorMsg = ({ message }: ErrorMsgProps) => {
    return (
        <Text variant="error" >{message}</Text>
    );
};

export default ErrorMsg;