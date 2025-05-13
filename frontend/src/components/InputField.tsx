interface InputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    required?: boolean;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const InputField: React.FC<InputProps> = ({
    label,
    name, 
    type = "text",
    value,
    required = false,
    className = "",
    onChange
}) => {
    return (
        <div className={`w-full ${className}`}>
            <label htmlFor={name} className="block text-textPrimary mb-1">{label}</label>
            <input
                id={name}
                name={name} 
                type={type}
                value={value}
                required={required}
                className={`p-3 border rounded-lg w-full ${className}`}
                onChange={onChange}
            />
        </div>
    );
};


export default InputField;