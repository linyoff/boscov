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
            className={`p-3 bg-primary text-primary rounded-lg focus:outline-none cursor-pointer ${className}`}
        >
            {children}
        </button>
    )
}

export default Button;

