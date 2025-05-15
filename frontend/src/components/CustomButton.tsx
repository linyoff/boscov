interface ButtonProps {
    type?: "button" | "submit" | "reset"
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    type,
    className = "",
    children,
    onClick
}) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className={`${className} p-3 bg-secondary text-primary rounded-lg hover:bg-tertiary focus:outline-none cursor-pointer `}
        >
            {children}
        </button>
    )
}

export default Button;

