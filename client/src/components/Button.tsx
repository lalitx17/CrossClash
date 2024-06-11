export const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
    return <button onClick={onClick} className="px-8 py-4 mx-auto text-2xl bg-button hover:bg-buttonFocus text-white font-bold rounded">
        {children}
    </button>
}