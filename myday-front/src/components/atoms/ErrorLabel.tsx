
interface IProps {
    message: string
}

const ErrorLabel = (props: IProps) => {
    return (
        <>
            {
                (props.message && props.message.trim().length > 0) && <div className="badge badge-soft badge-error mb-2 mt-2">
                    <i className="bi bi-exclamation-triangle"></i> {props.message}
                </div>
            }
        </>
    );
};

export default ErrorLabel;